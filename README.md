# Algorithm Visualizer

An interactive, in-browser visualizer for **53 classic algorithms** across sorting, searching, graphs, trees, dynamic programming, data structures, backtracking, and array patterns — plus a **sandboxed Python REPL** that traces arbitrary user code line-by-line and auto-renders its variables.

Built as a single-page React app. No backend. Runs entirely in the user's browser.

---

## What's inside

### 53 built-in algorithms

| Category | Algorithms |
| --- | --- |
| **Sorting** (9) | Bubble, Selection, Insertion, Merge, Quick, Heap, Counting, Radix, Bucket |
| **Searching** (2) | Linear, Binary |
| **Array Patterns** (4) | Kadane's Max Subarray, Sliding Window (fixed *k*), Two Sum (sorted), Prefix Sum |
| **Graph** (7) | BFS, DFS, Dijkstra, Bellman-Ford, Topological Sort (Kahn), Kruskal's MST, Prim's MST |
| **Trees** (6) | BST insert/search, In / Pre / Post / Level-order traversal, Iterative in-order (stack) |
| **Dynamic Programming** (9) | Fibonacci, House Robber, Coin Change, LIS, LCS, Edit Distance, 0/1 Knapsack, Unbounded Knapsack, Longest Palindromic Substring |
| **Data Structures** (11) | Stack, Queue, Hash Table (chaining), Min Heap, Trie, Union-Find (DSU), Segment Tree, Linked List (Traverse / Reverse / Cycle Detection / Merge) |
| **Backtracking** (5) | N-Queens, Subsets, Permutations, Combinations, Word Search |

Every algorithm ships with:
- **Language-agnostic pseudocode** as the default code view
- **Python implementation** as a second tab (line-highlight stays in sync across both)
- **Data-structure-shaped visualization** — array cells, node/edge graphs, tree diagrams, DP tables, chess boards, tries — not just bar charts
- **Playback controls** — play / pause / step forward / step back / scrub / speed (10× to 0.5×)
- **Complexity chip** (time and space) and a short description

### Custom Python code visualizer

Write arbitrary Python in a Monaco editor, hit **Run**, and get:
- Line-by-line trace with local variable snapshots (via Python's `sys.settrace`)
- **Auto-detected rendering**: a `list[int]` becomes an array-cell strip; a `list[list[int]]` becomes a heatmap; dicts render as key-value grids
- **Explicit hints** available: `viz.array(...)`, `viz.matrix(...)`, `viz.graph(nodes, edges)`, `viz.tree(root)`
- **Change highlighting** — locals whose value differs from the previous frame get an amber border
- **Preset snippets** — Quicksort, BST insert, DFS, LCS, memoized Fibonacci, two-pointer sum
- **localStorage persistence** — your code survives reloads

### Security & sandboxing

The custom-code path is treated as running untrusted input:

- **Pyodide runs in a Web Worker.** Main thread stays responsive during heavy Python; a Stop button hard-terminates the worker (`worker.terminate()`) and respawns a fresh one.
- **Python import blocklist** rejects `js`, `pyodide`, `subprocess`, `socket`, `urllib`, `http`, `requests`, `httpx`, `ctypes`, `micropip`, `importlib` — everything that could reach the DOM, cookies, or the network.
- **Removed builtins**: `input`, `help`, `open`, `breakpoint`.
- **Execution caps**: 5 s wall time, 5 000 trace steps, 500 `viz.*` snapshots, 100 KB stdout, 30 s hard worker-terminate.
- **CSP** locks script and connect origins to `self` + `cdn.jsdelivr.net`, forbids `object-src` and `frame-ancestors`.
- **UI truncation** on all user-supplied strings so `viz.array(name="…")` can't blow out the layout.

---

## Tech stack

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Monaco Editor** for the code pane (custom-code page only)
- **Pyodide 0.26** (Python-in-WebAssembly) running in a **Web Worker**
- **lucide-react** for icons
- No backend. Ships as a static bundle.

---

## Run locally

```bash
tar -xzf algo-visualizer.tar.gz
cd algo-visualizer
npm install
npm run dev
```

Then open http://localhost:5173.

For a production build:

```bash
npm run build
npm run preview
```

The `dist/` output is a fully static site — drop it on any static host (S3, Netlify, Cloudflare Pages, GitHub Pages, `python -m http.server`, etc.).

---

## Project layout

```
src/
  algorithms/                 # step generators + pseudocode + Python impls
    sorting/                    (9 files)
    searching/                  (2 files)
    array-patterns/             (4 files)
    graph/                      (7 files + canonical.ts)
    trees/                      (bst, traversals, iterative-inorder)
    dp/                         (9 files)
    data-structures/            (7 files: stack/queue/hash/heap/trie/uf/segtree)
    linked-list/                (4 files)
    backtracking/               (5 files)
    registry.ts                 # single source of truth for the sidebar
  components/                 # one XxxViz + one XxxVisualizer per category
    AlgorithmCodePane.tsx       # pseudo | python tab
    ArrayCells.tsx, ArrayBars.tsx, GraphViz.tsx, BinaryTreeViz.tsx,
    LinkedListViz.tsx, StackViz.tsx, QueueViz.tsx, HashTableViz.tsx,
    HeapViz.tsx, TrieViz.tsx, UnionFindViz.tsx, SegTreeViz.tsx,
    DPTableViz.tsx, NQueensViz.tsx, WordSearchViz.tsx,
    SearchViz.tsx, ArrayPatternViz.tsx, BacktrackingSetViz.tsx,
    CustomCodeVisualizer.tsx, AutoViz.tsx, VizRenderer.tsx,
    CodePresets.ts
  pyodide/
    pyodide.worker.ts           # runs in a Web Worker
    runner.ts                   # main-thread wrapper: run / stop / ready
    tracer.ts                   # embedded Python: sys.settrace + sandbox
  hooks/useStepPlayer.ts       # play/pause/step/scrub state machine
  types.ts                    # every algorithm + step type
  App.tsx, main.tsx, index.css
```

### Adding a new algorithm

1. Create a step generator under `src/algorithms/<category>/<name>.ts`. It exports an algorithm object with `id`, `name`, `category`, `complexity`, `description`, `pseudocode`, `code`, and `generate()`. Each step carries a `line` number so the code panel highlights the right line.
2. Register it in `src/algorithms/registry.ts` (one push into the appropriate array).
3. If the category already has a visualizer component, you're done. If not, add a new `XxxViz` (renders a step) and `XxxVisualizer` container (wires it to `useStepPlayer` + `AlgorithmCodePane` + `PlaybackControls`).

---

## Deployment notes

The CSP tag in `index.html` allows `unsafe-eval` because Pyodide needs `WebAssembly.instantiate` and Monaco uses `eval`-based module loading. Every other directive is tight:

```
default-src 'self';
script-src  'self' 'unsafe-eval' 'unsafe-inline' blob: https://cdn.jsdelivr.net;
connect-src 'self' https://cdn.jsdelivr.net https://pypi.org https://files.pythonhosted.org;
worker-src  'self' blob:;
object-src  'none';
base-uri    'self';
form-action 'self';
frame-ancestors 'none';
```

If you host on a domain that serves `Content-Security-Policy` from a header, prefer that over the `<meta>` tag (the `frame-ancestors` directive only takes effect via a response header).

Pyodide is loaded from jsDelivr on demand — no bundling required. Users pay the ~10 MB WASM download once on first Run (the worker starts loading eagerly on page mount so the download overlaps with editor use).
