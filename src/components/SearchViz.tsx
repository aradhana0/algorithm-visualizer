import type { SearchStep } from '../types'
import clsx from 'clsx'

export function SearchViz({ step }: { step: SearchStep }) {
  const eliminated = new Set(step.eliminated ?? [])
  const n = step.array.length
  const cellPx = n <= 12 ? 56 : n <= 20 ? 46 : 36
  const gapPx = 6

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-6">
      <div className="flex items-center gap-6 text-sm">
        <div className="font-mono">
          <span className="text-text-dim">target = </span>
          <span className="text-accent font-semibold">{step.target}</span>
        </div>
        {step.foundIdx !== undefined && step.foundIdx !== null && (
          <div className="text-viz-sorted font-mono font-semibold">
            found at index {step.foundIdx}
          </div>
        )}
        {step.foundIdx === null && (
          <div className="text-viz-swap font-mono font-semibold">not found → -1</div>
        )}
      </div>
      <div className="flex flex-col items-center">
        <div className="flex" style={{ gap: gapPx }}>
          {step.array.map((v, i) => {
            const isElim = eliminated.has(i)
            const isCompare = step.compareIdx === i
            const isMid = step.mid === i && !isCompare
            const isFound = step.foundIdx === i
            return (
              <div key={i} className="flex flex-col items-center" style={{ width: cellPx }}>
                <div
                  className={clsx(
                    'flex items-center justify-center font-mono font-semibold rounded-md border transition-colors',
                    isFound && 'bg-viz-sorted/25 border-viz-sorted text-viz-sorted',
                    !isFound && isCompare && 'bg-viz-compare/20 border-viz-compare text-viz-compare',
                    !isFound && !isCompare && isMid && 'bg-viz-pivot/20 border-viz-pivot text-viz-pivot',
                    !isFound && !isCompare && !isMid && isElim && 'bg-bg border-border-subtle/50 text-text-dim opacity-40',
                    !isFound && !isCompare && !isMid && !isElim && 'bg-bg-panel border-border-subtle text-text',
                  )}
                  style={{ width: cellPx, height: cellPx, fontSize: n <= 12 ? 16 : 14 }}
                >
                  {v}
                </div>
                <div className="mt-1 text-[10px] text-text-dim font-mono">{i}</div>
              </div>
            )
          })}
        </div>
        {(step.lo !== undefined || step.hi !== undefined || step.mid !== undefined) && (
          <div className="flex" style={{ gap: gapPx, marginTop: 8 }}>
            {step.array.map((_, i) => {
              const isLo = step.lo === i
              const isHi = step.hi === i
              const isMid = step.mid === i
              return (
                <div key={i} className="flex flex-col items-center gap-0.5" style={{ width: cellPx }}>
                  {isLo && (
                    <span className="text-[10px] font-mono text-accent font-semibold">lo</span>
                  )}
                  {isMid && (
                    <span className="text-[10px] font-mono text-viz-pivot font-semibold">mid</span>
                  )}
                  {isHi && (
                    <span className="text-[10px] font-mono text-accent font-semibold">hi</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
