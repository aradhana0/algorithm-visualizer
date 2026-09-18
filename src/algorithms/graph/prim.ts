import type { GraphAlgorithm, GraphStep } from '../../types'
import { NODES, WEIGHTED_EDGES, neighbors } from './canonical'

const PSEUDO = `procedure Prim(start):
    // grow the MST from start using a min-priority queue of edges
    visited ← {start}
    pq ← all edges (start, v) with weights
    heapify(pq)
    mst ← empty list
    while pq is not empty and |visited| < |nodes|:
        (w, u, v) ← extractMin(pq)
        if v ∈ visited: continue
        add v to visited
        append (u, v, w) to mst
        for each edge (v, nxt) with weight nw:
            if nxt ∉ visited:
                insert(pq, (nw, v, nxt))
    return mst`

const CODE = `import heapq

def prim(start):
    visited = {start}
    pq = [(w, start, v) for v, w in adj[start]]
    heapq.heapify(pq)
    mst = []
    while pq and len(visited) < len(nodes):
        w, u, v = heapq.heappop(pq)
        if v in visited: continue
        visited.add(v)
        mst.append((u, v, w))
        for nxt, nw in adj[v]:
            if nxt not in visited:
                heapq.heappush(pq, (nw, v, nxt))
    return mst`

const START = 'A'

function generate(): GraphStep[] {
  const steps: GraphStep[] = []
  const visited = new Set<string>()
  const treeEdges: Array<{ from: string; to: string }> = []
  const pq: Array<{ weight: number; from: string; to: string }> = []

  visited.add(START)
  for (const { to, weight } of neighbors(START, WEIGHTED_EDGES)) {
    pq.push({ weight: weight ?? 0, from: START, to })
  }

  const snap = (line: number, message: string, extra: Partial<GraphStep> = {}) => {
    pq.sort((a, b) => a.weight - b.weight)
    steps.push({
      nodes: NODES,
      edges: WEIGHTED_EDGES,
      visitedNodes: Array.from(visited),
      treeEdges: [...treeEdges],
      queueLabel: 'PQ (weight, from, to)',
      queueContents: pq.map((e) => ({ node: `${e.from}→${e.to}`, priority: e.weight })),
      line,
      message,
      ...extra,
    })
  }

  snap(4, `Start from ${START}, add its edges to PQ`)
  while (pq.length > 0 && visited.size < NODES.length) {
    pq.sort((a, b) => a.weight - b.weight)
    const top = pq.shift()!
    snap(8, `Pop min (w=${top.weight}): ${top.from}→${top.to}`, {
      currentNode: top.to,
      activeEdges: [{ from: top.from, to: top.to }],
    })
    if (visited.has(top.to)) {
      snap(9, `${top.to} already in tree — skip`, {
        currentNode: top.to,
        activeEdges: [{ from: top.from, to: top.to }],
      })
      continue
    }
    visited.add(top.to)
    treeEdges.push({ from: top.from, to: top.to })
    snap(11, `Add edge ${top.from}—${top.to} to MST`, {
      currentNode: top.to,
      activeEdges: [{ from: top.from, to: top.to }],
    })
    for (const { to: nxt, weight: w } of neighbors(top.to, WEIGHTED_EDGES)) {
      if (!visited.has(nxt)) {
        pq.push({ weight: w ?? 0, from: top.to, to: nxt })
        snap(13, `Push (${w}, ${top.to}, ${nxt}) to PQ`, {
          currentNode: top.to,
        })
      }
    }
  }
  const total = treeEdges.reduce((s, e) => {
    const w = WEIGHTED_EDGES.find(
      (x) => (x.from === e.from && x.to === e.to) || (x.from === e.to && x.to === e.from),
    )?.weight
    return s + (w ?? 0)
  }, 0)
  snap(14, `MST total weight = ${total}`, { currentNode: null })
  return steps
}

export const primAlgorithm: GraphAlgorithm = {
  id: 'prim-mst',
  name: "Prim's MST",
  category: 'Graph',
  complexity: { time: 'O(E log V)', space: 'O(V)' },
  description:
    'MST by growing a tree from a start node: always add the minimum-weight edge that crosses from the tree to a new vertex.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
