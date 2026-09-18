import type { BinaryTreeNode, TreeStep } from '../types'

export function BinaryTreeViz({ step }: { step: TreeStep }) {
  const width = 640
  const nodeR = 22
  const rowH = 70
  const positions = new Map<string, { x: number; y: number }>()

  // Compute layout: post-order size then place with proper spacing
  const byId = new Map(step.nodes.map((n) => [n.id, n]))
  const sizes = new Map<string, number>()
  function size(id: string | null): number {
    if (!id) return 0
    const n = byId.get(id)
    if (!n) return 0
    const s = 1 + size(n.left) + size(n.right)
    sizes.set(id, s)
    return s
  }
  if (step.root) size(step.root)

  function place(id: string | null, xMin: number, xMax: number, depth: number) {
    if (!id) return
    const n = byId.get(id)
    if (!n) return
    const leftSize = n.left ? sizes.get(n.left) ?? 0 : 0
    const rightSize = n.right ? sizes.get(n.right) ?? 0 : 0
    const totalChildren = leftSize + rightSize
    // My position: proportional split
    const totalSpan = xMax - xMin
    let myX: number
    if (totalChildren === 0) {
      myX = (xMin + xMax) / 2
    } else {
      const leftShare = leftSize / totalChildren
      myX = xMin + totalSpan * leftShare
    }
    // Ensure myX is inside the span
    myX = Math.max(xMin + nodeR, Math.min(xMax - nodeR, myX))
    const y = 40 + depth * rowH
    positions.set(id, { x: myX, y })
    if (n.left) place(n.left, xMin, myX, depth + 1)
    if (n.right) place(n.right, myX, xMax, depth + 1)
  }
  if (step.root) place(step.root, 20, width - 20, 0)

  const depth = maxDepth(step.root, byId)
  const height = 40 + (depth + 1) * rowH

  const currentSet = new Set(
    step.currentNode ? [step.currentNode] : [],
  )
  const visitedSet = new Set(step.visitedNodes ?? [])
  const highlightSet = new Set(step.highlightNodes ?? [])
  const pathSet = new Set(step.path ?? [])

  return (
    <div className="w-full h-full flex overflow-hidden">
      <div className="flex-1 overflow-auto p-4">
        {step.root === null ? (
          <div className="w-full h-full flex items-center justify-center text-text-dim text-sm italic">
            empty tree
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${width} ${Math.max(200, height)}`}
            preserveAspectRatio="xMidYMid meet"
            className="block mx-auto w-full max-w-[720px]"
            style={{ height: Math.max(200, height) }}
          >
            {step.nodes.map((n) => {
              const p = positions.get(n.id)
              if (!p) return null
              return (
                <g key={`edges-${n.id}`}>
                  {n.left && positions.get(n.left) && (
                    <line
                      x1={p.x}
                      y1={p.y + nodeR}
                      x2={positions.get(n.left)!.x}
                      y2={positions.get(n.left)!.y - nodeR}
                      stroke={pathSet.has(n.id) && pathSet.has(n.left) ? '#f59e0b' : '#374151'}
                      strokeWidth={pathSet.has(n.id) && pathSet.has(n.left) ? 2 : 1.5}
                    />
                  )}
                  {n.right && positions.get(n.right) && (
                    <line
                      x1={p.x}
                      y1={p.y + nodeR}
                      x2={positions.get(n.right)!.x}
                      y2={positions.get(n.right)!.y - nodeR}
                      stroke={pathSet.has(n.id) && pathSet.has(n.right) ? '#f59e0b' : '#374151'}
                      strokeWidth={pathSet.has(n.id) && pathSet.has(n.right) ? 2 : 1.5}
                    />
                  )}
                </g>
              )
            })}
            {step.nodes.map((n) => {
              const p = positions.get(n.id)
              if (!p) return null
              const isCurrent = currentSet.has(n.id)
              const isVisited = visitedSet.has(n.id)
              const isHighlight = highlightSet.has(n.id)
              const isPath = pathSet.has(n.id)
              const { fill, stroke, textFill } = colorFor({
                isCurrent,
                isVisited,
                isHighlight,
                isPath,
              })
              return (
                <g key={`node-${n.id}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={nodeR}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isCurrent ? 3 : 2}
                  />
                  <text
                    x={p.x}
                    y={p.y + 5}
                    textAnchor="middle"
                    fontSize={13}
                    fontWeight={700}
                    fontFamily="ui-monospace, monospace"
                    fill={textFill}
                  >
                    {n.value}
                  </text>
                </g>
              )
            })}
          </svg>
        )}
      </div>

      <div className="w-[240px] shrink-0 border-l border-border-subtle flex flex-col overflow-hidden bg-bg-panel">
        {step.compareValue !== undefined && (
          <>
            <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-b border-border-subtle">
              searching for
            </div>
            <div className="px-4 py-3 text-lg font-mono text-accent font-semibold">
              {step.compareValue}
            </div>
          </>
        )}
        {step.callStack && step.callStack.length > 0 && (
          <>
            <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-t border-border-subtle border-b">
              call stack
            </div>
            <div className="p-3 flex flex-col gap-1 max-h-40 overflow-y-auto">
              {step.callStack.slice().reverse().map((c, i) => (
                <div
                  key={i}
                  className="px-2 py-1 rounded bg-bg border border-border-subtle text-xs font-mono text-text-muted"
                >
                  {c}
                </div>
              ))}
            </div>
          </>
        )}
        {step.traversalOrder && (
          <>
            <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-t border-border-subtle border-b">
              visit order
            </div>
            <div className="p-3 flex flex-wrap gap-1 min-h-[40px]">
              {step.traversalOrder.length === 0 ? (
                <div className="text-xs text-text-dim italic">∅</div>
              ) : (
                step.traversalOrder.map((v, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-viz-sorted/15 border border-viz-sorted text-viz-sorted text-xs font-mono"
                  >
                    {v}
                  </span>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function maxDepth(rootId: string | null, byId: Map<string, BinaryTreeNode>): number {
  if (!rootId) return 0
  const n = byId.get(rootId)
  if (!n) return 0
  return 1 + Math.max(maxDepth(n.left, byId), maxDepth(n.right, byId))
}

function colorFor({
  isCurrent,
  isVisited,
  isHighlight,
  isPath,
}: {
  isCurrent: boolean
  isVisited: boolean
  isHighlight: boolean
  isPath: boolean
}) {
  if (isCurrent) return { fill: 'rgba(245, 158, 11, 0.3)', stroke: '#f59e0b', textFill: '#f59e0b' }
  if (isHighlight) return { fill: 'rgba(239, 68, 68, 0.2)', stroke: '#ef4444', textFill: '#ef4444' }
  if (isVisited) return { fill: 'rgba(16, 185, 129, 0.2)', stroke: '#10b981', textFill: '#10b981' }
  if (isPath) return { fill: 'rgba(245, 158, 11, 0.12)', stroke: '#f59e0b', textFill: '#fbbf24' }
  return { fill: '#12141b', stroke: '#4b5563', textFill: '#e5e7eb' }
}
