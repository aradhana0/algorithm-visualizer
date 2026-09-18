import type { VizSnapshot } from '../pyodide/runner'
import clsx from 'clsx'

const MAX_NAME_LEN = 60
const MAX_LABEL_LEN = 120

function cap(v: string | null | undefined, max: number): string {
  if (v === null || v === undefined) return ''
  const s = String(v)
  return s.length > max ? s.slice(0, max) + '…' : s
}

export function VizRenderer({ snap }: { snap: VizSnapshot }) {
  return (
    <div className="border border-border-subtle rounded-lg bg-bg-panel p-3">
      <div className="flex items-baseline justify-between mb-2 gap-2">
        <span className="text-xs font-mono text-accent break-all">{cap(snap.name, MAX_NAME_LEN)}</span>
        {snap.label && (
          <span className="text-[10px] text-text-dim break-all text-right">
            {cap(snap.label, MAX_LABEL_LEN)}
          </span>
        )}
      </div>
      {snap.kind === 'array' && <ArrayViz data={snap.data} highlight={snap.highlight} />}
      {snap.kind === 'matrix' && <MatrixViz data={snap.data} highlight={snap.highlight} />}
      {snap.kind === 'graph' && (
        <GraphViz
          nodes={snap.data.nodes}
          edges={snap.data.edges}
          highlightNodes={snap.highlight_nodes}
          highlightEdges={snap.highlight_edges}
        />
      )}
      {snap.kind === 'tree' && <TreeViz data={snap.data} highlight={snap.highlight} />}
    </div>
  )
}

function ArrayViz({
  data,
  highlight,
}: {
  data: (number | string)[]
  highlight: number[] | null
}) {
  const highlightSet = new Set(highlight ?? [])
  const numeric = data.every((x) => typeof x === 'number')
  if (numeric && data.length > 0) {
    const nums = data as number[]
    const max = Math.max(...nums, 1)
    const min = Math.min(...nums, 0)
    const range = Math.max(max - Math.min(min, 0), 1)
    return (
      <div className="flex items-end gap-[2px] h-32">
        {nums.map((v, i) => (
          <div
            key={i}
            className={clsx(
              'flex-1 min-w-[6px] rounded-sm relative',
              highlightSet.has(i) ? 'bg-viz-compare' : 'bg-viz-bar',
            )}
            style={{ height: `${((v - Math.min(min, 0)) / range) * 100}%` }}
            title={`[${i}] = ${v}`}
          >
            {data.length <= 25 && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-text-dim">
                {v}
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="flex flex-wrap gap-1">
      {data.map((v, i) => (
        <div
          key={i}
          className={clsx(
            'px-2 py-1 rounded font-mono text-xs border',
            highlightSet.has(i)
              ? 'bg-viz-compare/20 border-viz-compare text-viz-compare'
              : 'bg-bg border-border-subtle text-text-muted',
          )}
        >
          {String(v)}
        </div>
      ))}
    </div>
  )
}

function MatrixViz({
  data,
  highlight,
}: {
  data: (number | string)[][]
  highlight: [number, number][] | null
}) {
  const highlightSet = new Set((highlight ?? []).map(([r, c]) => `${r},${c}`))
  return (
    <div className="inline-block">
      {data.map((row, r) => (
        <div key={r} className="flex">
          {row.map((v, c) => (
            <div
              key={c}
              className={clsx(
                'w-8 h-8 border border-border-subtle flex items-center justify-center text-xs font-mono',
                highlightSet.has(`${r},${c}`)
                  ? 'bg-viz-compare/30 text-viz-compare'
                  : 'bg-bg text-text-muted',
              )}
            >
              {String(v)}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function GraphViz({
  nodes,
  edges,
  highlightNodes,
  highlightEdges,
}: {
  nodes: (string | number)[]
  edges: [string | number, string | number][]
  highlightNodes: (string | number)[] | null
  highlightEdges: [string | number, string | number][] | null
}) {
  const size = 300
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 20
  const positions = new Map<string, { x: number; y: number }>()
  nodes.forEach((n, i) => {
    const angle = (i / nodes.length) * 2 * Math.PI - Math.PI / 2
    positions.set(String(n), { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) })
  })
  const hlNodes = new Set((highlightNodes ?? []).map(String))
  const hlEdges = new Set(
    (highlightEdges ?? []).map(([a, b]) => `${String(a)}|${String(b)}`),
  )
  return (
    <svg width={size} height={size} className="block mx-auto">
      {edges.map(([a, b], i) => {
        const pa = positions.get(String(a))
        const pb = positions.get(String(b))
        if (!pa || !pb) return null
        const key = `${String(a)}|${String(b)}`
        const rev = `${String(b)}|${String(a)}`
        const hl = hlEdges.has(key) || hlEdges.has(rev)
        return (
          <line
            key={i}
            x1={pa.x}
            y1={pa.y}
            x2={pb.x}
            y2={pb.y}
            stroke={hl ? '#f59e0b' : '#374151'}
            strokeWidth={hl ? 2 : 1}
          />
        )
      })}
      {nodes.map((n) => {
        const p = positions.get(String(n))!
        const hl = hlNodes.has(String(n))
        return (
          <g key={String(n)}>
            <circle
              cx={p.x}
              cy={p.y}
              r={16}
              fill={hl ? '#f59e0b' : '#1a1d26'}
              stroke={hl ? '#f59e0b' : '#8b5cf6'}
              strokeWidth={2}
            />
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fontSize={11}
              fill={hl ? '#0b0d12' : '#e5e7eb'}
              fontFamily="ui-monospace, monospace"
            >
              {String(n)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

type TreeNode = { value: string | number; children?: TreeNode[] } | null | undefined

function computeTreeLayout(
  root: TreeNode,
  x = 0.5,
  y = 40,
  spread = 0.25,
  depth = 60,
): Array<{ node: NonNullable<TreeNode>; x: number; y: number; parent?: { x: number; y: number } }> {
  if (!root) return []
  const nodes: Array<{
    node: NonNullable<TreeNode>
    x: number
    y: number
    parent?: { x: number; y: number }
  }> = []
  function walk(
    n: NonNullable<TreeNode>,
    cx: number,
    cy: number,
    sp: number,
    parent?: { x: number; y: number },
  ) {
    nodes.push({ node: n, x: cx, y: cy, parent })
    const children = n.children ?? []
    const nc = children.length
    if (nc === 0) return
    const start = cx - sp / 2 + sp / (2 * nc)
    children.forEach((c, i) => {
      if (!c) return
      walk(c as NonNullable<TreeNode>, start + i * (sp / nc), cy + depth, sp / nc, { x: cx, y: cy })
    })
  }
  walk(root as NonNullable<TreeNode>, x, y, spread)
  return nodes
}

function TreeViz({
  data,
  highlight,
}: {
  data: unknown
  highlight: (string | number)[] | null
}) {
  const w = 400
  const h = 220
  const layout = computeTreeLayout(data as TreeNode, 0.5, 30, 0.9, 55)
  const hl = new Set((highlight ?? []).map(String))
  if (layout.length === 0) return <div className="text-xs text-text-dim">empty tree</div>
  return (
    <svg width={w} height={h} className="block mx-auto">
      {layout.map((item, i) =>
        item.parent ? (
          <line
            key={`e-${i}`}
            x1={item.parent.x * w}
            y1={item.parent.y}
            x2={item.x * w}
            y2={item.y}
            stroke="#374151"
          />
        ) : null,
      )}
      {layout.map((item, i) => {
        const isHl = hl.has(String(item.node.value))
        return (
          <g key={`n-${i}`}>
            <circle
              cx={item.x * w}
              cy={item.y}
              r={16}
              fill={isHl ? '#f59e0b' : '#1a1d26'}
              stroke={isHl ? '#f59e0b' : '#8b5cf6'}
              strokeWidth={2}
            />
            <text
              x={item.x * w}
              y={item.y + 4}
              textAnchor="middle"
              fontSize={11}
              fill={isHl ? '#0b0d12' : '#e5e7eb'}
              fontFamily="ui-monospace, monospace"
            >
              {String(item.node.value)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
