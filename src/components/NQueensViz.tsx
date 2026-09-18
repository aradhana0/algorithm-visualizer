import type { NQueensStep } from '../types'
import clsx from 'clsx'

export function NQueensViz({ step }: { step: NQueensStep }) {
  const { n, queens } = step
  const cellPx = 56
  const attackedSet = new Set((step.attackedCells ?? []).map(([r, c]) => `${r},${c}`))
  const conflict = step.conflictWith
  const isConflictCell = (r: number, c: number) => conflict && conflict.row === r && conflict.col === c
  const isTrying = (r: number, c: number) =>
    step.currentRow === r && step.tryingCol === c && queens[r] !== c

  return (
    <div className="w-full h-full flex overflow-hidden">
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center gap-4">
        <div
          className={clsx(
            'inline-block rounded overflow-hidden shadow-lg border-2 transition-colors',
            step.solved ? 'border-viz-sorted' : 'border-border-subtle',
          )}
        >
          {Array.from({ length: n }).map((_, r) => (
            <div key={r} className="flex">
              {Array.from({ length: n }).map((_, c) => {
                const light = (r + c) % 2 === 0
                const hasQueen = queens[r] === c
                const isRowActive = step.currentRow === r
                const attacked = attackedSet.has(`${r},${c}`)
                const conflictHere = isConflictCell(r, c)
                const tryingHere = isTrying(r, c)
                const failedTry = tryingHere && step.backtracking
                return (
                  <div
                    key={c}
                    className={clsx(
                      'flex items-center justify-center relative transition-colors',
                      light ? 'bg-[#2a2f3a]' : 'bg-[#1a1d26]',
                      attacked && !hasQueen && !tryingHere && 'bg-red-950/40',
                      isRowActive && !hasQueen && !tryingHere && !conflictHere && 'ring-1 ring-inset ring-accent/40',
                    )}
                    style={{ width: cellPx, height: cellPx }}
                  >
                    {hasQueen && (
                      <span
                        className={clsx(
                          'text-2xl transition-colors',
                          step.solved ? 'text-viz-sorted' : 'text-accent',
                        )}
                      >
                        ♛
                      </span>
                    )}
                    {tryingHere && !hasQueen && (
                      <span
                        className={clsx(
                          'text-2xl opacity-60',
                          conflictHere || failedTry ? 'text-viz-swap' : 'text-viz-compare',
                        )}
                      >
                        ♛
                      </span>
                    )}
                    {conflictHere && !hasQueen && !tryingHere && (
                      <span className="absolute inset-0 flex items-center justify-center text-viz-swap text-3xl">
                        ✕
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        {step.solved && (
          <div className="text-viz-sorted font-mono font-semibold">Solution found ✓</div>
        )}
      </div>

      <div className="w-[240px] shrink-0 border-l border-border-subtle flex flex-col overflow-hidden bg-bg-panel">
        <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-b border-border-subtle">
          queens[row] = col
        </div>
        <div className="p-3 flex flex-col gap-1 text-xs font-mono">
          {queens.map((c, r) => (
            <div
              key={r}
              className={clsx(
                'flex items-center justify-between px-2 py-1 rounded border',
                step.currentRow === r
                  ? 'bg-viz-compare/10 border-viz-compare text-viz-compare'
                  : c !== null
                    ? 'bg-viz-sorted/10 border-viz-sorted/50 text-viz-sorted'
                    : 'bg-bg border-border-subtle text-text-dim',
              )}
            >
              <span>row {r}</span>
              <span>{c === null ? '—' : `col ${c}`}</span>
            </div>
          ))}
        </div>

        <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-t border-border-subtle border-b">
          call stack
        </div>
        <div className="p-3 flex flex-col gap-1 max-h-40 overflow-y-auto">
          {(step.callStack ?? []).length === 0 ? (
            <div className="text-xs text-text-dim italic">empty</div>
          ) : (
            step.callStack!
              .slice()
              .reverse()
              .map((row, i) => (
                <div
                  key={i}
                  className="px-2 py-1 rounded bg-bg border border-border-subtle text-xs font-mono text-text-muted"
                >
                  place({row})
                </div>
              ))
          )}
        </div>

        <div className="mt-auto px-4 py-3 border-t border-border-subtle text-xs font-mono flex items-center justify-between">
          <span className="text-text-dim">solutions</span>
          <span className="text-viz-sorted font-semibold">{step.solutionsCount ?? 0}</span>
        </div>
      </div>
    </div>
  )
}
