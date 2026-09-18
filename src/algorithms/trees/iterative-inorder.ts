import type { BinaryTreeNode, TreeAlgorithm, TreeStep } from '../../types'

const PSEUDO = `procedure inorderIter(root):
    stack, order, cur ← empty, empty, root
    while cur ≠ NIL or stack is not empty:
        while cur ≠ NIL:
            push(stack, cur)
            cur ← cur.left
        cur ← pop(stack)
        append cur.value to order
        cur ← cur.right
    return order`

const CODE = `def inorder_iter(root):
    stack, order, cur = [], [], root
    while cur or stack:
        while cur:
            stack.append(cur)
            cur = cur.left
        cur = stack.pop()
        order.append(cur.value)
        cur = cur.right
    return order`

const TREE_VALUES: Array<[number, number | null, number | null]> = [
  [50, 30, 70],
  [30, 20, 40],
  [70, 60, 80],
  [20, null, null],
  [40, null, null],
  [60, null, null],
  [80, null, null],
]

function buildTree(): { nodes: BinaryTreeNode[]; root: string } {
  const nodes: BinaryTreeNode[] = TREE_VALUES.map(([v]) => ({
    id: `n${v}`,
    value: v,
    left: null,
    right: null,
  }))
  for (const [v, l, r] of TREE_VALUES) {
    const n = nodes.find((x) => x.value === v)!
    if (l !== null) n.left = `n${l}`
    if (r !== null) n.right = `n${r}`
  }
  return { nodes, root: 'n50' }
}

function generate(): TreeStep[] {
  const { nodes, root } = buildTree()
  const byId = (id: string) => nodes.find((n) => n.id === id)!
  const steps: TreeStep[] = []
  const stack: string[] = []
  const visited: string[] = []
  const order: number[] = []
  let cur: string | null = root

  const snap = (line: number, message: string, highlight?: string) => {
    steps.push({
      nodes: nodes.map((n) => ({ ...n })),
      root,
      currentNode: cur,
      visitedNodes: [...visited],
      traversalOrder: [...order],
      callStack: stack.map((id) => `stack: ${byId(id).value}`),
      highlightNodes: highlight ? [highlight] : [],
      line,
      message,
    })
  }

  snap(2, 'Start iterative in-order (explicit stack, no recursion)')

  while (cur !== null || stack.length > 0) {
    snap(3, 'Loop: cur or stack non-empty')
    while (cur !== null) {
      stack.push(cur)
      snap(5, `Push ${byId(cur).value} to stack, go left`)
      cur = byId(cur).left
    }
    cur = stack.pop()!
    visited.push(cur)
    order.push(byId(cur).value as number)
    snap(7, `Pop ${byId(cur).value} — visit → order: [${order.join(', ')}]`, cur)
    cur = byId(cur).right
    snap(8, `Move to right child`)
  }
  snap(9, `Done — order: [${order.join(', ')}]`)
  return steps
}

export const iterativeInorder: TreeAlgorithm = {
  id: 'iterative-inorder',
  name: 'Iterative In-order (stack)',
  category: 'Trees',
  complexity: { time: 'O(n)', space: 'O(h)' },
  description:
    'In-order traversal with an explicit stack instead of recursion. Push all leftmost nodes, pop-visit, then move to the right subtree.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
