import clsx from 'clsx'
import type { SortStep } from '../types'

type Props = {
  step: SortStep
}

export function ArrayCells({ step }: Props) {
  const compareSet = new Set(step.compare ?? [])
  const swapSet = new Set(step.swap ?? [])
  const sortedSet = new Set(step.sorted ?? [])
  const pivot = step.pivot

  const n = step.array.length
  // Scale cell size with array length so up to 60 elements fit comfortably
  const cellPx = n <= 12 ? 56 : n <= 20 ? 46 : n <= 32 ? 36 : n <= 44 ? 28 : 22
  const gapPx = n <= 20 ? 6 : n <= 32 ? 4 : 3
  const fontPx = n <= 12 ? 16 : n <= 20 ? 14 : n <= 32 ? 12 : 10
  const idxPx = n <= 20 ? 11 : 9
  const showIndex = n <= 44

  return (
    <div className="w-full h-full flex items-center justify-center px-4">
      <div className="flex flex-wrap items-start justify-center" style={{ gap: gapPx }}>
        {step.array.map((v, i) => {
          const isCompare = compareSet.has(i)
          const isSwap = swapSet.has(i)
          const isSorted = sortedSet.has(i)
          const isPivot = pivot === i
          return (
            <div key={i} className="flex flex-col items-center" style={{ width: cellPx }}>
              <div
                className={clsx(
                  'flex items-center justify-center font-mono font-semibold rounded-md border transition-colors duration-150',
                  isSwap && 'bg-viz-swap/25 border-viz-swap text-viz-swap',
                  !isSwap && isCompare && 'bg-viz-compare/20 border-viz-compare text-viz-compare',
                  !isSwap && !isCompare && isPivot && 'bg-viz-pivot/25 border-viz-pivot text-viz-pivot',
                  !isSwap && !isCompare && !isPivot && isSorted && 'bg-viz-sorted/20 border-viz-sorted text-viz-sorted',
                  !isSwap && !isCompare && !isPivot && !isSorted && 'bg-bg-panel border-border-subtle text-text',
                )}
                style={{ width: cellPx, height: cellPx, fontSize: fontPx }}
                title={`arr[${i}] = ${v}`}
              >
                {v}
              </div>
              {showIndex && (
                <div
                  className="mt-1 text-text-dim font-mono"
                  style={{ fontSize: idxPx }}
                >
                  {i}
                </div>
              )}
              {isPivot && (
                <div
                  className="text-viz-pivot font-mono font-semibold"
                  style={{ fontSize: idxPx }}
                >
                  pivot
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
