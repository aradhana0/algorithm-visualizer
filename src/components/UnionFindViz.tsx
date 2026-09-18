import type { UnionFindStep } from '../types'
import clsx from 'clsx'

export function UnionFindViz({ step }: { step: UnionFindStep }) {
  const active = new Set(step.activeElements ?? [])

  // Build forest layout: find roots, group children under each root
  const children: Record<string, string[]> = {}
  const roots: string[] = []
  for (const el of step.elements) {
    const id = String(el)
    const p = step.parent[id]
    if (p === id) roots.push(id)
    else {
      if (!children[p]) children[p] = []
      children[p].push(id)
    }
  }

  const rowH = 60
  const nodeR = 18
  const perTreeSpacing = 90

  // Compute layout: each root gets a column, children stacked below
  function subtreeWidth(id: string): number {
    const c = children[id] ?? []
    if (c.length === 0) return 1
    return Math.max(1, c.reduce((s, x) => s + subtreeWidth(x), 0))
  }

  const layouts: Array<{ x: number; y: number; id: string; parent?: string }> = []
  let cx = 0
  for (const r of roots) {
    const w = subtreeWidth(r)
    placeSubtree(r, cx + (w - 1) / 2, 0)
    cx += w
  }

  function placeSubtree(id: string, x: number, depth: number, parent?: string) {
    layouts.push({ id, x, y: depth, parent })
    const c = children[id] ?? []
    if (c.length === 0) return
    let cursorX = x - (subtreeWidth(id) - 1) / 2
    for (const child of c) {
      const w = subtreeWidth(child)
      placeSubtree(child, cursorX + (w - 1) / 2, depth + 1, id)
      cursorX += w
    }
  }

  const totalWidth = Math.max(cx, 3) * perTreeSpacing + 40
  const maxDepth = Math.max(0, ...layouts.map((l) => l.y))
  const totalHeight = 40 + (maxDepth + 1) * rowH + 40

  return (
    <div className="w-full h-full flex overflow-hidden">
      <div className="flex-1 overflow-auto p-4">
        <svg
          viewBox={`0 0 ${totalWidth} ${totalHeight}`}
          preserveAspectRatio="xMidYMid meet"
          className="block mx-auto w-full max-w-[720px]"
          style={{ height: totalHeight }}
        >
          {layouts.map((l) => {
            if (!l.parent) return null
            const p = layouts.find((x) => x.id === l.parent)!
            const x1 = l.x * perTreeSpacing + 40
            const y1 = 40 + l.y * rowH
            const x2 = p.x * perTreeSpacing + 40
            const y2 = 40 + p.y * rowH
            return (
              <line
                key={`e-${l.id}`}
                x1={x1}
                y1={y1 - nodeR}
                x2={x2}
                y2={y2 + nodeR}
                stroke="#4b5563"
                strokeWidth={1.5}
                markerEnd="url(#uf-arrow)"
              />
            )
          })}
          <defs>
            <marker
              id="uf-arrow"
              markerWidth={6}
              markerHeight={6}
              refX={5}
              refY={3}
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L6,3 z" fill="#4b5563" />
            </marker>
          </defs>
          {layouts.map((l) => {
            const x = l.x * perTreeSpacing + 40
            const y = 40 + l.y * rowH
            const isActive = active.has(l.id)
            const isRoot = !l.parent
            const stroke = isActive ? '#f59e0b' : isRoot ? '#10b981' : '#8b5cf6'
            const fill = isActive
              ? 'rgba(245, 158, 11, 0.25)'
              : isRoot
                ? 'rgba(16, 185, 129, 0.15)'
                : '#12141b'
            const rank = step.rank?.[l.id]
            return (
              <g key={`n-${l.id}`}>
                <circle cx={x} cy={y} r={nodeR} fill={fill} stroke={stroke} strokeWidth={isActive ? 3 : 2} />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fontSize={13}
                  fontFamily="ui-monospace, monospace"
                  fontWeight={700}
                  fill={isActive ? '#f59e0b' : isRoot ? '#10b981' : '#e5e7eb'}
                >
                  {l.id}
                </text>
                {isRoot && rank !== undefined && (
                  <text
                    x={x + 22}
                    y={y - 12}
                    fontSize={9}
                    fontFamily="ui-monospace, monospace"
                    fill="#10b981"
                  >
                    r{rank}
                  </text>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      <div className="w-[240px] shrink-0 border-l border-border-subtle flex flex-col overflow-hidden bg-bg-panel">
        <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-b border-border-subtle">
          parent array
        </div>
        <div className="p-3 grid grid-cols-4 gap-1 text-xs font-mono">
          {step.elements.map((el) => {
            const id = String(el)
            const p = step.parent[id]
            const isActive = active.has(id)
            return (
              <div
                key={id}
                className={clsx(
                  'flex flex-col items-center rounded px-1 py-1 border',
                  isActive ? 'bg-viz-compare/15 border-viz-compare' : 'bg-bg border-border-subtle',
                )}
              >
                <div className="text-[9px] text-text-dim">[{id}]</div>
                <div className={clsx('font-semibold', p === id ? 'text-viz-sorted' : 'text-text')}>
                  {p}
                </div>
              </div>
            )
          })}
        </div>
        <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-t border-border-subtle border-b">
          operations log
        </div>
        <div className="p-3 flex flex-col gap-1 max-h-56 overflow-y-auto">
          {(step.operations ?? []).length === 0 ? (
            <div className="text-xs text-text-dim italic">none yet</div>
          ) : (
            step.operations!.map((o, i) => (
              <div
                key={i}
                className="px-2 py-1 rounded bg-bg border border-border-subtle text-[11px] font-mono text-text-muted"
              >
                {o}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
