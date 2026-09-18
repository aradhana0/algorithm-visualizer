import { useEffect, useMemo, useRef, useState } from 'react'
import Editor, { type OnMount } from '@monaco-editor/react'
import {
  Play,
  Loader2,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
  ShieldCheck,
  Square,
} from 'lucide-react'
import { runTrace, stopTrace, subscribeReady, isPyodideReady, type TraceResult } from '../pyodide/runner'
import { useStepPlayer } from '../hooks/useStepPlayer'
import { PlaybackControls } from './PlaybackControls'
import { VizRenderer } from './VizRenderer'
import { AutoViz } from './AutoViz'
import { CODE_PRESETS, DEFAULT_CODE } from './CodePresets'

const STORAGE_KEY = 'algoviz.customCode'

export function CustomCodeVisualizer() {
  const [code, setCode] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ?? DEFAULT_CODE
    } catch {
      return DEFAULT_CODE
    }
  })
  const [status, setStatus] = useState<'idle' | 'loading-pyodide' | 'running' | 'ready' | 'error'>(
    'idle',
  )
  const [statusMsg, setStatusMsg] = useState('')
  const [trace, setTrace] = useState<TraceResult | null>(null)
  const [panelCollapsed, setPanelCollapsed] = useState(false)
  const [presetOpen, setPresetOpen] = useState(false)
  const [workerReady, setWorkerReady] = useState<boolean>(() => isPyodideReady())
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null)
  const monacoRef = useRef<Parameters<OnMount>[1] | null>(null)
  const decorRef = useRef<string[]>([])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, code)
    } catch {
      /* ignore quota errors */
    }
  }, [code])

  // Eagerly spawn the Pyodide worker on mount so the first Run doesn't wait
  // for the ~10 MB WASM download.
  useEffect(() => {
    subscribeReady(() => setWorkerReady(true))
  }, [])

  const frames = useMemo(() => trace?.frames ?? [], [trace])
  const player = useStepPlayer(frames, 200)

  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return
    const frame = player.current
    if (!frame) {
      decorRef.current = editorRef.current.deltaDecorations(decorRef.current, [])
      return
    }
    decorRef.current = editorRef.current.deltaDecorations(decorRef.current, [
      {
        range: new monacoRef.current.Range(frame.line, 1, frame.line, 1),
        options: {
          isWholeLine: true,
          className: 'viz-line-highlight',
          linesDecorationsClassName: 'viz-line-gutter',
        },
      },
    ])
    editorRef.current.revealLineInCenterIfOutsideViewport(frame.line)
  }, [player.current, player.step])

  async function handleRun() {
    setStatus(workerReady ? 'running' : 'loading-pyodide')
    setStatusMsg(
      workerReady
        ? 'Running in worker…'
        : 'Loading Python (Pyodide, ~10 MB) in a background worker…',
    )
    try {
      const res = await runTrace(code)
      setTrace(res)
      if (res.error) {
        setStatus('error')
        setStatusMsg(res.error)
      } else {
        setStatus('ready')
        setStatusMsg(
          `Captured ${res.frames.length} frames${res.truncated ? ' (truncated at 5000)' : ''}`,
        )
      }
    } catch (e: unknown) {
      setStatus('error')
      setStatusMsg(e instanceof Error ? e.message : String(e))
    }
  }

  function handleStop() {
    stopTrace()
    setStatus('idle')
    setStatusMsg('Stopped — worker terminated. Pyodide will reload on the next Run.')
    setWorkerReady(false)
    subscribeReady(() => setWorkerReady(true))
  }

  const current = player.current
  const prev = player.step > 0 ? frames[player.step - 1] : null
  const locals = current?.locals ?? {}
  const prevLocals = prev?.locals ?? {}
  const vizSnaps = current?.viz ?? []
  const stdout = current?.stdout ?? trace?.stdout ?? ''

  function loadPreset(id: string) {
    const preset = CODE_PRESETS.find((p) => p.id === id)
    if (preset) {
      setCode(preset.code)
      editorRef.current?.setValue(preset.code)
      setTrace(null)
      setStatus('idle')
      setStatusMsg('')
    }
    setPresetOpen(false)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border-subtle flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-text">Custom Python Code</h2>
            <span
              title={
                'Sandboxed:\n' +
                '• Runs in a Web Worker — main thread stays responsive, tab can be reclaimed via Stop\n' +
                '• Blocked imports: js, pyodide, subprocess, socket, urllib, http, requests, ctypes, micropip, importlib\n' +
                '• Removed builtins: input(), help(), open(), breakpoint()\n' +
                '• Caps: 5s wall time · 5000 trace steps · 500 viz snapshots · 100 KB stdout · 30s hard worker terminate'
              }
              className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-viz-sorted bg-viz-sorted/10 border border-viz-sorted/40 rounded px-2 py-0.5 cursor-help"
            >
              <ShieldCheck className="w-3 h-3" />
              sandboxed
            </span>
            <span
              title={
                workerReady
                  ? 'Pyodide loaded in worker; runs will be fast.'
                  : 'Pyodide is loading in a background worker (first run only).'
              }
              className={
                'inline-flex items-center gap-1 text-[10px] uppercase tracking-wider rounded px-2 py-0.5 cursor-help ' +
                (workerReady
                  ? 'text-viz-sorted bg-viz-sorted/10 border border-viz-sorted/40'
                  : 'text-text-muted bg-bg-hover border border-border-subtle')
              }
            >
              {workerReady ? (
                <>● worker ready</>
              ) : (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" /> loading worker
                </>
              )}
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Runs in-browser via Pyodide. Every executed line is captured with locals.
            Lists auto-render as array cells; use{' '}
            <code className="text-accent">viz.graph</code> /{' '}
            <code className="text-accent">viz.tree</code> for richer views.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setPresetOpen((o) => !o)}
              className="text-xs flex items-center gap-1.5 px-3 py-2 rounded bg-bg-hover hover:bg-border-subtle text-text-muted hover:text-text"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Presets
            </button>
            {presetOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-bg-panel border border-border-subtle rounded-md shadow-lg z-10 py-1">
                {CODE_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => loadPreset(p.id)}
                    className="w-full text-left px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-bg-hover"
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setPanelCollapsed((c) => !c)}
            className="text-xs flex items-center gap-1.5 px-3 py-2 rounded bg-bg-hover hover:bg-border-subtle text-text-muted hover:text-text"
            title={panelCollapsed ? 'Show inspector panel' : 'Hide inspector panel'}
          >
            {panelCollapsed ? (
              <>
                <PanelRightOpen className="w-3.5 h-3.5" />
                Show panel
              </>
            ) : (
              <>
                <PanelRightClose className="w-3.5 h-3.5" />
                Hide panel
              </>
            )}
          </button>
          {status === 'loading-pyodide' || status === 'running' ? (
            <button
              onClick={handleStop}
              className="flex items-center gap-2 px-4 py-2 rounded bg-viz-swap hover:bg-red-600 text-white"
              title="Terminate the Pyodide worker"
            >
              <Square className="w-4 h-4" fill="currentColor" />
              Stop
            </button>
          ) : (
            <button
              onClick={handleRun}
              className="flex items-center gap-2 px-4 py-2 rounded bg-accent hover:bg-accent-hover text-white"
            >
              <Play className="w-4 h-4" />
              Run
            </button>
          )}
        </div>
      </div>

      {statusMsg && (
        <div
          className={`px-6 py-2 text-xs font-mono border-b border-border-subtle ${
            status === 'error' ? 'text-red-400 bg-red-950/30' : 'text-text-muted'
          }`}
        >
          {statusMsg}
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 min-w-0 border-r border-border-subtle">
          <Editor
            language="python"
            theme="vs-dark"
            value={code}
            onChange={(v) => setCode(v ?? '')}
            onMount={(editor, monaco) => {
              editorRef.current = editor
              monacoRef.current = monaco
              const style = document.createElement('style')
              style.textContent = `
                .viz-line-highlight { background: rgba(139, 92, 246, 0.15) !important; }
                .viz-line-gutter { background: #8b5cf6; width: 3px !important; margin-left: 2px; }
              `
              document.head.appendChild(style)
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              scrollBeyondLastLine: false,
              lineNumbersMinChars: 3,
            }}
          />
        </div>

        {!panelCollapsed && (
          <div className="w-[440px] shrink-0 flex flex-col overflow-hidden bg-bg">
            <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-b border-border-subtle">
              {current
                ? `line ${current.line} · ${current.func || '<module>'} · frame ${player.step + 1}/${player.total}`
                : 'no active frame'}
            </div>

            {vizSnaps.length > 0 && (
              <div className="border-b border-border-subtle max-h-64 overflow-y-auto">
                <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim">
                  pinned (viz.*)
                </div>
                <div className="px-4 pb-3 space-y-2">
                  {vizSnaps.map((snap, i) => <VizRenderer key={i} snap={snap} />)}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim">
                locals (auto-rendered)
              </div>
              <div className="px-4 pb-4 space-y-2">
                {Object.keys(locals).length === 0 ? (
                  <div className="text-xs text-text-dim italic">no local variables</div>
                ) : (
                  Object.entries(locals).map(([k, v]) => {
                    const changed = !valuesEqual(v, prevLocals[k])
                    return <AutoViz key={k} name={k} value={v} changed={changed} />
                  })
                )}
              </div>
            </div>

            {stdout && (
              <div className="max-h-32 overflow-y-auto bg-bg-panel border-t border-border-subtle">
                <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim">
                  stdout
                </div>
                <pre className="px-4 pb-3 text-xs font-mono text-text-muted whitespace-pre-wrap">
                  {stdout}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {frames.length > 0 && (
        <PlaybackControls
          playing={player.playing}
          onTogglePlay={player.togglePlay}
          onStepForward={player.stepForward}
          onStepBack={player.stepBack}
          onJumpStart={player.jumpStart}
          onJumpEnd={player.jumpEnd}
          onReset={player.jumpStart}
          step={player.step}
          total={player.total}
          speed={player.speed}
          onSpeedChange={player.setSpeed}
        />
      )}
    </div>
  )
}

function valuesEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true
  try {
    return JSON.stringify(a) === JSON.stringify(b)
  } catch {
    return false
  }
}
