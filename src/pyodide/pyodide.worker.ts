/// <reference lib="webworker" />
import { TRACER_PYTHON } from './tracer'

// This file runs inside a dedicated Web Worker. Vite handles the bundling via
// the `new Worker(new URL(...))` reference in ./runner.ts.

declare const self: DedicatedWorkerGlobalScope

const PYODIDE_VERSION = '0.26.4'
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`

type Pyodide = {
  globals: { set: (k: string, v: unknown) => void }
  runPython: (src: string) => unknown
  runPythonAsync: (src: string) => Promise<unknown>
}

let pyodidePromise: Promise<Pyodide> | null = null

async function initPyodide(): Promise<Pyodide> {
  if (pyodidePromise) return pyodidePromise
  pyodidePromise = (async () => {
    // Dynamic-import the ESM build of Pyodide from the CDN. Because this runs
    // inside a worker, DOM access is unavailable anyway — one extra security
    // boundary on top of the Python-level sandbox.
    const mod = await import(/* @vite-ignore */ PYODIDE_CDN + 'pyodide.mjs')
    const py = (await mod.loadPyodide({ indexURL: PYODIDE_CDN })) as Pyodide
    await py.runPythonAsync(TRACER_PYTHON)
    self.postMessage({ type: 'ready' })
    return py
  })()
  return pyodidePromise
}

// Eagerly begin the Pyodide load so the first user Run finishes faster.
initPyodide().catch((e) => {
  self.postMessage({ type: 'init-error', error: e instanceof Error ? e.message : String(e) })
})

self.onmessage = async (evt: MessageEvent) => {
  const { type, id, code } = evt.data ?? {}
  if (type !== 'run') return
  try {
    const py = await initPyodide()
    py.globals.set('__user_code__', code)
    const json = py.runPython('run_with_trace(__user_code__)') as string
    self.postMessage({ type: 'result', id, result: JSON.parse(json) })
  } catch (err) {
    self.postMessage({
      type: 'error',
      id,
      error: err instanceof Error ? err.message : String(err),
    })
  }
}
