import type { TrieStep } from '../types'
import clsx from 'clsx'

export function TrieViz({ step }: { step: TrieStep }) {
  const nodes = step.nodes
  const rootId = step.root
  const pathSet = new Set(step.currentPath ?? [])

  // Compute layout: DFS assigns leaves fixed x, internal nodes get midpoint
  const positions: Record<string, { x: number; y: number }> = {}
  let xCursor = 0
  const rowH = 60
  const leafGap = 60

  function layout(id: string, depth: number) {
    const n = nodes[id]
    const childIds = Object.values(n.children)
    if (childIds.length === 0) {
      positions[id] = { x: xCursor * leafGap + 40, y: 30 + depth * rowH }
      xCursor++
      return
    }
    const startX = xCursor
    for (const c of childIds) layout(c, depth + 1)
    const first = positions[childIds[0]].x
    const last = positions[childIds[childIds.length - 1]].x
    positions[id] = { x: (first + last) / 2, y: 30 + depth * rowH }
    void startX
  }
  layout(rootId, 0)

  const maxX = Math.max(...Object.values(positions).map((p) => p.x)) + 40
  const maxY = Math.max(...Object.values(positions).map((p) => p.y)) + 40

  return (
    <div className="w-full h-full flex overflow-hidden">
      <div className="flex-1 overflow-auto p-4">
        <svg
          viewBox={`0 0 ${Math.max(300, maxX)} ${Math.max(160, maxY)}`}
          preserveAspectRatio="xMidYMid meet"
          className="block mx-auto w-full max-w-[720px]"
          style={{ height: Math.max(200, maxY) }}
        >
          {Object.values(nodes).map((n) =>
            Object.values(n.children).map((childId) => {
              const p = positions[n.id]
              const c = positions[childId]
              if (!p || !c) return null
              const inPath = pathSet.has(n.id) && pathSet.has(childId)
              return (
                <line
                  key={`${n.id}-${childId}`}
                  x1={p.x}
                  y1={p.y + 12}
                  x2={c.x}
                  y2={c.y - 12}
                  stroke={inPath ? '#f59e0b' : '#374151'}
                  strokeWidth={inPath ? 2 : 1.5}
                />
              )
            }),
          )}
          {Object.values(nodes).map((n) => {
            const p = positions[n.id]
            if (!p) return null
            const inPath = pathSet.has(n.id)
            const stroke = n.isEnd ? '#10b981' : inPath ? '#f59e0b' : '#8b5cf6'
            const fill = n.isEnd
              ? 'rgba(16, 185, 129, 0.2)'
              : inPath
                ? 'rgba(245, 158, 11, 0.2)'
                : '#12141b'
            return (
              <g key={n.id}>
                <circle cx={p.x} cy={p.y} r={16} fill={fill} stroke={stroke} strokeWidth={2} />
                <text
                  x={p.x}
                  y={p.y + 5}
                  textAnchor="middle"
                  fontSize={13}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={700}
                  fill={n.isEnd ? '#10b981' : inPath ? '#f59e0b' : '#e5e7eb'}
                >
                  {n.char}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="w-[240px] shrink-0 border-l border-border-subtle flex flex-col overflow-hidden bg-bg-panel">
        <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-b border-border-subtle">
          operation
        </div>
        <div className="p-3 space-y-2 text-xs font-mono">
          {step.operation && step.currentWord && (
            <div>
              <span className="text-text-dim">{step.operation}</span>(
              <span className="text-accent">"{step.currentWord}"</span>)
            </div>
          )}
          {step.found !== undefined && (
            <div
              className={clsx(
                'inline-block px-2 py-1 rounded font-semibold',
                step.found ? 'bg-viz-sorted/15 text-viz-sorted' : 'bg-viz-swap/15 text-viz-swap',
              )}
            >
              {step.found ? 'True' : 'False'}
            </div>
          )}
        </div>
        <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-t border-border-subtle border-b">
          words in trie ({step.words?.length ?? 0})
        </div>
        <div className="p-3 flex flex-wrap gap-1">
          {step.words?.map((w) => (
            <span
              key={w}
              className="px-2 py-0.5 rounded bg-viz-sorted/10 border border-viz-sorted/60 text-viz-sorted text-xs font-mono"
            >
              {w}
            </span>
          )) ?? <span className="text-text-dim text-xs italic">∅</span>}
        </div>
      </div>
    </div>
  )
}
