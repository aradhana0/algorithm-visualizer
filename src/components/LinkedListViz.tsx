import type { LLEdge, LLList, LinkedListStep } from '../types'

type Props = {
  step: LinkedListStep
}

const NODE_W = 80
const NODE_H = 44
const GAP = 40
const ROW_H = 200
const ROW_TOP_OFFSET = 100
const POINTER_H = 20
const PADDING_X = 40
const NULL_W = 44

const POINTER_COLORS = ['#f59e0b', '#ef4444', '#10b981', '#8b5cf6', '#3b82f6', '#ec4899']

export function LinkedListViz({ step }: Props) {
  const hlNodes = new Set(step.highlightNodes ?? [])
  const hlEdges = new Set(
    (step.highlightEdges ?? []).map((e) => `${e.from}|${e.to ?? '__null__'}`),
  )

  // Compute layout per list (each list is one horizontal row)
  const layouts = step.lists.map((list, listIndex) => layoutList(list, listIndex))

  const width = Math.max(
    600,
    ...layouts.map((l) => l.width + PADDING_X * 2),
  )
  const height = layouts.length * ROW_H + 40

  // Assign colors to pointers deterministically by name
  const pointerColor = new Map<string, string>()
  step.pointers.forEach((p, i) => {
    pointerColor.set(p.name, p.color || POINTER_COLORS[i % POINTER_COLORS.length])
  })

  return (
    <div className="w-full h-full overflow-auto p-4">
      <svg width={width} height={height} className="mx-auto block">
        {layouts.map((layout, listIndex) => {
          const list = step.lists[listIndex]
          const rowY = listIndex * ROW_H + ROW_TOP_OFFSET
          return (
            <g key={listIndex}>
              {list.label && (
                <text
                  x={PADDING_X}
                  y={rowY - 40}
                  fontSize={12}
                  fill="#9ca3af"
                  fontFamily="ui-monospace, monospace"
                >
                  {list.label}
                </text>
              )}
              {/* head label */}
              {list.head && layout.positions.has(list.head) && (
                <HeadLabel
                  x={layout.positions.get(list.head)! + NODE_W / 2}
                  y={rowY}
                />
              )}
              {/* edges first (under nodes) */}
              {list.edges.map((edge, i) => (
                <EdgeArrow
                  key={i}
                  edge={edge}
                  layout={layout}
                  rowY={rowY}
                  highlighted={hlEdges.has(`${edge.from}|${edge.to ?? '__null__'}`)}
                />
              ))}
              {/* NULL sinks — one per list if edge terminates in null */}
              {layout.nullX !== null && (
                <NullNode x={layout.nullX} y={rowY} />
              )}
              {/* nodes */}
              {list.nodes.map((n) => {
                const x = layout.positions.get(n.id)!
                return (
                  <NodeBox
                    key={n.id}
                    x={x}
                    y={rowY}
                    value={n.value}
                    highlighted={hlNodes.has(n.id)}
                  />
                )
              })}
              {/* pointers pointing at nodes in THIS list */}
              {step.pointers
                .filter((p) => (p.listIndex ?? 0) === listIndex)
                .map((p, pi) => {
                  const targetX =
                    p.nodeId === null
                      ? layout.nullX !== null
                        ? layout.nullX + NULL_W / 2
                        : PADDING_X
                      : (layout.positions.get(p.nodeId) ?? PADDING_X) + NODE_W / 2
                  return (
                    <PointerPill
                      key={`${p.name}-${pi}`}
                      x={targetX}
                      y={rowY - 8}
                      name={p.name}
                      color={pointerColor.get(p.name)!}
                      stackIdx={pi}
                      pointsAtNull={p.nodeId === null}
                    />
                  )
                })}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

type Layout = {
  positions: Map<string, number>
  width: number
  nullX: number | null
}

function layoutList(list: LLList, _listIndex: number): Layout {
  // Use insertion order so node positions stay stable across steps (this makes
  // reversed edges and cycles show up as curved back-arrows instead of scrambling)
  const positions = new Map<string, number>()
  list.nodes.forEach((n, i) => {
    positions.set(n.id, PADDING_X + i * (NODE_W + GAP))
  })

  const width = list.nodes.length * (NODE_W + GAP) + NULL_W
  const hasNullEdge = list.edges.some((e) => e.to === null)
  const nullX = hasNullEdge ? PADDING_X + list.nodes.length * (NODE_W + GAP) : null
  return { positions, width, nullX }
}

function NodeBox({
  x,
  y,
  value,
  highlighted,
}: {
  x: number
  y: number
  value: number | string
  highlighted: boolean
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={NODE_W}
        height={NODE_H}
        rx={6}
        fill={highlighted ? 'rgba(245, 158, 11, 0.2)' : '#12141b'}
        stroke={highlighted ? '#f59e0b' : '#8b5cf6'}
        strokeWidth={highlighted ? 2 : 1.5}
      />
      <line
        x1={x + NODE_W - 24}
        y1={y}
        x2={x + NODE_W - 24}
        y2={y + NODE_H}
        stroke={highlighted ? '#f59e0b' : '#374151'}
        strokeWidth={1}
      />
      <text
        x={x + (NODE_W - 24) / 2}
        y={y + NODE_H / 2 + 5}
        textAnchor="middle"
        fontSize={15}
        fontFamily="ui-monospace, monospace"
        fill={highlighted ? '#f59e0b' : '#e5e7eb'}
        fontWeight={600}
      >
        {value}
      </text>
      <circle
        cx={x + NODE_W - 12}
        cy={y + NODE_H / 2}
        r={3}
        fill={highlighted ? '#f59e0b' : '#8b5cf6'}
      />
    </g>
  )
}

function NullNode({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect
        x={x}
        y={y + 4}
        width={NULL_W}
        height={NODE_H - 8}
        rx={4}
        fill="#1a1d26"
        stroke="#374151"
        strokeDasharray="3 3"
      />
      <text
        x={x + NULL_W / 2}
        y={y + NODE_H / 2 + 4}
        textAnchor="middle"
        fontSize={11}
        fontFamily="ui-monospace, monospace"
        fill="#6b7280"
      >
        NULL
      </text>
    </g>
  )
}

function EdgeArrow({
  edge,
  layout,
  rowY,
  highlighted,
}: {
  edge: LLEdge
  layout: Layout
  rowY: number
  highlighted: boolean
}) {
  const stroke = highlighted ? '#f59e0b' : '#6b7280'
  const strokeW = highlighted ? 2 : 1.5
  const fromX = (layout.positions.get(edge.from) ?? 0) + NODE_W - 6
  const fromY = rowY + NODE_H / 2

  let toX: number
  let toY: number
  if (edge.to === null) {
    if (layout.nullX === null) return null
    toX = layout.nullX
    toY = rowY + NODE_H / 2
  } else {
    const nodeX = layout.positions.get(edge.to)
    if (nodeX === undefined) return null
    toX = nodeX
    toY = rowY + NODE_H / 2
  }

  const isBackward = toX < fromX
  const markerId = highlighted ? 'arrowhead-hl' : 'arrowhead'

  if (isBackward) {
    // Curve below the nodes for a cycle
    const dip = 46
    const midX = (fromX + toX) / 2
    const midY = rowY + NODE_H + dip
    return (
      <>
        <defs>
          <marker
            id={markerId}
            markerWidth={8}
            markerHeight={8}
            refX={7}
            refY={4}
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L0,8 L8,4 z" fill={stroke} />
          </marker>
        </defs>
        <path
          d={`M ${fromX} ${fromY} Q ${midX} ${midY} ${toX} ${toY}`}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeW}
          markerEnd={`url(#${markerId})`}
        />
      </>
    )
  }

  return (
    <>
      <defs>
        <marker
          id={markerId}
          markerWidth={8}
          markerHeight={8}
          refX={7}
          refY={4}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,8 L8,4 z" fill={stroke} />
        </marker>
      </defs>
      <line
        x1={fromX}
        y1={fromY}
        x2={toX - 4}
        y2={toY}
        stroke={stroke}
        strokeWidth={strokeW}
        markerEnd={`url(#${markerId})`}
      />
    </>
  )
}

function HeadLabel({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <text
        x={x}
        y={y - 34}
        textAnchor="middle"
        fontSize={11}
        fill="#9ca3af"
        fontFamily="ui-monospace, monospace"
      >
        head
      </text>
      <line
        x1={x}
        y1={y - 28}
        x2={x}
        y2={y - 4}
        stroke="#9ca3af"
        strokeWidth={1}
        markerEnd="url(#head-arrow)"
      />
      <defs>
        <marker
          id="head-arrow"
          markerWidth={6}
          markerHeight={6}
          refX={5}
          refY={3}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L6,3 z" fill="#9ca3af" />
        </marker>
      </defs>
    </g>
  )
}

function PointerPill({
  x,
  y,
  name,
  color,
  stackIdx,
  pointsAtNull,
}: {
  x: number
  y: number
  name: string
  color: string
  stackIdx: number
  pointsAtNull: boolean
}) {
  const pillW = Math.max(28, name.length * 8 + 12)
  const pillH = 18
  // Stack pointers vertically above the node so multiple can share a target
  const offsetY = POINTER_H + stackIdx * (pillH + 4)
  const pillY = y - offsetY - pillH
  return (
    <g>
      <rect
        x={x - pillW / 2}
        y={pillY}
        width={pillW}
        height={pillH}
        rx={9}
        fill={color}
        opacity={0.9}
      />
      <text
        x={x}
        y={pillY + 13}
        textAnchor="middle"
        fontSize={11}
        fontFamily="ui-monospace, monospace"
        fill="#0b0d12"
        fontWeight={700}
      >
        {name}
      </text>
      <line
        x1={x}
        y1={pillY + pillH}
        x2={x}
        y2={y - (pointsAtNull ? 4 : 4)}
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray={pointsAtNull ? '3 3' : undefined}
      />
    </g>
  )
}

