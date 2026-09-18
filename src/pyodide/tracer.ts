export const TRACER_PYTHON = `
import sys, io, contextlib, json, builtins as _bi

_VIZ_SNAPSHOTS = []

# ---- Safety caps -------------------------------------------------------
MAX_FRAMES = 5000
MAX_WALLTIME_SEC = 5.0
MAX_VIZ_SNAPSHOTS = 500
MAX_STDOUT_BYTES = 100_000
MAX_STR_LEN = 200
MAX_NAME_LEN = 60
MAX_LABEL_LEN = 120
MAX_LIST_LEN = 100
MAX_DICT_LEN = 100
MAX_DEPTH = 4

# ---- Sandboxed import --------------------------------------------------
# Block modules that would let user code touch the DOM, cookies, network,
# spawn processes, or interact with Pyodide's own JS bridge.
BLOCKED_ROOT_MODULES = frozenset({
    'js', 'pyodide', 'pyodide_js', '_pyodide', 'pyodide_ffi', 'micropip',
    'subprocess', 'ctypes', 'socket', 'ssl',
    'urllib', 'urllib3', 'http', 'requests', 'httpx', 'websockets',
    'importlib', 'imp',
})

def _make_safe_import(orig):
    def _safe_import(name, globals=None, locals=None, fromlist=(), level=0):
        root = name.split('.')[0]
        if root in BLOCKED_ROOT_MODULES:
            raise ImportError(
                f'Import of {name!r} is blocked in the visualizer sandbox. '
                'Networking, subprocess, JS/DOM bridges and dynamic imports are disabled.'
            )
        # Also refuse imports from a "fromlist" that name a blocked root
        for item in (fromlist or ()):
            if isinstance(item, str) and item in BLOCKED_ROOT_MODULES:
                raise ImportError(f'Import of {item!r} via from-import is blocked.')
        return orig(name, globals, locals, fromlist, level)
    return _safe_import

# ---- Viz helper --------------------------------------------------------
def _cap_str(v, n=MAX_STR_LEN):
    if v is None: return None
    s = str(v)
    return s if len(s) <= n else s[:n] + '...'

class _Viz:
    def _guard(self):
        if len(_VIZ_SNAPSHOTS) >= MAX_VIZ_SNAPSHOTS:
            raise RuntimeError(f'Too many viz snapshots (>{MAX_VIZ_SNAPSHOTS}); throttle your viz.* calls.')
    def array(self, data, name='array', highlight=None, label=None):
        self._guard()
        _VIZ_SNAPSHOTS.append({
            'kind': 'array',
            'name': _cap_str(name, MAX_NAME_LEN),
            'data': [_safe(x) for x in list(data)[:MAX_LIST_LEN]],
            'highlight': list(highlight)[:MAX_LIST_LEN] if highlight is not None else None,
            'label': _cap_str(label, MAX_LABEL_LEN),
        })
    def matrix(self, data, name='matrix', highlight=None, label=None):
        self._guard()
        rows = list(data)[:MAX_LIST_LEN]
        _VIZ_SNAPSHOTS.append({
            'kind': 'matrix',
            'name': _cap_str(name, MAX_NAME_LEN),
            'data': [[_safe(x) for x in list(row)[:MAX_LIST_LEN]] for row in rows],
            'highlight': [list(h) for h in list(highlight)[:MAX_LIST_LEN]] if highlight is not None else None,
            'label': _cap_str(label, MAX_LABEL_LEN),
        })
    def graph(self, nodes, edges, name='graph', highlight_nodes=None, highlight_edges=None, label=None):
        self._guard()
        _VIZ_SNAPSHOTS.append({
            'kind': 'graph',
            'name': _cap_str(name, MAX_NAME_LEN),
            'data': {
                'nodes': [_safe(x) for x in list(nodes)[:MAX_LIST_LEN]],
                'edges': [list(e)[:2] for e in list(edges)[:MAX_LIST_LEN]],
            },
            'highlight_nodes': [_safe(x) for x in list(highlight_nodes)[:MAX_LIST_LEN]] if highlight_nodes is not None else None,
            'highlight_edges': [list(e)[:2] for e in list(highlight_edges)[:MAX_LIST_LEN]] if highlight_edges is not None else None,
            'label': _cap_str(label, MAX_LABEL_LEN),
        })
    def tree(self, root, name='tree', highlight=None, label=None):
        self._guard()
        _VIZ_SNAPSHOTS.append({
            'kind': 'tree',
            'name': _cap_str(name, MAX_NAME_LEN),
            'data': _safe(root, 0),
            'highlight': [_safe(x) for x in list(highlight)[:MAX_LIST_LEN]] if highlight is not None else None,
            'label': _cap_str(label, MAX_LABEL_LEN),
        })

viz = _Viz()

def _safe(v, depth=0):
    if depth > MAX_DEPTH:
        return '...'
    if isinstance(v, bool) or v is None:
        return v
    if isinstance(v, (int, float)):
        return v
    if isinstance(v, str):
        return v if len(v) <= MAX_STR_LEN else v[:MAX_STR_LEN] + '...'
    if isinstance(v, (list, tuple)):
        if len(v) > MAX_LIST_LEN:
            return [_safe(x, depth+1) for x in v[:MAX_LIST_LEN]] + ['...']
        return [_safe(x, depth+1) for x in v]
    if isinstance(v, dict):
        out = {}
        for i, (k, val) in enumerate(v.items()):
            if i >= MAX_DICT_LEN:
                out['...'] = '...'
                break
            key_str = str(k)
            out[key_str[:MAX_NAME_LEN]] = _safe(val, depth+1)
        return out
    if isinstance(v, set):
        return sorted([_safe(x, depth+1) for x in list(v)[:MAX_LIST_LEN]], key=lambda x: str(x))
    try:
        s = repr(v)
        return s if len(s) <= MAX_STR_LEN else s[:MAX_STR_LEN] + '...'
    except Exception:
        return '<unrepr>'

class ExecutionLimitError(Exception):
    pass

class _CappedStringIO(io.StringIO):
    """StringIO that raises after a configurable byte budget is exceeded."""
    def __init__(self, cap):
        super().__init__()
        self._cap = cap
    def write(self, s):
        # Compare against the *current* buffer plus incoming size in code points
        if self.tell() + len(s) > self._cap:
            raise ExecutionLimitError(f'stdout exceeded {self._cap} bytes')
        return super().write(s)

def run_with_trace(code_src):
    import time
    frames = []
    stdout_buf = _CappedStringIO(MAX_STDOUT_BYTES)
    src_lines = code_src.splitlines()
    started = time.time()
    limit_hit = [None]

    def tracer(frame, event, arg):
        if event not in ('line', 'return', 'call'):
            return tracer
        if frame.f_code.co_filename != '<user>':
            return tracer
        if len(frames) >= MAX_FRAMES:
            limit_hit[0] = f'Execution stopped: exceeded {MAX_FRAMES} trace steps (possible infinite loop).'
            raise ExecutionLimitError(limit_hit[0])
        if time.time() - started > MAX_WALLTIME_SEC:
            limit_hit[0] = f'Execution stopped: exceeded {MAX_WALLTIME_SEC:.0f}s wall time (possible infinite loop).'
            raise ExecutionLimitError(limit_hit[0])
        locals_snapshot = {}
        for k, v in list(frame.f_locals.items()):
            if k.startswith('__') or k == 'viz':
                continue
            try:
                locals_snapshot[k] = _safe(v)
            except Exception:
                locals_snapshot[k] = '<unrepr>'
        pending_viz = list(_VIZ_SNAPSHOTS)
        _VIZ_SNAPSHOTS.clear()
        if pending_viz and frames:
            frames[-1]['viz'] = frames[-1]['viz'] + pending_viz
        line = frame.f_lineno
        src = src_lines[line - 1] if 0 <= line - 1 < len(src_lines) else ''
        frames.append({
            'event': event,
            'line': line,
            'func': frame.f_code.co_name,
            'source': src,
            'locals': locals_snapshot,
            'stdout': stdout_buf.getvalue(),
            'viz': [],
        })
        return tracer

    try:
        compiled = compile(code_src, '<user>', 'exec')
    except SyntaxError as e:
        return json.dumps({'error': f'SyntaxError: {e}', 'frames': []})

    # Build a sandboxed builtins dict: strip network/prompt/help helpers,
    # override __import__ to enforce the blocklist above.
    safe_builtins = dict(vars(_bi))
    safe_builtins['__import__'] = _make_safe_import(_bi.__import__)
    for banned in ('input', 'help', 'breakpoint', 'open'):
        safe_builtins.pop(banned, None)

    exec_globals = {'viz': viz, '__name__': '__main__', '__builtins__': safe_builtins}
    err = None
    with contextlib.redirect_stdout(stdout_buf):
        sys.settrace(tracer)
        try:
            exec(compiled, exec_globals)
        except ExecutionLimitError as e:
            err = limit_hit[0] or str(e)
        except Exception as e:
            err = f'{type(e).__name__}: {e}'
        finally:
            sys.settrace(None)
    trailing = list(_VIZ_SNAPSHOTS)
    _VIZ_SNAPSHOTS.clear()
    if trailing and frames:
        frames[-1]['viz'] = frames[-1]['viz'] + trailing

    return json.dumps({
        'frames': frames,
        'stdout': stdout_buf.getvalue(),
        'error': err,
        'truncated': len(frames) >= MAX_FRAMES,
    })
`
