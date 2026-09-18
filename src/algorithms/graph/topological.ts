import type { GraphAlgorithm, GraphEdge, GraphNode, GraphStep } from '../../types'

const PSEUDO = `procedure TopoSort(nodes, edges):
    // Kahn's algorithm
    for each node u: indeg[u] ← 0
    for each edge (u, v):
        indeg[v] ← indeg[v] + 1
    queue ← all nodes with indeg = 0
    order ← empty list
    while queue is not empty:
        u ← dequeue(queue)
        append u to order
        for each neighbor v of u:
            indeg[v] ← indeg[v] - 1
            if indeg[v] = 0:
                enqueue(queue, v)
    return order if |order| = |nodes| else CYCLE`

const CODE = `from collections import deque

def topological_sort(nodes, edges):
    indeg = {n: 0 for n in nodes}
    for u, v in edges:
        indeg[v] += 1
    q = deque([n for n in nodes if indeg[n] == 0])
    order = []
    while q:
        u = q.popleft()
        order.append(u)
        for v in adj[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return order if len(order) == len(nodes) else None`

const NODES: GraphNode[] = [
  { id: 'A', label: 'A', x: 80, y: 60 },
  { id: 'B', label: 'B', x: 220, y: 60 },
  { id: 'C', label: 'C', x: 360, y: 60 },
  { id: 'D', label: 'D', x: 150, y: 180 },
  { id: 'E', label: 'E', x: 290, y: 180 },
  { id: 'F', label: 'F', x: 220, y: 300 },
]

const EDGES: GraphEdge[] = [
  { from: 'A', to: 'D', directed: true },
  { from: 'B', to: 'D', directed: true },
  { from: 'B', to: 'E', directed: true },
  { from: 'C', to: 'E', directed: true },
  { from: 'D', to: 'F', directed: true },
  { from: 'E', to: 'F', directed: true },
]

function adj(u: string): string[] {
  return EDGES.filter((e) => e.from === u).map((e) => e.to)
}

function generate(): GraphStep[] {
  const steps: GraphStep[] = []
  const indeg = new Map<string, number>()
  for (const n of NODES) indeg.set(n.id, 0)
  for (const e of EDGES) indeg.set(e.to, indeg.get(e.to)! + 1)
  const visited: string[] = []
  const order: string[] = []
  const q: string[] = []

  const snap = (line: number, message: string, extra: Partial<GraphStep> = {}) => {
    steps.push({
      nodes: NODES,
      edges: EDGES,
      visitedNodes: [...visited],
      frontierNodes: [...q],
      queueLabel: 'queue (indeg=0)',
      queueContents: q.map((n) => ({ node: n, priority: indeg.get(n) })),
      distances: Object.fromEntries(indeg),
      line,
      message,
      ...extra,
    })
  }

  snap(3, 'Compute in-degree for each node')
  for (const n of NODES) if (indeg.get(n.id) === 0) q.push(n.id)
  snap(7, `Enqueue nodes with indeg=0: ${JSON.stringify(q)}`)
  while (q.length > 0) {
    snap(9, `Loop: q not empty`)
    const u = q.shift()!
    order.push(u)
    visited.push(u)
    snap(10, `Pop ${u}, append to order: [${order.join(', ')}]`, { currentNode: u })
    for (const v of adj(u)) {
      const before = indeg.get(v)!
      indeg.set(v, before - 1)
      snap(13, `Decrement indeg[${v}]: ${before} → ${indeg.get(v)}`, {
        currentNode: u,
        activeEdges: [{ from: u, to: v }],
      })
      if (indeg.get(v) === 0) {
        q.push(v)
        snap(14, `indeg[${v}] = 0 → enqueue`, {
          currentNode: u,
          activeEdges: [{ from: u, to: v }],
        })
      }
    }
  }
  snap(15, `Done — order: [${order.join(', ')}]`, { currentNode: null })
  return steps
}

export const topologicalSort: GraphAlgorithm = {
  id: 'topological-sort',
  name: 'Topological Sort (Kahn)',
  category: 'Graph',
  complexity: { time: 'O(V + E)', space: 'O(V)' },
  description:
    "Kahn's algorithm on a DAG: repeatedly pop zero-indegree nodes and decrement neighbours' indegrees. Detects cycles when the output is shorter than V.",
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
