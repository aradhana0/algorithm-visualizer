export type VizSnapshot =
  | {
      kind: 'array'
      name: string
      data: (number | string)[]
      highlight: number[] | null
      label: string | null
    }
  | {
      kind: 'matrix'
      name: string
      data: (number | string)[][]
      highlight: [number, number][] | null
      label: string | null
    }
  | {
      kind: 'graph'
      name: string
      data: { nodes: (string | number)[]; edges: [string | number, string | number][] }
      highlight_nodes: (string | number)[] | null
      highlight_edges: [string | number, string | number][] | null
      label: string | null
    }
  | {
      kind: 'tree'
      name: string
      data: unknown
      highlight: (string | number)[] | null
      label: string | null
    }

export type TraceFrame = {
  event: 'line' | 'call' | 'return'
  line: number
  func: string
  source: string
  locals: Record<string, unknown>
  stdout: string
  viz: VizSnapshot[]
}

export type TraceResult = {
  frames: TraceFrame[]
  stdout: string
  error: string | null
  truncated: boolean
}

type Pending = {
  resolve: (v: TraceResult) => void
  reject: (e: Error) => void
  timer: ReturnType<typeof setTimeout>
}

// Main-thread hard cap for a single run — includes worst-case Pyodide load
// time on the first invocation (~15s cold). Once the worker signals ready,
// subsequent runs finish in <1s. If a run exceeds this budget the worker is
// terminated and respawned; guarantees an unresponsive tab can be recovered.
const RUN_TIMEOUT_MS = 30_000

class PyodideRunner {
  private worker: Worker | null = null
  private nextId = 1
  private pending = new Map<number, Pending>()
  private ready = false
  private readyWaiters: Array<() => void> = []

  private spawn(): Worker {
    const w = new Worker(new URL('./pyodide.worker.ts', import.meta.url), {
      type: 'module',
    })
    w.onmessage = (e: MessageEvent) => this.handleMessage(e)
    w.onerror = (e: ErrorEvent) => this.handleFailure(new Error(e.message || 'worker error'))
    // Do NOT reset readyWaiters here — callers may have registered before the
    // new worker was spawned (after a stop/respawn); they should still fire
    // when the fresh worker signals ready.
    this.ready = false
    return w
  }

  private ensureWorker(): Worker {
    if (!this.worker) this.worker = this.spawn()
    return this.worker
  }

  private handleMessage(e: MessageEvent) {
    const { type, id, result, error } = e.data ?? {}
    if (type === 'ready') {
      this.ready = true
      const waiters = this.readyWaiters.splice(0)
      for (const w of waiters) w()
      return
    }
    if (type === 'init-error') {
      this.handleFailure(new Error('Pyodide init failed: ' + error))
      return
    }
    if (type === 'result' || type === 'error') {
      const p = this.pending.get(id)
      if (!p) return
      clearTimeout(p.timer)
      this.pending.delete(id)
      if (type === 'error') p.reject(new Error(error))
      else p.resolve(result as TraceResult)
    }
  }

  private handleFailure(err: Error) {
    for (const [, p] of this.pending) {
      clearTimeout(p.timer)
      p.reject(err)
    }
    this.pending.clear()
    if (this.worker) {
      try {
        this.worker.terminate()
      } catch {
        /* ignore */
      }
      this.worker = null
      this.ready = false
    }
  }

  isReady(): boolean {
    return this.ready
  }

  onReady(cb: () => void) {
    if (this.ready) cb()
    else this.readyWaiters.push(cb)
    this.ensureWorker()
  }

  runTrace(code: string, timeoutMs: number = RUN_TIMEOUT_MS): Promise<TraceResult> {
    const worker = this.ensureWorker()
    const id = this.nextId++
    return new Promise<TraceResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id)
        // Hard kill — this is the whole point of running in a worker.
        this.handleFailure(
          new Error(
            `Execution timed out after ${timeoutMs / 1000}s. The Pyodide worker was terminated; try a smaller input or check for a runaway loop / huge allocation.`,
          ),
        )
      }, timeoutMs)
      this.pending.set(id, { resolve, reject, timer })
      worker.postMessage({ type: 'run', id, code })
    })
  }

  stop() {
    if (!this.worker && this.pending.size === 0) return
    this.handleFailure(new Error('Cancelled by user'))
  }
}

const runner = new PyodideRunner()

export function runTrace(code: string): Promise<TraceResult> {
  return runner.runTrace(code)
}

export function stopTrace() {
  runner.stop()
}

export function isPyodideReady(): boolean {
  return runner.isReady()
}

export function subscribeReady(cb: () => void): void {
  runner.onReady(cb)
}
