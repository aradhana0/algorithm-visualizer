import type { BacktrackingSetAlgorithm, BacktrackingSetStep } from '../../types'

const PSEUDO = `procedure subsets(nums):
    result ← empty list
    function bt(i, cur):
        if i = length(nums):
            append copy of cur to result
            return
        bt(i + 1, cur)                    // exclude nums[i]
        append nums[i] to cur
        bt(i + 1, cur)                    // include nums[i]
        remove last of cur                // backtrack
    bt(0, empty list)
    return result`

const CODE = `def subsets(nums):
    result = []
    def bt(i, cur):
        if i == len(nums):
            result.append(cur[:])
            return
        bt(i + 1, cur)           # exclude nums[i]
        cur.append(nums[i])
        bt(i + 1, cur)           # include nums[i]
        cur.pop()
    bt(0, [])
    return result`

const NUMS = [1, 2, 3]

function generate(): BacktrackingSetStep[] {
  const steps: BacktrackingSetStep[] = []
  const results: number[][] = []
  const cur: number[] = []
  const callStack: string[] = []

  const snap = (line: number, message: string, extra: Partial<BacktrackingSetStep> = {}) => {
    steps.push({
      candidates: NUMS,
      current: [...cur],
      results: results.map((r) => [...r]),
      callStack: [...callStack],
      line,
      message,
      ...extra,
    })
  }

  snap(3, `Find all subsets of [${NUMS.join(', ')}]`)

  function bt(i: number) {
    callStack.push(`bt(i=${i}, cur=[${cur.join(',')}])`)
    snap(3, `Enter bt(i=${i})`, { activeIndex: i })
    if (i === NUMS.length) {
      results.push([...cur])
      snap(5, `Record subset [${cur.join(', ')}]`, { activeIndex: i, action: 'record' })
      callStack.pop()
      return
    }
    snap(7, `Recurse: exclude nums[${i}]=${NUMS[i]}`, {
      activeIndex: i,
      action: 'exclude',
    })
    bt(i + 1)
    cur.push(NUMS[i])
    snap(9, `Include nums[${i}]=${NUMS[i]}, cur=[${cur.join(', ')}]`, {
      activeIndex: i,
      action: 'push',
    })
    bt(i + 1)
    cur.pop()
    snap(10, `Backtrack — pop nums[${i}], cur=[${cur.join(', ')}]`, {
      activeIndex: i,
      action: 'pop',
    })
    callStack.pop()
  }

  bt(0)
  snap(12, `Done — ${results.length} subsets total`)
  return steps
}

export const subsetsAlgorithm: BacktrackingSetAlgorithm = {
  id: 'subsets',
  name: 'Subsets',
  category: 'Backtracking',
  complexity: { time: 'O(n·2ⁿ)', space: 'O(n)' },
  description:
    'Generate all 2ⁿ subsets. For each element, branch on include vs exclude and record when i reaches n.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
