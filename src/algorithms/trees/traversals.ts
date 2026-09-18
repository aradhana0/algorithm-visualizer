import type { BinaryTreeNode, TreeAlgorithm, TreeStep } from '../../types'

// A fixed BST to traverse
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
  return { nodes, root: `n50` }
}

// ---- In-order ----

const INORDER_PSEUDO = `procedure inorder(node):
    if node = NIL:
        return
    inorder(node.left)
    visit(node)
    inorder(node.right)`

const INORDER_CODE = `def inorder(node):
    if node is None:
        return
    inorder(node.left)
    visit(node)
    inorder(node.right)`

function generateInorder(): TreeStep[] {
  const { nodes, root } = buildTree()
  const steps: TreeStep[] = []
  const visited: string[] = []
  const order: number[] = []
  const stack: string[] = []
  const byId = (id: string) => nodes.find((n) => n.id === id)!

  const snap = (line: number, message: string, extra: Partial<TreeStep> = {}) => {
    steps.push({
      nodes: nodes.map((n) => ({ ...n })),
      root,
      visitedNodes: [...visited],
      traversalOrder: [...order],
      callStack: [...stack],
      line,
      message,
      ...extra,
    })
  }

  snap(1, 'Start in-order traversal at root')

  function walk(id: string | null) {
    if (id === null) {
      snap(2, 'node is None → return', {})
      return
    }
    const node = byId(id)
    stack.push(`inorder(${node.value})`)
    snap(1, `Enter inorder(${node.value})`, { currentNode: id })
    walk(node.left)
    visited.push(id)
    order.push(node.value as number)
    snap(4, `visit(${node.value})  → order: [${order.join(', ')}]`, {
      currentNode: id,
      highlightNodes: [id],
    })
    walk(node.right)
    stack.pop()
    snap(5, `Return from inorder(${node.value})`, { currentNode: id })
  }
  walk(root)
  snap(1, `Done — order: [${order.join(', ')}]`)
  return steps
}

// ---- Pre-order ----

const PREORDER_PSEUDO = `procedure preorder(node):
    if node = NIL:
        return
    visit(node)
    preorder(node.left)
    preorder(node.right)`

const PREORDER_CODE = `def preorder(node):
    if node is None:
        return
    visit(node)
    preorder(node.left)
    preorder(node.right)`

function generatePreorder(): TreeStep[] {
  const { nodes, root } = buildTree()
  const steps: TreeStep[] = []
  const visited: string[] = []
  const order: number[] = []
  const stack: string[] = []
  const byId = (id: string) => nodes.find((n) => n.id === id)!

  const snap = (line: number, message: string, extra: Partial<TreeStep> = {}) => {
    steps.push({
      nodes: nodes.map((n) => ({ ...n })),
      root,
      visitedNodes: [...visited],
      traversalOrder: [...order],
      callStack: [...stack],
      line,
      message,
      ...extra,
    })
  }

  snap(1, 'Start pre-order traversal at root')

  function walk(id: string | null) {
    if (id === null) {
      snap(2, 'node is None → return', {})
      return
    }
    const node = byId(id)
    stack.push(`preorder(${node.value})`)
    snap(1, `Enter preorder(${node.value})`, { currentNode: id })
    visited.push(id)
    order.push(node.value as number)
    snap(3, `visit(${node.value})  → order: [${order.join(', ')}]`, {
      currentNode: id,
      highlightNodes: [id],
    })
    walk(node.left)
    walk(node.right)
    stack.pop()
    snap(5, `Return from preorder(${node.value})`, { currentNode: id })
  }
  walk(root)
  snap(1, `Done — order: [${order.join(', ')}]`)
  return steps
}

// ---- Post-order ----

const POSTORDER_PSEUDO = `procedure postorder(node):
    if node = NIL:
        return
    postorder(node.left)
    postorder(node.right)
    visit(node)`

const POSTORDER_CODE = `def postorder(node):
    if node is None:
        return
    postorder(node.left)
    postorder(node.right)
    visit(node)`

function generatePostorder(): TreeStep[] {
  const { nodes, root } = buildTree()
  const steps: TreeStep[] = []
  const visited: string[] = []
  const order: number[] = []
  const stack: string[] = []
  const byId = (id: string) => nodes.find((n) => n.id === id)!

  const snap = (line: number, message: string, extra: Partial<TreeStep> = {}) => {
    steps.push({
      nodes: nodes.map((n) => ({ ...n })),
      root,
      visitedNodes: [...visited],
      traversalOrder: [...order],
      callStack: [...stack],
      line,
      message,
      ...extra,
    })
  }

  snap(1, 'Start post-order traversal at root')

  function walk(id: string | null) {
    if (id === null) {
      snap(2, 'node is None → return', {})
      return
    }
    const node = byId(id)
    stack.push(`postorder(${node.value})`)
    snap(1, `Enter postorder(${node.value})`, { currentNode: id })
    walk(node.left)
    walk(node.right)
    visited.push(id)
    order.push(node.value as number)
    snap(5, `visit(${node.value})  → order: [${order.join(', ')}]`, {
      currentNode: id,
      highlightNodes: [id],
    })
    stack.pop()
    snap(5, `Return from postorder(${node.value})`, { currentNode: id })
  }
  walk(root)
  snap(1, `Done — order: [${order.join(', ')}]`)
  return steps
}

// ---- Level-order (BFS) ----

const LEVELORDER_PSEUDO = `procedure levelOrder(root):
    // BFS on the tree, using a FIFO queue
    if root = NIL:
        return
    queue ← [root]
    while queue is not empty:
        node ← dequeue(queue)
        visit(node)
        if node.left  ≠ NIL: enqueue(queue, node.left)
        if node.right ≠ NIL: enqueue(queue, node.right)`

const LEVELORDER_CODE = `from collections import deque

def level_order(root):
    if root is None:
        return
    q = deque([root])
    while q:
        node = q.popleft()
        visit(node)
        if node.left:  q.append(node.left)
        if node.right: q.append(node.right)`

function generateLevelorder(): TreeStep[] {
  const { nodes, root } = buildTree()
  const steps: TreeStep[] = []
  const visited: string[] = []
  const order: number[] = []
  const q: string[] = []
  const byId = (id: string) => nodes.find((n) => n.id === id)!

  const snap = (line: number, message: string, extra: Partial<TreeStep> = {}) => {
    steps.push({
      nodes: nodes.map((n) => ({ ...n })),
      root,
      visitedNodes: [...visited],
      traversalOrder: [...order],
      callStack: q.map((id) => `q: ${byId(id).value}`),
      line,
      message,
      ...extra,
    })
  }

  snap(3, 'Start level-order traversal at root')
  q.push(root)
  snap(5, `q = [${byId(root).value}]`)
  while (q.length > 0) {
    snap(6, 'Loop: q not empty')
    const cur = q.shift()!
    const curNode = byId(cur)
    snap(7, `node = q.popleft() → ${curNode.value}`, { currentNode: cur })
    visited.push(cur)
    order.push(curNode.value as number)
    snap(8, `visit(${curNode.value})  → order: [${order.join(', ')}]`, {
      currentNode: cur,
      highlightNodes: [cur],
    })
    if (curNode.left) {
      q.push(curNode.left)
      snap(9, `q.append(${byId(curNode.left).value})`)
    }
    if (curNode.right) {
      q.push(curNode.right)
      snap(10, `q.append(${byId(curNode.right).value})`)
    }
  }
  snap(6, `Done — order: [${order.join(', ')}]`)
  return steps
}

export const inorderTraversal: TreeAlgorithm = {
  id: 'inorder',
  name: 'In-order Traversal',
  category: 'Trees',
  complexity: { time: 'O(n)', space: 'O(h)' },
  description: 'Left → Node → Right. On a BST this yields values in sorted order.',
  code: INORDER_CODE,
  pseudocode: INORDER_PSEUDO,
  generate: generateInorder,
}

export const preorderTraversal: TreeAlgorithm = {
  id: 'preorder',
  name: 'Pre-order Traversal',
  category: 'Trees',
  complexity: { time: 'O(n)', space: 'O(h)' },
  description: 'Node → Left → Right. Useful for cloning or serializing a tree.',
  code: PREORDER_CODE,
  pseudocode: PREORDER_PSEUDO,
  generate: generatePreorder,
}

export const postorderTraversal: TreeAlgorithm = {
  id: 'postorder',
  name: 'Post-order Traversal',
  category: 'Trees',
  complexity: { time: 'O(n)', space: 'O(h)' },
  description: 'Left → Right → Node. Useful for freeing nodes or evaluating expression trees.',
  code: POSTORDER_CODE,
  pseudocode: POSTORDER_PSEUDO,
  generate: generatePostorder,
}

export const levelorderTraversal: TreeAlgorithm = {
  id: 'levelorder',
  name: 'Level-order Traversal',
  category: 'Trees',
  complexity: { time: 'O(n)', space: 'O(w)' },
  description: 'BFS on the tree — visit all nodes at depth d before depth d+1.',
  code: LEVELORDER_CODE,
  pseudocode: LEVELORDER_PSEUDO,
  generate: generateLevelorder,
}
