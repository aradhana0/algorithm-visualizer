import type { GraphAlgorithm, GraphStep } from '../../types'
import { NODES, UNWEIGHTED_EDGES, neighbors } from './canonical'

const PSEUDO = `procedure DFS(graph, start):
    visited ← ∅
    stack ← [start]
    while stack is not empty:
        u ← pop(stack)
        if u ∈ visited:
            continue
        add u to visited
        for each neighbor v of u:
            if v ∉ visited:
                push(stack, v)`

const CODE = `def dfs(graph, start):
    visited = set()
    stack = [start]
    while stack:
        u = stack.pop()
        if u in visited:
            continue
        visited.add(u)
        for v in graph[u]:
            if v not in visited:
                stack.append(v)`

const START = 'A'

function generate(): GraphStep[] {
  const steps: GraphStep[] = []
  const visited = new Set<string>()
  const treeEdges: Array<{ from: string; to: string }> = []
  const stack: string[] = []
  const parent = new Map<string, string>()

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
      queueLabel: 'stack',
      queueContents: stack.map((n) => ({ node: n })),
      frontierNodes: [...stack],
      line,
      message,
      ...extra,
    })
  }

  snap(1, `Start DFS from ${START}`)
  stack.push(START)
  snap(3, `stack = [${START}]`)

  while (stack.length > 0) {
    snap(4, 'Loop: stack not empty', { currentNode: stack[stack.length - 1] })
    const u = stack.pop()!
    snap(5, `u = stack.pop() → ${u}`, { currentNode: u })
    if (visited.has(u)) {
      snap(7, `${u} already visited — continue`)
      continue
    }
    visited.add(u)
    const par = parent.get(u)
    if (par) treeEdges.push({ from: par, to: u })
    snap(8, `visited.add(${u})`, { currentNode: u })
    // Iterate neighbors in reverse so leftmost is on top of stack (visual order preference)
    const nbrs = neighbors(u, UNWEIGHTED_EDGES)
    for (let idx = nbrs.length - 1; idx >= 0; idx--) {
      const v = nbrs[idx].to
      snap(9, `Check neighbor ${v}`, {
        currentNode: u,
        activeEdges: [{ from: u, to: v }],
      })
      if (!visited.has(v)) {
        stack.push(v)
        if (!parent.has(v)) parent.set(v, u)
        snap(10, `stack.append(${v})`, {
          currentNode: u,
          activeEdges: [{ from: u, to: v }],
        })
      }
    }
  }
  snap(4, 'Stack empty — DFS done', { currentNode: null })
  return steps
}

export const dfsAlgorithm: GraphAlgorithm = {
  id: 'dfs',
  name: 'Depth-First Search',
  category: 'Graph',
  complexity: { time: 'O(V + E)', space: 'O(V)' },
  description:
    'Explore as far as possible along each branch before backtracking, using a LIFO stack.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
