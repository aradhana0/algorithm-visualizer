import type { BacktrackingSetAlgorithm, BacktrackingSetStep } from '../../types'

const PSEUDO = `procedure combinations(n, k):
    result ← empty list
    function bt(start, cur):
        if length(cur) = k:
            append copy of cur to result
            return
        for i ← start to n:
            append i to cur
            bt(i + 1, cur)
            remove last of cur                // backtrack
    bt(1, empty list)
    return result`

const CODE = `def combinations(n, k):
    result = []
    def bt(start, cur):
        if len(cur) == k:
            result.append(cur[:])
            return
        for i in range(start, n + 1):
            cur.append(i)
            bt(i + 1, cur)
            cur.pop()
    bt(1, [])
    return result`

const N = 4
const K = 2

function generate(): BacktrackingSetStep[] {
  const steps: BacktrackingSetStep[] = []
  const candidates = Array.from({ length: N }, (_, i) => i + 1)
  const results: number[][] = []
  const cur: number[] = []
  const callStack: string[] = []

  const snap = (line: number, message: string, extra: Partial<BacktrackingSetStep> = {}) => {
    steps.push({
      candidates,
      current: [...cur],
      results: results.map((r) => [...r]),
      callStack: [...callStack],
      line,
      message,
      ...extra,
    })
  }

  snap(3, `Combinations C(${N}, ${K})`)

  function bt(start: number) {
    callStack.push(`bt(start=${start}, cur=[${cur.join(',')}])`)
    snap(3, `Enter bt(start=${start})`)
    if (cur.length === K) {
      results.push([...cur])
      snap(5, `Record combo [${cur.join(', ')}]`, { action: 'record' })
      callStack.pop()
      return
    }
    for (let i = start; i <= N; i++) {
      cur.push(i)
      snap(8, `Try i=${i}, cur=[${cur.join(', ')}]`, {
        activeIndex: i - 1,
        action: 'push',
      })
      bt(i + 1)
      cur.pop()
      snap(10, `Backtrack — pop ${i}`, { activeIndex: i - 1, action: 'pop' })
    }
    callStack.pop()
  }

  bt(1)
  snap(11, `Done — ${results.length} combinations total`)
  return steps
}

export const combinationsAlgorithm: BacktrackingSetAlgorithm = {
  id: 'combinations',
  name: 'Combinations',
  category: 'Backtracking',
  complexity: { time: 'O(C(n,k)·k)', space: 'O(k)' },
  description:
    'All C(n, k) combinations of choosing k elements from 1…n. Advance start to enforce ascending order and avoid duplicates.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
