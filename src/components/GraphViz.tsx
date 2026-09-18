import type { GraphStep } from '../types'

export function GraphViz({ step }: { step: GraphStep }) {
  const visited = new Set(step.visitedNodes ?? [])
  const frontier = new Set(step.frontierNodes ?? [])
  const activeEdges = new Set(
    (step.activeEdges ?? []).map((e) => edgeKey(e.from, e.to)),
  )
  const treeEdges = new Set((step.treeEdges ?? []).map((e) => edgeKey(e.from, e.to)))

  const width = 620
  const height = 420

  return (
    <div className="w-full h-full flex overflow-hidden">
      <div className="flex-1 overflow-auto p-4">
        <svg width={width} height={height} className="block mx-auto">
          <defs>
            <marker
              id="g-arrow"
              markerWidth={8}
              markerHeight={8}
              refX={7}
              refY={4}
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,8 L8,4 z" fill="#6b7280" />
            </marker>
          </defs>
          {step.edges.map((e, i) => {
            const from = step.nodes.find((n) => n.id === e.from)!
            const to = step.nodes.find((n) => n.id === e.to)!
            const key = edgeKey(e.from, e.to)
            const isActive = activeEdges.has(key)
            const isTree = treeEdges.has(key)
            const stroke = isActive
              ? '#f59e0b'
              : isTree
                ? '#10b981'
                : '#374151'
            const strokeW = isActive || isTree ? 2.5 : 1.5
            const dx = to.x - from.x
            const dy = to.y - from.y
            const len = Math.max(1, Math.hypot(dx, dy))
            const NODE_R = 22
            const x1 = from.x + (dx / len) * NODE_R
            const y1 = from.y + (dy / len) * NODE_R
            const x2 = to.x - (dx / len) * NODE_R
            const y2 = to.y - (dy / len) * NODE_R
            const midX = (from.x + to.x) / 2
            const midY = (from.y + to.y) / 2
            return (
              <g key={i}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={stroke}
                  strokeWidth={strokeW}
                  markerEnd={e.directed ? 'url(#g-arrow)' : undefined}
                />
                {e.weight !== undefined && (
                  <g>
                    <rect
                      x={midX - 12}
                      y={midY - 10}
                      width={24}
                      height={18}
                      fill="#0b0d12"
                      rx={4}
                      opacity={0.85}
                    />
                    <text
                      x={midX}
                      y={midY + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fontFamily="ui-monospace, monospace"
                      fill={isActive || isTree ? '#f59e0b' : '#9ca3af'}
                    >
                      {e.weight}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
          {step.nodes.map((n) => {
            const isCurrent = step.currentNode === n.id
            const isVisited = visited.has(n.id)
            const isFrontier = frontier.has(n.id)
            const dist =
              step.distances && step.distances[n.id] !== undefined
                ? step.distances[n.id]
                : undefined
            const { fill, stroke, textFill } = nodeColors({
              isCurrent,
              isVisited,
              isFrontier,
            })
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={22}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isCurrent ? 3 : 2}
                />
                <text
                  x={n.x}
                  y={n.y + 5}
                  textAnchor="middle"
                  fontSize={15}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={700}
                  fill={textFill}
                >
                  {n.label}
                </text>
                {dist !== undefined && (
                  <g>
                    <rect
                      x={n.x - 20}
                      y={n.y + 26}
                      width={40}
                      height={16}
                      fill="#12141b"
                      stroke="#374151"
                      strokeWidth={1}
                      rx={3}
                    />
                    <text
                      x={n.x}
                      y={n.y + 38}
                      textAnchor="middle"
                      fontSize={11}
                      fontFamily="ui-monospace, monospace"
                      fill={dist === null ? '#6b7280' : '#c4b5fd'}
                    >
                      {dist === null ? '∞' : dist}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="w-[240px] shrink-0 border-l border-border-subtle flex flex-col overflow-hidden bg-bg-panel">
        <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-b border-border-subtle">
          {step.queueLabel ?? 'frontier'}
        </div>
        <div className="p-3 flex flex-col gap-1 max-h-48 overflow-y-auto">
          {(step.queueContents ?? []).length === 0 ? (
            <div className="text-xs text-text-dim italic">empty</div>
          ) : (
            (step.queueContents ?? []).map((e, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-2 py-1 rounded bg-bg border border-border-subtle text-xs font-mono"
              >
                <span className="text-text">{e.node}</span>
                {e.priority !== undefined && (
                  <span className="text-viz-pivot">d={e.priority}</span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-t border-border-subtle border-b">
          visited
        </div>
        <div className="p-3 flex flex-wrap gap-1">
          {visited.size === 0 ? (
            <div className="text-xs text-text-dim italic">∅</div>
          ) : (
            Array.from(visited).map((v) => (
              <span
                key={v}
                className="px-2 py-0.5 rounded bg-viz-sorted/15 border border-viz-sorted text-viz-sorted text-xs font-mono"
              >
                {v}
              </span>
            ))
          )}
        </div>

        {step.distances && (
          <>
            <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-t border-border-subtle border-b">
              distances
            </div>
            <div className="p-3 grid grid-cols-2 gap-1 text-xs font-mono">
              {Object.entries(step.distances).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between px-2 py-0.5 rounded bg-bg">
                  <span className="text-text">{k}</span>
                  <span className={v === null ? 'text-text-dim' : 'text-viz-pivot'}>
                    {v === null ? '∞' : v}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function edgeKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

function nodeColors({
  isCurrent,
  isVisited,
  isFrontier,
}: {
  isCurrent: boolean
  isVisited: boolean
  isFrontier: boolean
}) {
  if (isCurrent) return { fill: 'rgba(245, 158, 11, 0.3)', stroke: '#f59e0b', textFill: '#f59e0b' }
  if (isVisited) return { fill: 'rgba(16, 185, 129, 0.2)', stroke: '#10b981', textFill: '#10b981' }
  if (isFrontier) return { fill: 'rgba(139, 92, 246, 0.15)', stroke: '#8b5cf6', textFill: '#c4b5fd' }
  return { fill: '#12141b', stroke: '#4b5563', textFill: '#e5e7eb' }
}
