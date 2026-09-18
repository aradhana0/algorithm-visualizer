import type { LLEdge, LLNode, LinkedListAlgorithm, LinkedListStep } from '../../types'

const PSEUDO = `procedure merge(a, b):        // two sorted lists → one sorted list
    dummy ← new Node(0)          // virtual head
    tail  ← dummy
    while a ≠ NIL and b ≠ NIL:
        if a.value ≤ b.value:
            tail.next ← a
            a ← a.next
        else:
            tail.next ← b
            b ← b.next
        tail ← tail.next
    tail.next ← (a if a ≠ NIL else b)   // append remainder
    return dummy.next`

const CODE = `def merge(a, b):
    dummy = Node(0)
    tail = dummy
    while a and b:
        if a.value <= b.value:
            tail.next = a
            a = a.next
        else:
            tail.next = b
            b = b.next
        tail = tail.next
    tail.next = a if a else b
    return dummy.next`

const LIST_A = [1, 4, 7, 12]
const LIST_B = [2, 3, 8, 11, 15]

function generate(): LinkedListStep[] {
  const aNodes = LIST_A.map((v, i) => ({ id: `a${i}`, value: v }))
  const bNodes = LIST_B.map((v, i) => ({ id: `b${i}`, value: v }))
  const aEdges: LLEdge[] = aNodes.map((n, i) => ({
    from: n.id,
    to: i < aNodes.length - 1 ? aNodes[i + 1].id : null,
  }))
  const bEdges: LLEdge[] = bNodes.map((n, i) => ({
    from: n.id,
    to: i < bNodes.length - 1 ? bNodes[i + 1].id : null,
  }))

  // Merged uses fresh, cloned nodes with their own id namespace
  const mergedNodes: LLNode[] = []
  const mergedEdges: LLEdge[] = []

  const steps: LinkedListStep[] = []

  const snap = (
    aHead: string | null,
    bHead: string | null,
    pointers: LinkedListStep['pointers'],
    line: number,
    message: string,
    highlight: string[] = [],
  ) => {
    steps.push({
      lists: [
        { label: 'list a', head: aHead, nodes: aNodes, edges: aEdges },
        { label: 'list b', head: bHead, nodes: bNodes, edges: bEdges },
        {
          label: 'merged',
          head: mergedNodes.length ? mergedNodes[0].id : null,
          nodes: [...mergedNodes],
          edges: [...mergedEdges],
        },
      ],
      pointers,
      highlightNodes: highlight,
      line,
      message,
    })
  }

  const appendMerged = (source: LLNode) => {
    const clone: LLNode = { id: `m${mergedNodes.length}`, value: source.value }
    if (mergedNodes.length > 0) {
      // Drop previous tail's null-terminator if any
      const prevTailId = mergedNodes[mergedNodes.length - 1].id
      const idx = mergedEdges.findIndex((e) => e.from === prevTailId)
      if (idx >= 0) mergedEdges.splice(idx, 1)
      mergedEdges.push({ from: prevTailId, to: clone.id })
    }
    mergedNodes.push(clone)
    mergedEdges.push({ from: clone.id, to: null })
    return clone
  }

  let a: string | null = aNodes[0].id
  let b: string | null = bNodes[0].id
  snap(a, b, [], 1, 'Start with two sorted lists')

  const withPointer = (name: string, id: string | null, listIndex: number) => ({
    name,
    nodeId: id,
    listIndex,
  })

  snap(a, b, [], 2, 'dummy = Node(0)  (virtual head)')
  snap(a, b, [], 3, 'tail = dummy')

  const nextOfA = (id: string | null) => (id ? (aEdges.find((e) => e.from === id)?.to ?? null) : null)
  const nextOfB = (id: string | null) => (id ? (bEdges.find((e) => e.from === id)?.to ?? null) : null)
  const nodeById = (id: string, arr: LLNode[]) => arr.find((n) => n.id === id)!

  while (a !== null && b !== null) {
    snap(
      a,
      b,
      [withPointer('a', a, 0), withPointer('b', b, 1)],
      4,
      'Loop: both a and b are non-null',
    )
    const va = nodeById(a, aNodes).value as number
    const vb = nodeById(b, bNodes).value as number
    if (va <= vb) {
      snap(a, b, [withPointer('a', a, 0), withPointer('b', b, 1)], 5, `${va} <= ${vb}`)
      const chosen = appendMerged(nodeById(a, aNodes))
      snap(
        a,
        b,
        [withPointer('a', a, 0), withPointer('b', b, 1)],
        6,
        `tail.next = a  (take ${va})`,
        [chosen.id],
      )
      a = nextOfA(a)
      snap(a, b, [withPointer('a', a, 0), withPointer('b', b, 1)], 7, 'a = a.next')
    } else {
      snap(a, b, [withPointer('a', a, 0), withPointer('b', b, 1)], 8, `${va} > ${vb} → else`)
      const chosen = appendMerged(nodeById(b, bNodes))
      snap(
        a,
        b,
        [withPointer('a', a, 0), withPointer('b', b, 1)],
        9,
        `tail.next = b  (take ${vb})`,
        [chosen.id],
      )
      b = nextOfB(b)
      snap(a, b, [withPointer('a', a, 0), withPointer('b', b, 1)], 10, 'b = b.next')
    }
    snap(a, b, [withPointer('a', a, 0), withPointer('b', b, 1)], 11, 'tail = tail.next')
  }

  // Append remainder
  let remainder = a !== null ? a : b
  const fromA = a !== null
  while (remainder !== null) {
    const src = fromA ? nodeById(remainder, aNodes) : nodeById(remainder, bNodes)
    appendMerged(src)
    remainder = fromA ? nextOfA(remainder) : nextOfB(remainder)
  }
  a = null
  b = null
  snap(a, b, [], 12, 'Append the remaining tail')
  snap(a, b, [], 13, 'Return dummy.next  →  merged head')
  return steps
}

export const mergeSortedLists: LinkedListAlgorithm = {
  id: 'll-merge',
  name: 'Merge Two Sorted Lists',
  category: 'Data Structures',
  complexity: { time: 'O(n + m)', space: 'O(1)' },
  description:
    'Walk both lists with two pointers, always appending the smaller current node to a growing merged chain.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
