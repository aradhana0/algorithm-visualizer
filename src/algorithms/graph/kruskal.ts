import type { GraphAlgorithm, GraphStep } from '../../types'
import { NODES, WEIGHTED_EDGES } from './canonical'

const PSEUDO = `procedure Kruskal(nodes, edges):
    // disjoint-set forest with path compression
    for each u: parent[u] ← u

    function find(x):
        while parent[x] ≠ x:
            parent[x] ← parent[parent[x]]  // compress
            x ← parent[x]
        return x

    function union(a, b):
        ra, rb ← find(a), find(b)
        if ra = rb: return FALSE
        parent[ra] ← rb
        return TRUE

    mst ← empty list
    for each edge (u, v, w) in sorted(edges by w):
        if union(u, v):
            append (u, v, w) to mst
            if |mst| = |nodes| - 1: break
    return mst`

const CODE = `def kruskal(nodes, edges):
    parent = {n: n for n in nodes}
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]  # path compression
            x = parent[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb: return False
        parent[ra] = rb
        return True

    mst = []
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        if union(u, v):
            mst.append((u, v, w))
            if len(mst) == len(nodes) - 1: break
    return mst`

function generate(): GraphStep[] {
  const steps: GraphStep[] = []
  const parent = new Map<string, string>()
  for (const n of NODES) parent.set(n.id, n.id)
  const treeEdges: Array<{ from: string; to: string }> = []
  const visited = new Set<string>()

  const find = (x: string): string => {
    let cur = x
    while (parent.get(cur) !== cur) cur = parent.get(cur)!
    return cur
  }

  const sorted = [...WEIGHTED_EDGES].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0))

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
      queueLabel: 'edges (sorted by weight)',
      queueContents: sorted.map((e) => ({ node: `${e.from}—${e.to}`, priority: e.weight })),
      line,
      message,
      ...extra,
    })
  }

  snap(2, 'Init disjoint-set: each node its own parent')
  snap(13, 'Sort edges by weight ascending')
  for (const e of sorted) {
    const ra = find(e.from)
    const rb = find(e.to)
    snap(14, `Consider ${e.from}—${e.to} (w=${e.weight}). find(${e.from})=${ra}, find(${e.to})=${rb}`, {
      activeEdges: [{ from: e.from, to: e.to }],
    })
    if (ra === rb) {
      snap(14, `Same root — would form a cycle, skip`, {
        activeEdges: [{ from: e.from, to: e.to }],
      })
      continue
    }
    parent.set(ra, rb)
    treeEdges.push({ from: e.from, to: e.to })
    visited.add(e.from)
    visited.add(e.to)
    snap(15, `Union: add edge ${e.from}—${e.to} to MST`, {
      activeEdges: [{ from: e.from, to: e.to }],
    })
    if (treeEdges.length === NODES.length - 1) {
      snap(16, `MST has V-1 = ${NODES.length - 1} edges → done`)
      break
    }
  }
  const total = treeEdges.reduce((s, e) => {
    const w = WEIGHTED_EDGES.find(
      (x) => (x.from === e.from && x.to === e.to) || (x.from === e.to && x.to === e.from),
    )?.weight
    return s + (w ?? 0)
  }, 0)
  snap(17, `MST total weight = ${total}`)
  return steps
}

export const kruskalAlgorithm: GraphAlgorithm = {
  id: 'kruskal-mst',
  name: "Kruskal's MST",
  category: 'Graph',
  complexity: { time: 'O(E log E)', space: 'O(V)' },
  description:
    'Minimum spanning tree by picking edges in ascending weight order, skipping any that form a cycle. Uses union-find for O(α) merges.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
