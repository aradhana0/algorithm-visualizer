import type { SegTreeAlgorithm, SegTreeNode, SegTreeStep } from '../../types'

const PSEUDO = `class SegTree:  // range-sum

    procedure init(arr):
        n ← length(arr)
        t ← array of 4·n zeros
        build(arr, 1, 0, n - 1)

    procedure build(arr, node, l, r):
        if l = r:
            t[node] ← arr[l]; return
        m ← ⌊(l + r) / 2⌋
        build(arr, 2·node,     l,     m)
        build(arr, 2·node + 1, m + 1, r)
        t[node] ← t[2·node] + t[2·node + 1]

    procedure query(node, l, r, ql, qr):
        if qr < l or r < ql:   return 0            // disjoint
        if ql ≤ l and r ≤ qr: return t[node]      // fully inside
        m ← ⌊(l + r) / 2⌋
        return query(2·node,     l,     m, ql, qr)
             + query(2·node + 1, m + 1, r, ql, qr)

    procedure update(node, l, r, i, val):
        if l = r:
            t[node] ← val; return
        m ← ⌊(l + r) / 2⌋
        if i ≤ m: update(2·node,     l,     m, i, val)
        else:     update(2·node + 1, m + 1, r, i, val)
        t[node] ← t[2·node] + t[2·node + 1]`

const CODE = `class SegTree:
    def __init__(self, arr):
        n = len(arr)
        self.n = n
        self.t = [0] * (4 * n)
        self._build(arr, 1, 0, n - 1)

    def _build(self, arr, node, l, r):
        if l == r:
            self.t[node] = arr[l]; return
        m = (l + r) // 2
        self._build(arr, 2*node,   l,     m)
        self._build(arr, 2*node+1, m + 1, r)
        self.t[node] = self.t[2*node] + self.t[2*node+1]

    def query(self, node, l, r, ql, qr):
        if qr < l or r < ql:  return 0
        if ql <= l and r <= qr: return self.t[node]
        m = (l + r) // 2
        return self.query(2*node,   l,     m, ql, qr) \\
             + self.query(2*node+1, m + 1, r, ql, qr)

    def update(self, node, l, r, i, val):
        if l == r:
            self.t[node] = val; return
        m = (l + r) // 2
        if i <= m: self.update(2*node,   l,     m, i, val)
        else:      self.update(2*node+1, m + 1, r, i, val)
        self.t[node] = self.t[2*node] + self.t[2*node+1]`

const INITIAL = [2, 5, 1, 4, 9, 3, 7, 6]

type OP =
  | { op: 'query'; l: number; r: number }
  | { op: 'update'; i: number; val: number }

const OPS: OP[] = [
  { op: 'query', l: 1, r: 5 },
  { op: 'update', i: 3, val: 10 },
  { op: 'query', l: 1, r: 5 },
  { op: 'query', l: 0, r: 7 },
]

function generate(): SegTreeStep[] {
  const steps: SegTreeStep[] = []
  const arr = [...INITIAL]
  const n = arr.length
  const nodes: SegTreeNode[] = []
  let nextId = 1

  function build(l: number, r: number): SegTreeNode {
    const id = `s${nextId++}`
    if (l === r) {
      const n0: SegTreeNode = { id, l, r, value: arr[l], left: null, right: null }
      nodes.push(n0)
      return n0
    }
    const m = Math.floor((l + r) / 2)
    const leftN = build(l, m)
    const rightN = build(m + 1, r)
    const node: SegTreeNode = {
      id,
      l,
      r,
      value: leftN.value + rightN.value,
      left: leftN.id,
      right: rightN.id,
    }
    nodes.push(node)
    return node
  }
  const rootNode = build(0, n - 1)
  const root = rootNode.id

  const snap = (line: number, message: string, extra: Partial<SegTreeStep> = {}) => {
    steps.push({
      array: [...arr],
      nodes: nodes.map((x) => ({ ...x })),
      root,
      line,
      message,
      ...extra,
    })
  }

  snap(6, `Built segment tree for arr = [${arr.join(', ')}]`)

  const byId = (id: string) => nodes.find((x) => x.id === id)!

  function queryStep(id: string, ql: number, qr: number, path: string[]): number {
    const n0 = byId(id)
    snap(18, `Visit node ${n0.id} covering [${n0.l}..${n0.r}]`, {
      operation: 'query',
      queryRange: [ql, qr],
      activeNodes: [...path, id],
    })
    if (qr < n0.l || n0.r < ql) {
      snap(19, `Disjoint from [${ql}..${qr}] → 0`, {
        operation: 'query',
        queryRange: [ql, qr],
        activeNodes: [...path, id],
      })
      return 0
    }
    if (ql <= n0.l && n0.r <= qr) {
      snap(20, `Fully inside [${ql}..${qr}] → return ${n0.value}`, {
        operation: 'query',
        queryRange: [ql, qr],
        activeNodes: [...path, id],
      })
      return n0.value
    }
    const l = queryStep(n0.left!, ql, qr, [...path, id])
    const r = queryStep(n0.right!, ql, qr, [...path, id])
    return l + r
  }

  function updateStep(id: string, i: number, val: number, path: string[]): void {
    const n0 = byId(id)
    snap(25, `Visit node ${n0.id} covering [${n0.l}..${n0.r}]`, {
      operation: 'update',
      updateIndex: i,
      updateValue: val,
      activeNodes: [...path, id],
    })
    if (n0.l === n0.r) {
      n0.value = val
      arr[i] = val
      snap(27, `Leaf — set arr[${i}] = ${val}`, {
        operation: 'update',
        updateIndex: i,
        updateValue: val,
        activeNodes: [...path, id],
        updatedNodes: [id],
      })
      return
    }
    const m = Math.floor((n0.l + n0.r) / 2)
    if (i <= m) updateStep(n0.left!, i, val, [...path, id])
    else updateStep(n0.right!, i, val, [...path, id])
    const before = n0.value
    n0.value = byId(n0.left!).value + byId(n0.right!).value
    snap(30, `Recompute ${n0.id} = left + right = ${n0.value} (was ${before})`, {
      operation: 'update',
      updateIndex: i,
      updateValue: val,
      activeNodes: [...path, id],
      updatedNodes: [id],
    })
  }

  for (const op of OPS) {
    if (op.op === 'query') {
      snap(15, `query([${op.l}..${op.r}])`, {
        operation: 'query',
        queryRange: [op.l, op.r],
      })
      const res = queryStep(root, op.l, op.r, [])
      snap(15, `query([${op.l}..${op.r}]) = ${res}`, {
        operation: 'query',
        queryRange: [op.l, op.r],
        queryResult: res,
      })
    } else {
      snap(23, `update(i=${op.i}, val=${op.val})`, {
        operation: 'update',
        updateIndex: op.i,
        updateValue: op.val,
      })
      updateStep(root, op.i, op.val, [])
    }
  }

  return steps
}

export const segTreeAlgorithm: SegTreeAlgorithm = {
  id: 'segtree',
  name: 'Segment Tree (sum)',
  kind: 'segtree',
  complexity: { time: 'O(log n) query/update, O(n) build', space: 'O(n)' },
  description:
    'Range-sum data structure. Each internal node stores the sum of a segment; queries and point updates walk O(log n) nodes.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
