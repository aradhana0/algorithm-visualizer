import type { WordSearchStep } from '../types'
import clsx from 'clsx'

export function WordSearchViz({ step }: { step: WordSearchStep }) {
  const pathSet = new Set((step.pathCells ?? []).map(([r, c]) => `${r},${c}`))
  const cellPx = 56
  return (
    <div className="w-full h-full flex overflow-hidden">
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center gap-6">
        <div className="flex items-center gap-4 text-sm">
          <div className="font-mono">
            <span className="text-text-dim">word = </span>
            <span className="text-accent font-semibold">"{step.word}"</span>
          </div>
          <div className="flex gap-0.5">
            {step.word.split('').map((c, i) => {
              const matched = step.matchIndex !== undefined && i < step.matchIndex
              const current = step.matchIndex === i
              return (
                <span
                  key={i}
                  className={clsx(
                    'w-6 h-6 flex items-center justify-center rounded border font-mono text-xs',
                    matched && 'bg-viz-sorted/20 border-viz-sorted text-viz-sorted',
                    current && 'bg-viz-compare/20 border-viz-compare text-viz-compare',
                    !matched && !current && 'bg-bg-panel border-border-subtle text-text-dim',
                  )}
                >
                  {c}
                </span>
              )
            })}
          </div>
        </div>

        <div className="inline-block rounded overflow-hidden shadow border border-border-subtle">
          {step.grid.map((row, r) => (
            <div key={r} className="flex">
              {row.map((v, c) => {
                const isCurrent = step.currentRow === r && step.currentCol === c
                const isVisited = v === '#' || pathSet.has(`${r},${c}`)
                const isBacktrack = isCurrent && step.backtracking
                const isFound = step.found && pathSet.has(`${r},${c}`)
                return (
                  <div
                    key={c}
                    className={clsx(
                      'flex items-center justify-center font-mono font-semibold text-xl border border-border-subtle transition-colors',
                      isFound && 'bg-viz-sorted/25 text-viz-sorted',
                      !isFound && isBacktrack && 'bg-viz-swap/25 text-viz-swap',
                      !isFound && !isBacktrack && isCurrent && 'bg-viz-compare/25 text-viz-compare',
                      !isFound && !isBacktrack && !isCurrent && isVisited && 'bg-viz-pivot/15 text-viz-pivot',
                      !isFound && !isBacktrack && !isCurrent && !isVisited && 'bg-bg-panel text-text',
                    )}
                    style={{ width: cellPx, height: cellPx }}
                  >
                    {v}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {step.found && (
          <div className="text-viz-sorted font-mono font-semibold">Found ✓</div>
        )}
      </div>

      <div className="w-[240px] shrink-0 border-l border-border-subtle flex flex-col overflow-hidden bg-bg-panel">
        <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-b border-border-subtle">
          call stack
        </div>
        <div className="p-3 flex flex-col gap-1 max-h-96 overflow-y-auto">
          {(step.callStack ?? []).length === 0 ? (
            <div className="text-xs text-text-dim italic">empty</div>
          ) : (
            step.callStack!
              .slice()
              .reverse()
              .map((c, i) => (
                <div
                  key={i}
                  className="px-2 py-1 rounded bg-bg border border-border-subtle text-xs font-mono text-text-muted break-all"
                >
                  {c}
                </div>
              ))
          )}
        </div>
        <div className="mt-auto px-4 py-3 border-t border-border-subtle text-xs font-mono flex items-center justify-between">
          <span className="text-text-dim">matched</span>
          <span className="text-viz-sorted font-semibold">
            {step.matchIndex ?? 0}/{step.word.length}
          </span>
        </div>
      </div>
    </div>
  )
}
