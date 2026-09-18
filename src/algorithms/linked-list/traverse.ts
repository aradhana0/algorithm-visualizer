import type { LLEdge, LinkedListAlgorithm, LinkedListStep } from '../../types'

const PSEUDO = `procedure traverse(head):
    curr ← head
    while curr ≠ NIL:
        visit(curr.value)
        curr ← curr.next`

const CODE = `def traverse(head):
    curr = head
    while curr is not None:
        print(curr.value)
        curr = curr.next`

const VALUES = [10, 22, 7, 45, 3, 18]

function generate(): LinkedListStep[] {
  const nodes = VALUES.map((v, i) => ({ id: `n${i}`, value: v }))
  const edges: LLEdge[] = nodes.map((n, i) => ({
    from: n.id,
    to: i < nodes.length - 1 ? nodes[i + 1].id : null,
  }))
  const list = { head: nodes[0].id, nodes, edges }
  const steps: LinkedListStep[] = []
  steps.push({
    lists: [list],
    pointers: [],
    line: 1,
    message: 'Start with head of list',
  })
  let curr: string | null = nodes[0].id
  steps.push({
    lists: [list],
    pointers: [{ name: 'curr', nodeId: curr }],
    line: 2,
    message: 'curr = head',
  })
  while (curr !== null) {
    const idx = nodes.findIndex((n) => n.id === curr)
    steps.push({
      lists: [list],
      pointers: [{ name: 'curr', nodeId: curr }],
      highlightNodes: [curr],
      line: 3,
      message: `Check curr is not None (visiting node[${idx}]=${nodes[idx].value})`,
    })
    steps.push({
      lists: [list],
      pointers: [{ name: 'curr', nodeId: curr }],
      highlightNodes: [curr],
      line: 4,
      message: `print(${nodes[idx].value})`,
    })
    const nextEdge = edges.find((e) => e.from === curr)
    const next = nextEdge ? nextEdge.to : null
    steps.push({
      lists: [list],
      pointers: [{ name: 'curr', nodeId: next }],
      highlightEdges: nextEdge ? [nextEdge] : [],
      line: 5,
      message: 'curr = curr.next',
    })
    curr = next
  }
  steps.push({
    lists: [list],
    pointers: [{ name: 'curr', nodeId: null }],
    line: 3,
    message: 'curr is None — done',
  })
  return steps
}

export const traverseList: LinkedListAlgorithm = {
  id: 'll-traverse',
  name: 'Traversal',
  category: 'Data Structures',
  complexity: { time: 'O(n)', space: 'O(1)' },
  description:
    'Walk from head to end using a single pointer, visiting each node exactly once.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
