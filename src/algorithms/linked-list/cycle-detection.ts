import type { LLEdge, LinkedListAlgorithm, LinkedListStep } from '../../types'

const PSEUDO = `procedure hasCycle(head):        // Floyd's tortoise & hare
    slow ← head
    fast ← head
    while fast ≠ NIL and fast.next ≠ NIL:
        slow ← slow.next               // 1 step
        fast ← fast.next.next          // 2 steps
        if slow = fast:                 // they meet ⇒ cycle
            return TRUE
    return FALSE`

const CODE = `def has_cycle(head):
    slow = head
    fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False`

// 6 nodes, last one loops back to index 2 → cycle exists
const VALUES = [10, 22, 7, 45, 3, 18]
const CYCLE_TO = 2

function generate(): LinkedListStep[] {
  const nodes = VALUES.map((v, i) => ({ id: `n${i}`, value: v }))
  const edges: LLEdge[] = nodes.map((n, i) => ({
    from: n.id,
    to: i < nodes.length - 1 ? nodes[i + 1].id : nodes[CYCLE_TO].id,
  }))
  const list = { head: nodes[0].id, nodes, edges }
  const steps: LinkedListStep[] = []

  const nextOf = (id: string | null): string | null => {
    if (!id) return null
    const e = edges.find((x) => x.from === id)
    return e ? e.to : null
  }

  steps.push({ lists: [list], pointers: [], line: 1, message: 'Start (list has a cycle at index 2)' })
  let slow: string | null = nodes[0].id
  let fast: string | null = nodes[0].id
  steps.push({
    lists: [list],
    pointers: [
      { name: 'slow', nodeId: slow },
      { name: 'fast', nodeId: fast },
    ],
    line: 3,
    message: 'slow = head, fast = head',
  })

  for (let iter = 0; iter < 40; iter++) {
    // Guard against runaway loops in the visualizer
    if (fast === null || nextOf(fast) === null) {
      steps.push({
        lists: [list],
        pointers: [
          { name: 'slow', nodeId: slow },
          { name: 'fast', nodeId: fast },
        ],
        line: 4,
        message: 'fast reached end — no cycle',
      })
      steps.push({
        lists: [list],
        pointers: [],
        line: 9,
        message: 'return False',
      })
      return steps
    }
    steps.push({
      lists: [list],
      pointers: [
        { name: 'slow', nodeId: slow },
        { name: 'fast', nodeId: fast },
      ],
      line: 4,
      message: 'Loop: fast and fast.next are non-null',
    })
    slow = nextOf(slow)
    steps.push({
      lists: [list],
      pointers: [
        { name: 'slow', nodeId: slow },
        { name: 'fast', nodeId: fast },
      ],
      line: 5,
      message: 'slow = slow.next (1 step)',
    })
    fast = nextOf(nextOf(fast))
    steps.push({
      lists: [list],
      pointers: [
        { name: 'slow', nodeId: slow },
        { name: 'fast', nodeId: fast },
      ],
      line: 6,
      message: 'fast = fast.next.next (2 steps)',
    })
    if (slow === fast && slow !== null) {
      steps.push({
        lists: [list],
        pointers: [
          { name: 'slow', nodeId: slow },
          { name: 'fast', nodeId: fast },
        ],
        highlightNodes: slow ? [slow] : [],
        line: 7,
        message: 'slow is fast → cycle detected!',
      })
      steps.push({
        lists: [list],
        pointers: [
          { name: 'slow', nodeId: slow },
          { name: 'fast', nodeId: fast },
        ],
        highlightNodes: slow ? [slow] : [],
        line: 8,
        message: 'return True',
      })
      return steps
    }
  }
  return steps
}

export const cycleDetection: LinkedListAlgorithm = {
  id: 'll-cycle',
  name: 'Cycle Detection',
  category: 'Data Structures',
  complexity: { time: 'O(n)', space: 'O(1)' },
  description:
    "Floyd's tortoise and hare: slow advances one step, fast advances two. If they ever meet, there is a cycle.",
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
