import type { HeapStep } from '../types'
import clsx from 'clsx'

export function HeapViz({ step }: { step: HeapStep }) {
  const heap = step.heap
  const compareSet = new Set(step.compareIdx ?? [])
  const swapSet = new Set(step.swapIdx ?? [])
  const activeIdx = step.activeIdx

  // Compute tree layout (complete binary tree). Position each index i at depth = floor(log2(i+1)).
  const positions = new Map<number, { x: number; y: number }>()
  const width = 620
  const rowH = 60
  const depths: number[][] = []
  heap.forEach((_, i) => {
    const depth = Math.floor(Math.log2(i + 1))
    if (!depths[depth]) depths[depth] = []
    depths[depth].push(i)
  })
  depths.forEach((row, d) => {
    const slotsAtDepth = 2 ** d
    row.forEach((idx) => {
      const posInRow = idx - (2 ** d - 1)
      const x = ((posInRow + 0.5) / slotsAtDepth) * width
      const y = 30 + d * rowH
      positions.set(idx, { x, y })
    })
  })
  const treeHeight = (depths.length || 1) * rowH + 20

  const cellFillFor = (i: number) => {
    if (swapSet.has(i)) return { fill: 'rgba(239, 68, 68, 0.25)', stroke: '#ef4444', text: '#ef4444' }
    if (compareSet.has(i)) return { fill: 'rgba(245, 158, 11, 0.2)', stroke: '#f59e0b', text: '#f59e0b' }
    if (i === activeIdx) return { fill: 'rgba(139, 92, 246, 0.2)', stroke: '#8b5cf6', text: '#c4b5fd' }
    return { fill: '#12141b', stroke: '#374151', text: '#e5e7eb' }
  }

  return (
    <div className="w-full h-full overflow-auto p-4 flex flex-col items-center gap-6">
      <div className="w-full max-w-[720px]">
        <div className="text-[10px] uppercase tracking-wider text-text-dim mb-2">binary tree</div>
        {heap.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-text-dim text-sm italic border border-dashed border-border-subtle rounded">
            empty
          </div>
        ) : (
          <svg width={width} height={treeHeight} className="block mx-auto">
            {heap.map((_, i) => {
              const p = positions.get(i)!
              const parent = Math.floor((i - 1) / 2)
              if (i === 0) return null
              const pp = positions.get(parent)!
              return (
                <line
                  key={`e-${i}`}
                  x1={pp.x}
                  y1={pp.y}
                  x2={p.x}
                  y2={p.y}
                  stroke="#374151"
                  strokeWidth={1}
                />
              )
            })}
            {heap.map((v, i) => {
              const p = positions.get(i)!
              const style = cellFillFor(i)
              return (
                <g key={`n-${i}`}>
                  <circle cx={p.x} cy={p.y} r={18} fill={style.fill} stroke={style.stroke} strokeWidth={2} />
                  <text
                    x={p.x}
                    y={p.y + 5}
                    textAnchor="middle"
                    fontSize={13}
                    fontFamily="ui-monospace, monospace"
                    fontWeight={600}
                    fill={style.text}
                  >
                    {v}
                  </text>
                  <text
                    x={p.x}
                    y={p.y - 24}
                    textAnchor="middle"
                    fontSize={9}
                    fontFamily="ui-monospace, monospace"
                    fill="#6b7280"
                  >
                    [{i}]
                  </text>
                </g>
              )
            })}
          </svg>
        )}
      </div>
      <div className="w-full max-w-[720px]">
        <div className="text-[10px] uppercase tracking-wider text-text-dim mb-2">array</div>
        <div className="flex flex-wrap gap-1">
          {heap.length === 0 ? (
            <div className="text-text-dim text-xs italic">empty</div>
          ) : (
            heap.map((v, i) => {
              const isActive = i === activeIdx
              const isCompare = compareSet.has(i)
              const isSwap = swapSet.has(i)
              return (
                <div key={i} className="flex flex-col items-center" style={{ width: 44 }}>
                  <div
                    className={clsx(
                      'w-11 h-11 flex items-center justify-center rounded border font-mono font-semibold text-sm',
                      isSwap && 'bg-viz-swap/25 border-viz-swap text-viz-swap',
                      !isSwap && isCompare && 'bg-viz-compare/20 border-viz-compare text-viz-compare',
                      !isSwap && !isCompare && isActive && 'bg-viz-pivot/20 border-viz-pivot text-viz-pivot',
                      !isSwap && !isCompare && !isActive && 'bg-bg-panel border-border-subtle text-text',
                    )}
                  >
                    {v}
                  </div>
                  <div className="text-[10px] text-text-dim mt-1 font-mono">{i}</div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
