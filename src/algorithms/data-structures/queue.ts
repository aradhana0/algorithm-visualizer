import type { QueueAlgorithm, QueueStep } from '../../types'

const PSEUDO = `// backed by a deque for O(1) at both ends

class Queue:
    field: items = empty deque

    procedure enqueue(x):
        append x to back of items

    procedure dequeue():
        if items is empty:
            raise error "dequeue from empty queue"
        return remove first of items

    procedure peek():
        return items[first] if items non-empty else NIL`

const CODE = `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, x):
        self.items.append(x)

    def dequeue(self):
        if not self.items:
            raise IndexError("dequeue from empty queue")
        return self.items.popleft()

    def peek(self):
        return self.items[0] if self.items else None`

const SCRIPT: Array<
  | { op: 'enqueue'; v: number }
  | { op: 'dequeue' }
  | { op: 'peek' }
> = [
  { op: 'enqueue', v: 5 },
  { op: 'enqueue', v: 12 },
  { op: 'enqueue', v: 7 },
  { op: 'dequeue' },
  { op: 'peek' },
  { op: 'enqueue', v: 20 },
  { op: 'enqueue', v: 3 },
  { op: 'dequeue' },
  { op: 'dequeue' },
  { op: 'peek' },
]

function generate(): QueueStep[] {
  const q: number[] = []
  const steps: QueueStep[] = []
  steps.push({ queue: [...q], line: 5, message: 'Empty queue' })
  for (const cmd of SCRIPT) {
    if (cmd.op === 'enqueue') {
      steps.push({
        queue: [...q],
        operation: 'enqueue',
        operand: cmd.v,
        line: 7,
        message: `Call enqueue(${cmd.v})`,
      })
      q.push(cmd.v)
      steps.push({
        queue: [...q],
        operation: 'enqueue',
        operand: cmd.v,
        highlightIdx: q.length - 1,
        line: 8,
        message: `items.append(${cmd.v}) — added at back`,
      })
    } else if (cmd.op === 'dequeue') {
      steps.push({
        queue: [...q],
        operation: 'dequeue',
        highlightIdx: 0,
        line: 10,
        message: 'Call dequeue()',
      })
      if (q.length === 0) {
        steps.push({
          queue: [...q],
          operation: 'dequeue',
          line: 12,
          message: 'Empty — raise IndexError',
        })
        continue
      }
      const front = q[0]
      steps.push({
        queue: [...q],
        operation: 'dequeue',
        highlightIdx: 0,
        line: 13,
        message: `popleft() → ${front} (from front)`,
      })
      q.shift()
      steps.push({
        queue: [...q],
        operation: 'dequeue',
        operand: front,
        line: 13,
        message: `Returned ${front}`,
      })
    } else if (cmd.op === 'peek') {
      const front = q.length > 0 ? q[0] : null
      steps.push({
        queue: [...q],
        operation: 'peek',
        highlightIdx: q.length > 0 ? 0 : undefined,
        line: 15,
        message: front === null ? 'peek() → None (empty)' : `peek() → ${front} (front)`,
      })
    }
  }
  return steps
}

export const queueAlgorithm: QueueAlgorithm = {
  id: 'queue-basic',
  name: 'Queue (FIFO)',
  kind: 'queue',
  complexity: { time: 'O(1) enqueue/dequeue', space: 'O(n)' },
  description:
    'First-in-first-out container. enqueue adds at the back, dequeue removes from the front. Backed by a deque for O(1) both ends.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
