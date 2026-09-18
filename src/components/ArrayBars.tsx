import clsx from 'clsx'
import type { SortStep } from '../types'

type Props = {
  step: SortStep
}

export function ArrayBars({ step }: Props) {
  const compareSet = new Set(step.compare ?? [])
  const swapSet = new Set(step.swap ?? [])
  const sortedSet = new Set(step.sorted ?? [])
  const max = Math.max(...step.array, 1)
  const showLabels = step.array.length <= 30

  return (
    <div className="w-full h-full flex items-end justify-center gap-[2px] px-6 py-8">
      {step.array.map((v, i) => {
        const heightPct = (v / max) * 100
        const isCompare = compareSet.has(i)
        const isSwap = swapSet.has(i)
        const isSorted = sortedSet.has(i)
        const isPivot = step.pivot === i
        return (
          <div
            key={i}
            className={clsx(
              'flex-1 rounded-sm transition-colors duration-100 relative min-w-[4px]',
              isSwap && 'bg-viz-swap',
              !isSwap && isCompare && 'bg-viz-compare',
              !isSwap && !isCompare && isPivot && 'bg-viz-pivot',
              !isSwap && !isCompare && !isPivot && isSorted && 'bg-viz-sorted',
              !isSwap && !isCompare && !isPivot && !isSorted && 'bg-viz-bar',
            )}
            style={{ height: `${heightPct}%` }}
            title={String(v)}
          >
            {showLabels && (
              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-dim">
                {v}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
