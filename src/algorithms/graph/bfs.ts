import type { GraphAlgorithm, GraphStep } from '../../types'
import { NODES, UNWEIGHTED_EDGES, neighbors } from './canonical'

const PSEUDO = `procedure BFS(graph, start):
    // uses a FIFO queue
    visited ← {start}
    queue ← [start]
    while queue is not empty:
        u ← dequeue(queue)
        for each neighbor v of u:
            if v ∉ visited:
                add v to visited
                enqueue(queue, v)`

const CODE = `from collections import deque

def bfs(graph, start):
    visited = {start}
    q = deque([start])
    while q:
        u = q.popleft()
        for v in graph[u]:
            if v not in visited:
                visited.add(v)
                q.append(v)`

const START = 'A'

function generate(): GraphStep[] {
  const steps: GraphStep[] = []
  const visited = new Set<string>()
  const treeEdges: Array<{ from: string; to: string }> = []
  const queue: string[] = []

  const snap = (
    line: number,
    message: string,
    extra: Partial<GraphStep> = {},
  ) => {
    steps.push({
      nodes: NODES,
      edges: UNWEIGHTED_EDGES,
      visitedNodes: Array.from(visited),
      treeEdges: [...treeEdges],
      queueLabel: 'queue',
      queueContents: queue.map((n) => ({ node: n })),
      frontierNodes: [...queue],
      line,
      message,
      ...extra,
    })
  }

  snap(1, `Start BFS from ${START}`)
  visited.add(START)
  queue.push(START)
  snap(4, `visited = {${START}}`)
  snap(5, `queue = [${START}]`)

  while (queue.length > 0) {
    snap(6, `Loop: queue not empty`, { currentNode: queue[0] })
    const u = queue.shift()!
    snap(7, `u = queue.popleft() → ${u}`, { currentNode: u })
    for (const { to: v } of neighbors(u, UNWEIGHTED_EDGES)) {
      snap(8, `Check neighbor ${v}`, {
        currentNode: u,
        activeEdges: [{ from: u, to: v }],
      })
      if (!visited.has(v)) {
        visited.add(v)
        treeEdges.push({ from: u, to: v })
        snap(9, `${v} not visited — add to visited`, {
          currentNode: u,
          activeEdges: [{ from: u, to: v }],
        })
        queue.push(v)
        snap(10, `queue.append(${v})`, {
          currentNode: u,
          activeEdges: [{ from: u, to: v }],
        })
      } else {
        snap(8, `${v} already visited — skip`, {
          currentNode: u,
          activeEdges: [{ from: u, to: v }],
        })
      }
    }
  }
  snap(6, 'Queue empty — BFS done', {
    currentNode: null,
  })
  return steps
}

export const bfsAlgorithm: GraphAlgorithm = {
  id: 'bfs',
  name: 'Breadth-First Search',
  category: 'Graph',
  complexity: { time: 'O(V + E)', space: 'O(V)' },
  description:
    'Explore neighbors level by level using a FIFO queue. Finds shortest paths in unweighted graphs.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
