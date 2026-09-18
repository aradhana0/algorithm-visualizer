import type { ArrayPatternAlgorithm, ArrayPatternStep } from '../../types'

const PSEUDO = `procedure twoSum(nums, target):
    l, r ← 0, length(nums) - 1
    while l < r:
        s ← nums[l] + nums[r]
        if s = target:
            return (l, r)
        else if s < target:
            l ← l + 1
        else:
            r ← r - 1
    return NONE`

const CODE = `def two_sum(nums, target):
    l, r = 0, len(nums) - 1
    while l < r:
        s = nums[l] + nums[r]
        if s == target:
            return (l, r)
        elif s < target:
            l += 1
        else:
            r -= 1
    return None`

const NUMS = [1, 3, 4, 7, 11, 15, 20, 23]
const TARGET = 18

function generate(): ArrayPatternStep[] {
  const steps: ArrayPatternStep[] = []
  let l = 0
  let r = NUMS.length - 1
  const snap = (line: number, message: string, extra: Partial<ArrayPatternStep> = {}) => {
    steps.push({
      array: NUMS,
      pointers: [
        { name: 'l', index: l, color: '#f59e0b' },
        { name: 'r', index: r, color: '#ef4444' },
      ],
      runningValue: { label: 'target', value: TARGET },
      line,
      message,
      ...extra,
    })
  }
  snap(2, `Two pointers l=${l}, r=${r}`)
  while (l < r) {
    const s = NUMS[l] + NUMS[r]
    snap(4, `sum = ${NUMS[l]} + ${NUMS[r]} = ${s}`)
    if (s === TARGET) {
      snap(6, `Match! return (${l}, ${r})`, {
        highlightIndices: [l, r],
      })
      return steps
    } else if (s < TARGET) {
      l++
      snap(8, `${s} < ${TARGET} → l++`)
    } else {
      r--
      snap(10, `${s} > ${TARGET} → r--`)
    }
  }
  snap(11, 'l >= r → return None')
  return steps
}

export const twoSumSortedAlgorithm: ArrayPatternAlgorithm = {
  id: 'two-sum-sorted',
  name: 'Two Sum (sorted)',
  category: 'Array Patterns',
  complexity: { time: 'O(n)', space: 'O(1)' },
  description:
    'Find a pair summing to target in a sorted array using two pointers. Grow the small side or shrink the large side.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
