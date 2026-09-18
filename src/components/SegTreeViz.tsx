import type { SegTreeStep } from '../types'
import clsx from 'clsx'

export function SegTreeViz({ step }: { step: SegTreeStep }) {
  const nodes = step.nodes
  const active = new Set(step.activeNodes ?? [])
  const updated = new Set(step.updatedNodes ?? [])
  const inRange = (i: number) =>
    step.queryRange && i >= step.queryRange[0] && i <= step.queryRange[1]

  // Layout the tree by ranges: node's x is midpoint of (l,r) on a virtual scale.
  const n = step.array.length
  const width = Math.max(640, n * 80)
  const rowH = 66
  const nodeW = 68
  const nodeH = 36
  const byId = new Map(nodes.map((n) => [n.id, n]))
  const depths = new Map<string, number>()
  const positions = new Map<string, { x: number; y: number }>()

  function assignDepth(id: string | null, d: number) {
    if (!id) return
    depths.set(id, d)
    const n0 = byId.get(id)!
    assignDepth(n0.left, d + 1)
    assignDepth(n0.right, d + 1)
  }
  if (step.root) assignDepth(step.root, 0)
  const maxD = Math.max(0, ...Array.from(depths.values()))
  const treeH = 20 + (maxD + 1) * rowH
  const cellW = (width - 60) / n
  for (const nd of nodes) {
    const mid = (nd.l + nd.r + 1) / 2
    positions.set(nd.id, { x: 30 + mid * cellW, y: 20 + (depths.get(nd.id) ?? 0) * rowH })
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-auto p-4">
        {step.operation && (
          <div className="text-xs font-mono text-text-muted mb-3 text-center">
            operation: <span className="text-accent font-semibold">{step.operation}</span>
            {step.queryRange && (
              <>
                {' '}[{step.queryRange[0]}..{step.queryRange[1]}]
                {step.queryResult !== undefined && step.queryResult !== null && (
                  <>
                    {' '}= <span className="text-viz-sorted font-semibold">{step.queryResult}</span>
                  </>
                )}
              </>
            )}
            {step.updateIndex !== undefined && step.updateValue !== undefined && (
              <>
                {' '}(i={step.updateIndex}, val={step.updateValue})
              </>
            )}
          </div>
        )}

        <div className="flex justify-center mb-4">
          <div className="flex" style={{ gap: 2 }}>
            {step.array.map((v, i) => (
              <div key={i} className="flex flex-col items-center" style={{ width: cellW - 2 }}>
                <div
                  className={clsx(
                    'flex items-center justify-center border rounded-md font-mono font-semibold text-sm h-9',
                    inRange(i)
                      ? 'bg-viz-compare/20 border-viz-compare text-viz-compare'
                      : i === step.updateIndex
                        ? 'bg-viz-swap/20 border-viz-swap text-viz-swap'
                        : 'bg-bg-panel border-border-subtle text-text',
                  )}
                >
                  {v}
                </div>
                <div className="text-[10px] text-text-dim font-mono mt-0.5">{i}</div>
              </div>
            ))}
          </div>
        </div>

        <svg
          viewBox={`0 0 ${width} ${treeH + 40}`}
          preserveAspectRatio="xMidYMid meet"
          className="block mx-auto w-full max-w-[900px]"
          style={{ height: treeH + 40 }}
        >
          {nodes.map((n0) => {
            const p = positions.get(n0.id)!
            return (
              <g key={`e-${n0.id}`}>
                {n0.left && positions.get(n0.left) && (
                  <line
                    x1={p.x}
                    y1={p.y + nodeH / 2}
                    x2={positions.get(n0.left)!.x}
                    y2={positions.get(n0.left)!.y - nodeH / 2}
                    stroke="#374151"
                    strokeWidth={1.5}
                  />
                )}
                {n0.right && positions.get(n0.right) && (
                  <line
                    x1={p.x}
                    y1={p.y + nodeH / 2}
                    x2={positions.get(n0.right)!.x}
                    y2={positions.get(n0.right)!.y - nodeH / 2}
                    stroke="#374151"
                    strokeWidth={1.5}
                  />
                )}
              </g>
            )
          })}
          {nodes.map((n0) => {
            const p = positions.get(n0.id)!
            const isActive = active.has(n0.id)
            const isUpdated = updated.has(n0.id)
            const stroke = isUpdated
              ? '#ef4444'
              : isActive
                ? '#f59e0b'
                : '#8b5cf6'
            const fill = isUpdated
              ? 'rgba(239, 68, 68, 0.25)'
              : isActive
                ? 'rgba(245, 158, 11, 0.2)'
                : '#12141b'
            const textFill = isUpdated ? '#ef4444' : isActive ? '#f59e0b' : '#e5e7eb'
            return (
              <g key={`n-${n0.id}`}>
                <rect
                  x={p.x - nodeW / 2}
                  y={p.y - nodeH / 2}
                  width={nodeW}
                  height={nodeH}
                  rx={5}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={2}
                />
                <text
                  x={p.x}
                  y={p.y - 3}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="ui-monospace, monospace"
                  fill="#9ca3af"
                >
                  [{n0.l}..{n0.r}]
                </text>
                <text
                  x={p.x}
                  y={p.y + 11}
                  textAnchor="middle"
                  fontSize={13}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={700}
                  fill={textFill}
                >
                  {n0.value}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
