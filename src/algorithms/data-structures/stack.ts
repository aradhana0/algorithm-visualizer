import type { StackAlgorithm, StackStep } from '../../types'

const PSEUDO = `class Stack:
    field: items = empty list

    procedure push(x):
        append x to items

    procedure pop():
        if items is empty:
            raise error "pop from empty stack"
        return remove last of items

    procedure peek():
        return items[last] if items non-empty else NIL`

const CODE = `class Stack:
    def __init__(self):
        self.items = []

    def push(self, x):
        self.items.append(x)

    def pop(self):
        if not self.items:
            raise IndexError("pop from empty stack")
        return self.items.pop()

    def peek(self):
        return self.items[-1] if self.items else None`

const SCRIPT: Array<
  | { op: 'push'; v: number }
  | { op: 'pop' }
  | { op: 'peek' }
> = [
  { op: 'push', v: 5 },
  { op: 'push', v: 12 },
  { op: 'push', v: 7 },
  { op: 'peek' },
  { op: 'pop' },
  { op: 'push', v: 20 },
  { op: 'push', v: 3 },
  { op: 'pop' },
  { op: 'pop' },
  { op: 'peek' },
]

function generate(): StackStep[] {
  const stack: number[] = []
  const steps: StackStep[] = []
  steps.push({ stack: [...stack], line: 3, message: 'Empty stack' })
  for (const cmd of SCRIPT) {
    if (cmd.op === 'push') {
      steps.push({
        stack: [...stack],
        operation: 'push',
        operand: cmd.v,
        line: 5,
        message: `Call push(${cmd.v})`,
      })
      stack.push(cmd.v)
      steps.push({
        stack: [...stack],
        operation: 'push',
        operand: cmd.v,
        highlightIdx: stack.length - 1,
        line: 6,
        message: `items.append(${cmd.v})`,
      })
    } else if (cmd.op === 'pop') {
      const top = stack[stack.length - 1]
      steps.push({
        stack: [...stack],
        operation: 'pop',
        highlightIdx: stack.length - 1,
        line: 8,
        message: 'Call pop()',
      })
      if (stack.length === 0) {
        steps.push({
          stack: [...stack],
          operation: 'pop',
          line: 10,
          message: 'Empty — raise IndexError',
        })
        continue
      }
      steps.push({
        stack: [...stack],
        operation: 'pop',
        highlightIdx: stack.length - 1,
        line: 11,
        message: `items.pop() → ${top}`,
      })
      stack.pop()
      steps.push({
        stack: [...stack],
        operation: 'pop',
        operand: top,
        line: 11,
        message: `Returned ${top}`,
      })
    } else if (cmd.op === 'peek') {
      const top = stack.length > 0 ? stack[stack.length - 1] : null
      steps.push({
        stack: [...stack],
        operation: 'peek',
        highlightIdx: stack.length > 0 ? stack.length - 1 : undefined,
        line: 13,
        message: top === null ? 'peek() → None (empty)' : `peek() → ${top}`,
      })
    }
  }
  return steps
}

export const stackAlgorithm: StackAlgorithm = {
  id: 'stack-basic',
  name: 'Stack (LIFO)',
  kind: 'stack',
  complexity: { time: 'O(1) push/pop/peek', space: 'O(n)' },
  description:
    'Last-in-first-out container. push adds to the top, pop removes from the top. Backed here by a Python list.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
