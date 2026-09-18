import type { ArrayPatternAlgorithm, ArrayPatternStep } from '../../types'

const PSEUDO = `procedure buildPrefix(nums):
    prefix ← array of (length(nums) + 1) zeros
    for i ← 0 to length(nums) - 1:
        prefix[i + 1] ← prefix[i] + nums[i]
    return prefix

procedure rangeSum(prefix, l, r):
    return prefix[r + 1] - prefix[l]`

const CODE = `def build_prefix(nums):
    prefix = [0] * (len(nums) + 1)
    for i in range(len(nums)):
        prefix[i + 1] = prefix[i] + nums[i]
    return prefix

def range_sum(prefix, l, r):
    return prefix[r + 1] - prefix[l]`

const NUMS = [3, 1, 4, 1, 5, 9, 2, 6]
const QUERY: [number, number] = [2, 5]

function generate(): ArrayPatternStep[] {
  const steps: ArrayPatternStep[] = []
  const prefix: number[] = Array(NUMS.length + 1).fill(0)
  steps.push({
    array: NUMS,
    auxArray: [...prefix],
    auxLabel: 'prefix',
    line: 2,
    message: 'Init prefix[0] = 0',
  })
  for (let i = 0; i < NUMS.length; i++) {
    prefix[i + 1] = prefix[i] + NUMS[i]
    steps.push({
      array: NUMS,
      auxArray: [...prefix],
      auxLabel: 'prefix',
      pointers: [{ name: 'i', index: i }],
      line: 4,
      message: `prefix[${i + 1}] = prefix[${i}] + nums[${i}] = ${prefix[i]} + ${NUMS[i]} = ${prefix[i + 1]}`,
    })
  }
  const [l, r] = QUERY
  const rangeSum = prefix[r + 1] - prefix[l]
  steps.push({
    array: NUMS,
    auxArray: [...prefix],
    auxLabel: 'prefix',
    pointers: [
      { name: 'l', index: l, color: '#f59e0b' },
      { name: 'r', index: r, color: '#ef4444' },
    ],
    highlightIndices: Array.from({ length: r - l + 1 }, (_, i) => l + i),
    runningValue: {
      label: `range_sum([${l},${r}])`,
      value: `prefix[${r + 1}] - prefix[${l}] = ${prefix[r + 1]} - ${prefix[l]} = ${rangeSum}`,
    },
    line: 8,
    message: `Query sum of indices ${l}…${r}`,
  })
  return steps
}

export const prefixSumAlgorithm: ArrayPatternAlgorithm = {
  id: 'prefix-sum',
  name: 'Prefix Sum',
  category: 'Array Patterns',
  complexity: { time: 'O(n) build / O(1) query', space: 'O(n)' },
  description:
    'Precompute prefix sums so any range sum can be answered in O(1) as prefix[r+1] - prefix[l].',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
