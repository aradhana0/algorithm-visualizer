import type { FrontierEntry, GraphAlgorithm, GraphStep } from '../../types'
import { NODES, WEIGHTED_EDGES, neighbors } from './canonical'

const PSEUDO = `procedure Dijkstra(graph, start):
    // min-priority queue keyed by tentative distance
    for each vertex u in graph:
        dist[u] ← ∞
    dist[start] ← 0
    pq ← [(0, start)]
    while pq is not empty:
        (d, u) ← extractMin(pq)
        if d > dist[u]:
            continue    // stale entry
        for each edge (u, v) with weight w:
            nd ← d + w
            if nd < dist[v]:
                dist[v] ← nd
                insert(pq, (nd, v))
    return dist`

const CODE = `import heapq

def dijkstra(graph, start):
    dist = {u: float('inf') for u in graph}
    dist[start] = 0
    pq = [(0, start)]
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]:
            continue
        for v, w in graph[u]:
            nd = d + w
            if nd < dist[v]:
                dist[v] = nd
                heapq.heappush(pq, (nd, v))
    return dist`

const START = 'A'

function generate(): GraphStep[] {
  const steps: GraphStep[] = []
  const dist: Record<string, number | null> = {}
  for (const n of NODES) dist[n.id] = null
  dist[START] = 0
  const pq: Array<{ node: string; priority: number }> = [{ node: START, priority: 0 }]
  const visited = new Set<string>()
  const treeEdges: Array<{ from: string; to: string }> = []
  const parent = new Map<string, string>()

  const snap = (
    line: number,
    message: string,
    extra: Partial<GraphStep> = {},
  ) => {
    steps.push({
      nodes: NODES,
      edges: WEIGHTED_EDGES,
      visitedNodes: Array.from(visited),
      treeEdges: [...treeEdges],
      queueLabel: 'priority queue',
      queueContents: pq.map(
        (e): FrontierEntry => ({ node: e.node, priority: e.priority }),
      ),
      frontierNodes: pq.map((e) => e.node),
      distances: { ...dist },
      line,
      message,
      ...extra,
    })
  }

  snap(4, 'Initialize distances to infinity')
  snap(5, `dist[${START}] = 0`)
  snap(6, `pq = [(0, ${START})]`)

  while (pq.length > 0) {
    // heappop
    pq.sort((a, b) => a.priority - b.priority)
    snap(7, 'Loop: pq not empty', { currentNode: pq[0].node })
    const top = pq.shift()!
    const { node: u, priority: d } = top
    snap(8, `pop min → (${d}, ${u})`, { currentNode: u })
    if (d > (dist[u] ?? Infinity)) {
      snap(9, `${d} > dist[${u}]=${dist[u]} → stale, skip`)
      continue
    }
    visited.add(u)
    for (const { to: v, weight: w } of neighbors(u, WEIGHTED_EDGES)) {
      snap(11, `Neighbor ${v}, weight=${w}`, {
        currentNode: u,
        activeEdges: [{ from: u, to: v }],
      })
      const nd = d + (w ?? 0)
      snap(12, `candidate distance to ${v} = ${d} + ${w} = ${nd}`, {
        currentNode: u,
        activeEdges: [{ from: u, to: v }],
      })
      const cur = dist[v]
      if (cur === null || nd < cur) {
        dist[v] = nd
        // Update parent for tree
        const prevParent = parent.get(v)
        if (prevParent) {
          const idx = treeEdges.findIndex((e) => e.from === prevParent && e.to === v)
          if (idx >= 0) treeEdges.splice(idx, 1)
        }
        parent.set(v, u)
        treeEdges.push({ from: u, to: v })
        snap(13, `${nd} < ${cur === null ? '∞' : cur} → update dist[${v}] = ${nd}`, {
          currentNode: u,
          activeEdges: [{ from: u, to: v }],
        })
        pq.push({ node: v, priority: nd })
        snap(14, `pq.push((${nd}, ${v}))`, {
          currentNode: u,
          activeEdges: [{ from: u, to: v }],
        })
      } else {
        snap(12, `${nd} >= ${cur} → no update`, {
          currentNode: u,
          activeEdges: [{ from: u, to: v }],
        })
      }
    }
  }
  snap(15, 'pq empty — all shortest distances found', { currentNode: null })
  return steps
}

export const dijkstraAlgorithm: GraphAlgorithm = {
  id: 'dijkstra',
  name: "Dijkstra's Shortest Paths",
  category: 'Graph',
  complexity: { time: 'O((V + E) log V)', space: 'O(V)' },
  description:
    'Greedy shortest-path from a source: always relax edges from the closest unfinalized node. Requires non-negative weights.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
