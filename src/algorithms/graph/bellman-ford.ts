import type { GraphAlgorithm, GraphEdge, GraphNode, GraphStep } from '../../types'

const PSEUDO = `procedure BellmanFord(nodes, edges, start):
    for each vertex u: dist[u] ← ∞
    dist[start] ← 0
    repeat |V| - 1 times:
        updated ← FALSE
        for each edge (u, v) with weight w:
            if dist[u] + w < dist[v]:
                dist[v] ← dist[u] + w
                updated ← TRUE
        if not updated:
            break
    // negative-cycle check
    for each edge (u, v) with weight w:
        if dist[u] + w < dist[v]:
            raise error "negative cycle"
    return dist`

const CODE = `def bellman_ford(nodes, edges, start):
    dist = {n: float('inf') for n in nodes}
    dist[start] = 0
    for _ in range(len(nodes) - 1):
        updated = False
        for u, v, w in edges:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                updated = True
        if not updated:
            break
    # negative cycle check
    for u, v, w in edges:
        if dist[u] + w < dist[v]:
            raise ValueError("negative cycle")
    return dist`

// Small directed graph — includes a negative edge to demonstrate the algorithm
const NODES: GraphNode[] = [
  { id: 'A', label: 'A', x: 80, y: 60 },
  { id: 'B', label: 'B', x: 260, y: 60 },
  { id: 'C', label: 'C', x: 440, y: 60 },
  { id: 'D', label: 'D', x: 170, y: 220 },
  { id: 'E', label: 'E', x: 350, y: 220 },
]

const EDGES: GraphEdge[] = [
  { from: 'A', to: 'B', weight: 4, directed: true },
  { from: 'A', to: 'D', weight: 5, directed: true },
  { from: 'B', to: 'C', weight: 3, directed: true },
  { from: 'B', to: 'D', weight: -2, directed: true },
  { from: 'C', to: 'E', weight: 2, directed: true },
  { from: 'D', to: 'E', weight: 6, directed: true },
]

const START = 'A'

function generate(): GraphStep[] {
  const steps: GraphStep[] = []
  const dist: Record<string, number | null> = {}
  for (const n of NODES) dist[n.id] = null
  dist[START] = 0

  const snap = (line: number, message: string, extra: Partial<GraphStep> = {}) => {
    steps.push({
      nodes: NODES,
      edges: EDGES,
      distances: { ...dist },
      queueLabel: 'iterations',
      queueContents: [],
      line,
      message,
      ...extra,
    })
  }

  snap(3, `Init dist[${START}] = 0, others = ∞`)

  for (let it = 1; it < NODES.length; it++) {
    snap(4, `Iteration ${it} of ${NODES.length - 1}`)
    let updated = false
    for (const e of EDGES) {
      const du = dist[e.from]
      const dv = dist[e.to]
      if (du === null) continue
      const cand = du + (e.weight ?? 0)
      snap(6, `Edge ${e.from}→${e.to} (w=${e.weight}): dist[${e.from}]+${e.weight} = ${cand} vs dist[${e.to}]=${dv === null ? '∞' : dv}`, {
        activeEdges: [{ from: e.from, to: e.to }],
        currentNode: e.from,
      })
      if (dv === null || cand < dv) {
        dist[e.to] = cand
        updated = true
        snap(7, `Relax: dist[${e.to}] = ${cand}`, {
          activeEdges: [{ from: e.from, to: e.to }],
          currentNode: e.to,
        })
      }
    }
    if (!updated) {
      snap(10, `No updates this pass — early exit`)
      break
    }
  }
  snap(15, `Done — shortest paths from ${START} finalized`, { currentNode: null })
  return steps
}

export const bellmanFordAlgorithm: GraphAlgorithm = {
  id: 'bellman-ford',
  name: 'Bellman-Ford',
  category: 'Graph',
  complexity: { time: 'O(V·E)', space: 'O(V)' },
  description:
    'Shortest paths from a source that handles negative edge weights. Relax every edge V-1 times; a further pass that still relaxes indicates a negative cycle.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
