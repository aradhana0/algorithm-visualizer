import type { BacktrackingSetAlgorithm, BacktrackingSetStep } from '../../types'

const PSEUDO = `procedure permutations(nums):
    result ← empty list
    used   ← array of length(nums) FALSEs
    function bt(cur):
        if length(cur) = length(nums):
            append copy of cur to result
            return
        for i ← 0 to length(nums) - 1:
            if used[i]: continue
            used[i] ← TRUE
            append nums[i] to cur
            bt(cur)
            remove last of cur                // backtrack
            used[i] ← FALSE
    bt(empty list)
    return result`

const CODE = `def permutations(nums):
    result = []
    used = [False] * len(nums)
    def bt(cur):
        if len(cur) == len(nums):
            result.append(cur[:])
            return
        for i in range(len(nums)):
            if used[i]: continue
            used[i] = True
            cur.append(nums[i])
            bt(cur)
            cur.pop()
            used[i] = False
    bt([])
    return result`

const NUMS = [1, 2, 3]

function generate(): BacktrackingSetStep[] {
  const steps: BacktrackingSetStep[] = []
  const results: number[][] = []
  const cur: number[] = []
  const used: boolean[] = Array(NUMS.length).fill(false)
  const callStack: string[] = []

  const snap = (line: number, message: string, extra: Partial<BacktrackingSetStep> = {}) => {
    steps.push({
      candidates: NUMS,
      current: [...cur],
      results: results.map((r) => [...r]),
      used: [...used],
      callStack: [...callStack],
      line,
      message,
      ...extra,
    })
  }

  snap(4, `Generate permutations of [${NUMS.join(', ')}]`)

  function bt() {
    callStack.push(`bt(cur=[${cur.join(',')}])`)
    snap(4, `Enter bt`, {})
    if (cur.length === NUMS.length) {
      results.push([...cur])
      snap(6, `Record permutation [${cur.join(', ')}]`, { action: 'record' })
      callStack.pop()
      return
    }
    for (let i = 0; i < NUMS.length; i++) {
      if (used[i]) {
        snap(9, `Skip nums[${i}]=${NUMS[i]} (already used)`, { activeIndex: i })
        continue
      }
      used[i] = true
      cur.push(NUMS[i])
      snap(11, `Try nums[${i}]=${NUMS[i]}`, { activeIndex: i, action: 'push' })
      bt()
      cur.pop()
      used[i] = false
      snap(14, `Backtrack — pop nums[${i}]`, { activeIndex: i, action: 'pop' })
    }
    callStack.pop()
  }

  bt()
  snap(15, `Done — ${results.length} permutations total`)
  return steps
}

export const permutationsAlgorithm: BacktrackingSetAlgorithm = {
  id: 'permutations',
  name: 'Permutations',
  category: 'Backtracking',
  complexity: { time: 'O(n·n!)', space: 'O(n)' },
  description:
    'Generate all n! permutations. Try each unused element at the current position and recurse; backtrack by removing it.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
