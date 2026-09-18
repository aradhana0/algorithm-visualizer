import type { LLEdge, LinkedListAlgorithm, LinkedListStep } from '../../types'

const PSEUDO = `procedure reverse(head):
    prev ← NIL
    curr ← head
    while curr ≠ NIL:
        nxt ← curr.next
        curr.next ← prev              // flip pointer
        prev ← curr
        curr ← nxt
    return prev                        // new head`

const CODE = `def reverse(head):
    prev = None
    curr = head
    while curr is not None:
        next_ = curr.next
        curr.next = prev
        prev = curr
        curr = next_
    return prev`

const VALUES = [10, 22, 7, 45, 3]

function makeList() {
  const nodes = VALUES.map((v, i) => ({ id: `n${i}`, value: v }))
  const edges: LLEdge[] = nodes.map((n, i) => ({
    from: n.id,
    to: i < nodes.length - 1 ? nodes[i + 1].id : null,
  }))
  return { nodes, edges }
}

function generate(): LinkedListStep[] {
  const { nodes, edges } = makeList()
  const listBase = { head: nodes[0].id, nodes }
  const steps: LinkedListStep[] = []

  const snap = (
    curEdges: LLEdge[],
    head: string | null,
    pointers: LinkedListStep['pointers'],
    line: number,
    message: string,
    highlightEdges?: Array<{ from: string; to: string | null }>,
  ) => {
    steps.push({
      lists: [{ ...listBase, head, edges: [...curEdges] }],
      pointers,
      highlightEdges,
      line,
      message,
    })
  }

  let curEdges = [...edges]
  let head: string | null = nodes[0].id
  snap(curEdges, head, [], 1, 'Start')

  let prev: string | null = null
  let curr: string | null = head
  snap(curEdges, head, [{ name: 'prev', nodeId: prev }, { name: 'curr', nodeId: curr }], 2, 'prev = None')
  snap(curEdges, head, [{ name: 'prev', nodeId: prev }, { name: 'curr', nodeId: curr }], 3, 'curr = head')

  while (curr !== null) {
    const currIdx = nodes.findIndex((n) => n.id === curr)
    snap(
      curEdges,
      head,
      [
        { name: 'prev', nodeId: prev },
        { name: 'curr', nodeId: curr },
      ],
      4,
      `Loop: curr = node[${currIdx}]=${nodes[currIdx].value}`,
    )
    const nextEdge = curEdges.find((e) => e.from === curr)
    const nextId = nextEdge ? nextEdge.to : null
    snap(
      curEdges,
      head,
      [
        { name: 'prev', nodeId: prev },
        { name: 'curr', nodeId: curr },
        { name: 'next_', nodeId: nextId },
      ],
      5,
      'next_ = curr.next',
    )
    // Rewrite the edge: curr.next = prev
    curEdges = curEdges.filter((e) => e.from !== curr)
    curEdges.push({ from: curr, to: prev })
    snap(
      curEdges,
      head,
      [
        { name: 'prev', nodeId: prev },
        { name: 'curr', nodeId: curr },
        { name: 'next_', nodeId: nextId },
      ],
      6,
      'curr.next = prev  ← arrow flipped',
      [{ from: curr, to: prev }],
    )
    prev = curr
    snap(
      curEdges,
      head,
      [
        { name: 'prev', nodeId: prev },
        { name: 'curr', nodeId: curr },
        { name: 'next_', nodeId: nextId },
      ],
      7,
      'prev = curr',
    )
    curr = nextId
    snap(
      curEdges,
      head,
      [
        { name: 'prev', nodeId: prev },
        { name: 'curr', nodeId: curr },
      ],
      8,
      'curr = next_',
    )
  }

  head = prev
  snap(
    curEdges,
    head,
    [{ name: 'prev', nodeId: prev }],
    9,
    `Return prev — new head`,
  )
  return steps
}

export const reverseList: LinkedListAlgorithm = {
  id: 'll-reverse',
  name: 'Reverse',
  category: 'Data Structures',
  complexity: { time: 'O(n)', space: 'O(1)' },
  description:
    'Reverse the direction of every next pointer in one pass, using three pointers (prev / curr / next).',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
