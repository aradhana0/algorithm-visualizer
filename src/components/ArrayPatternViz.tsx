import type { ArrayPatternStep } from '../types'
import clsx from 'clsx'

export function ArrayPatternViz({ step }: { step: ArrayPatternStep }) {
  const inWindow = (i: number) =>
    step.windowLeft !== undefined &&
    step.windowRight !== undefined &&
    i >= step.windowLeft &&
    i <= step.windowRight
  const highlight = new Set(step.highlightIndices ?? [])
  const bestRange = step.bestValue?.range
  const isBestRange = (i: number) =>
    bestRange && i >= bestRange[0] && i <= bestRange[1]
  const pointerByIdx = new Map<number, Array<{ name: string; color?: string }>>()
  for (const p of step.pointers ?? []) {
    if (!pointerByIdx.has(p.index)) pointerByIdx.set(p.index, [])
    pointerByIdx.get(p.index)!.push({ name: p.name, color: p.color })
  }
  const cellPx = 48

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-6 overflow-auto">
      {(step.runningValue || step.bestValue) && (
        <div className="flex items-center gap-6 text-sm">
          {step.runningValue && (
            <div className="font-mono">
              <span className="text-text-dim">{step.runningValue.label} = </span>
              <span className="text-viz-compare font-semibold">{step.runningValue.value}</span>
            </div>
          )}
          {step.bestValue && (
            <div className="font-mono">
              <span className="text-text-dim">{step.bestValue.label} = </span>
              <span className="text-viz-sorted font-semibold">{step.bestValue.value}</span>
              {step.bestValue.range && (
                <span className="text-text-dim ml-1">
                  [{step.bestValue.range[0]}…{step.bestValue.range[1]}]
                </span>
              )}
            </div>
          )}
        </div>
      )}
      <div>
        <div className="flex" style={{ gap: 4 }}>
          {step.array.map((v, i) => {
            const isInWin = inWindow(i)
            const isHl = highlight.has(i)
            const isBest = isBestRange(i)
            return (
              <div key={i} className="flex flex-col items-center" style={{ width: cellPx }}>
                <div
                  className={clsx(
                    'flex items-center justify-center rounded-md border font-mono font-semibold text-sm transition-colors',
                    isBest && 'bg-viz-sorted/20 border-viz-sorted text-viz-sorted',
                    !isBest && isInWin && 'bg-viz-compare/15 border-viz-compare text-viz-compare',
                    !isBest && !isInWin && isHl && 'bg-viz-pivot/15 border-viz-pivot text-viz-pivot',
                    !isBest && !isInWin && !isHl && 'bg-bg-panel border-border-subtle text-text',
                  )}
                  style={{ width: cellPx, height: cellPx }}
                >
                  {v}
                </div>
                <div className="mt-1 text-[10px] text-text-dim font-mono">{i}</div>
              </div>
            )
          })}
        </div>
        {step.pointers && step.pointers.length > 0 && (
          <div className="flex mt-2" style={{ gap: 4 }}>
            {step.array.map((_, i) => {
              const ptrs = pointerByIdx.get(i) ?? []
              return (
                <div
                  key={i}
                  className="flex flex-col items-center gap-0.5"
                  style={{ width: cellPx }}
                >
                  {ptrs.map((p, j) => (
                    <span
                      key={j}
                      className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
                      style={{
                        color: p.color ?? '#f59e0b',
                        backgroundColor: (p.color ?? '#f59e0b') + '20',
                      }}
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {step.auxArray && (
        <div>
          <div className="text-[10px] uppercase tracking-wider text-text-dim mb-2 text-center">
            {step.auxLabel ?? 'aux'}
          </div>
          <div className="flex" style={{ gap: 4 }}>
            {step.auxArray.map((v, i) => (
              <div key={i} className="flex flex-col items-center" style={{ width: cellPx }}>
                <div
                  className="w-full h-11 flex items-center justify-center rounded-md border border-viz-pivot/50 bg-viz-pivot/10 text-viz-pivot font-mono font-semibold text-sm"
                  style={{ height: cellPx }}
                >
                  {v}
                </div>
                <div className="mt-1 text-[10px] text-text-dim font-mono">{i}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
