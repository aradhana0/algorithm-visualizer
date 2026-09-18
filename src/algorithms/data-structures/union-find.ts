import type { UnionFindAlgorithm, UnionFindStep } from '../../types'

const PSEUDO = `class UnionFind:
    fields: parent[0..n-1], rank[0..n-1]

    procedure init(n):
        parent ← [0, 1, ..., n - 1]
        rank   ← [0, 0, ..., 0]

    procedure find(x):
        while parent[x] ≠ x:
            parent[x] ← parent[parent[x]]   // path compression
            x ← parent[x]
        return x

    procedure union(a, b):
        ra, rb ← find(a), find(b)
        if ra = rb: return FALSE
        if rank[ra] < rank[rb]:
            swap ra, rb                      // union by rank
        parent[rb] ← ra
        if rank[ra] = rank[rb]:
            rank[ra] ← rank[ra] + 1
        return TRUE`

const CODE = `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]  # path compression
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb: return False
        if self.rank[ra] < self.rank[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        if self.rank[ra] == self.rank[rb]:
            self.rank[ra] += 1
        return True`

const N = 7
const OPERATIONS: Array<
  | { op: 'union'; a: number; b: number }
  | { op: 'find'; x: number }
> = [
  { op: 'union', a: 0, b: 1 },
  { op: 'union', a: 2, b: 3 },
  { op: 'union', a: 4, b: 5 },
  { op: 'union', a: 1, b: 3 },
  { op: 'union', a: 5, b: 6 },
  { op: 'find', x: 0 },
  { op: 'union', a: 0, b: 4 },
  { op: 'find', x: 6 },
]

function generate(): UnionFindStep[] {
  const steps: UnionFindStep[] = []
  const parent = Array.from({ length: N }, (_, i) => i)
  const rank: number[] = Array(N).fill(0)
  const opsLog: string[] = []

  const snap = (line: number, message: string, extra: Partial<UnionFindStep> = {}) => {
    steps.push({
      elements: Array.from({ length: N }, (_, i) => i),
      parent: Object.fromEntries(parent.map((p, i) => [String(i), String(p)])),
      rank: Object.fromEntries(rank.map((r, i) => [String(i), r])),
      operations: [...opsLog],
      line,
      message,
      ...extra,
    })
  }

  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]]
      x = parent[x]
    }
    return x
  }

  snap(3, `Init: parent = [0,1,...,${N - 1}]`)

  for (const op of OPERATIONS) {
    if (op.op === 'find') {
      snap(6, `find(${op.x})`, {
        activeElements: [String(op.x)],
        currentOp: 'find',
      })
      const r = find(op.x)
      opsLog.push(`find(${op.x}) → ${r}`)
      snap(10, `Root of ${op.x} is ${r}`, {
        activeElements: [String(op.x), String(r)],
        currentOp: 'find',
      })
    } else {
      snap(12, `union(${op.a}, ${op.b})`, {
        activeElements: [String(op.a), String(op.b)],
        currentOp: 'union',
      })
      let ra = find(op.a)
      let rb = find(op.b)
      snap(13, `find(${op.a})=${ra}, find(${op.b})=${rb}`, {
        activeElements: [String(op.a), String(op.b), String(ra), String(rb)],
        currentOp: 'union',
      })
      if (ra === rb) {
        opsLog.push(`union(${op.a}, ${op.b}) → already same set`)
        snap(14, 'Already in same set — skip', {
          activeElements: [String(op.a), String(op.b)],
          currentOp: 'union',
        })
        continue
      }
      if (rank[ra] < rank[rb]) {
        const tmp = ra
        ra = rb
        rb = tmp
      }
      parent[rb] = ra
      if (rank[ra] === rank[rb]) rank[ra]++
      opsLog.push(`union(${op.a}, ${op.b}) → merged (parent[${rb}] = ${ra})`)
      snap(16, `Union by rank: parent[${rb}] = ${ra}`, {
        activeElements: [String(ra), String(rb)],
        currentOp: 'union',
      })
    }
  }
  return steps
}

export const unionFindAlgorithm: UnionFindAlgorithm = {
  id: 'union-find',
  name: 'Union-Find (DSU)',
  kind: 'unionfind',
  complexity: { time: 'O(α(n))', space: 'O(n)' },
  description:
    'Disjoint-Set Union. Track connected components as a forest of parent pointers, with path compression on find and union-by-rank on union for near-constant amortized ops.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
