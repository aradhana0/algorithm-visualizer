import type { BinaryTreeNode, TreeAlgorithm, TreeStep } from '../../types'

const PSEUDO = `class Node:
    fields: v, left, right


procedure insert(root, v):
    if root = NIL:
        return new Node(v)
    if v < root.v:
        root.left  ← insert(root.left,  v)
    else:
        root.right ← insert(root.right, v)
    return root

procedure search(root, target):
    if root = NIL:
        return FALSE
    if root.v = target:
        return TRUE
    if target < root.v:
        return search(root.left,  target)
    return search(root.right, target)`

const CODE = `class Node:
    def __init__(self, v):
        self.v, self.left, self.right = v, None, None

def insert(root, v):
    if root is None:
        return Node(v)
    if v < root.v:
        root.left = insert(root.left, v)
    else:
        root.right = insert(root.right, v)
    return root

def search(root, target):
    if root is None:
        return False
    if root.v == target:
        return True
    if target < root.v:
        return search(root.left, target)
    return search(root.right, target)`

const INSERT_SEQ = [50, 30, 70, 20, 40, 60, 80, 35, 45]
const SEARCH_TARGET = 45

function newNode(v: number): BinaryTreeNode {
  return { id: `n${v}`, value: v, left: null, right: null }
}

function generate(): TreeStep[] {
  const steps: TreeStep[] = []
  const nodes: BinaryTreeNode[] = []
  let root: string | null = null

  const nodeById = (id: string) => nodes.find((n) => n.id === id)!

  const snap = (line: number, message: string, extra: Partial<TreeStep> = {}) => {
    steps.push({
      nodes: nodes.map((n) => ({ ...n })),
      root,
      line,
      message,
      ...extra,
    })
  }

  snap(6, 'Empty tree')

  for (const v of INSERT_SEQ) {
    snap(6, `Call insert(root, ${v})`, { compareValue: v })
    if (root === null) {
      const n = newNode(v)
      nodes.push(n)
      root = n.id
      snap(8, `root is None → create Node(${v})`, {
        highlightNodes: [n.id],
        compareValue: v,
      })
      continue
    }
    // Walk down and place
    let curId: string | null = root
    const path: string[] = []
    while (curId !== null) {
      const cur = nodeById(curId)
      path.push(cur.id)
      snap(9, `Visit node ${cur.value}, compare ${v} < ${cur.value}?`, {
        currentNode: curId,
        path: [...path],
        compareValue: v,
      })
      if (v < (cur.value as number)) {
        if (cur.left === null) {
          const n = newNode(v)
          nodes.push(n)
          cur.left = n.id
          snap(10, `left is None → insert ${v} as left child of ${cur.value}`, {
            currentNode: curId,
            path: [...path, n.id],
            highlightNodes: [n.id],
            compareValue: v,
          })
          curId = null
        } else {
          curId = cur.left
        }
      } else {
        if (cur.right === null) {
          const n = newNode(v)
          nodes.push(n)
          cur.right = n.id
          snap(12, `right is None → insert ${v} as right child of ${cur.value}`, {
            currentNode: curId,
            path: [...path, n.id],
            highlightNodes: [n.id],
            compareValue: v,
          })
          curId = null
        } else {
          curId = cur.right
        }
      }
    }
  }

  // Now search
  snap(15, `Call search(root, ${SEARCH_TARGET})`, { compareValue: SEARCH_TARGET })
  const searchPath: string[] = []
  let cur: string | null = root
  while (cur !== null) {
    const node = nodeById(cur)
    searchPath.push(node.id)
    snap(18, `Compare ${SEARCH_TARGET} with ${node.value}`, {
      currentNode: cur,
      path: [...searchPath],
      compareValue: SEARCH_TARGET,
    })
    if (node.value === SEARCH_TARGET) {
      snap(19, `Match! return True`, {
        currentNode: cur,
        path: [...searchPath],
        highlightNodes: [cur],
        compareValue: SEARCH_TARGET,
      })
      return steps
    }
    if (SEARCH_TARGET < (node.value as number)) {
      snap(20, `${SEARCH_TARGET} < ${node.value} → go left`, {
        currentNode: cur,
        path: [...searchPath],
        compareValue: SEARCH_TARGET,
      })
      cur = node.left
    } else {
      snap(22, `${SEARCH_TARGET} > ${node.value} → go right`, {
        currentNode: cur,
        path: [...searchPath],
        compareValue: SEARCH_TARGET,
      })
      cur = node.right
    }
  }
  snap(17, 'Reached None → return False', { compareValue: SEARCH_TARGET })
  return steps
}

export const bstAlgorithm: TreeAlgorithm = {
  id: 'bst',
  name: 'Binary Search Tree',
  category: 'Trees',
  complexity: { time: 'O(log n) avg / O(n) worst', space: 'O(h)' },
  description:
    'Ordered tree where each node satisfies left.v < node.v ≤ right.v. Insert and search follow the ordering to reach the correct spot.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
