import type { ArrayPatternAlgorithm, ArrayPatternStep } from '../../types'

const PSEUDO = `procedure maxSubarray(nums):
    best ← cur ← nums[0]
    start ← bestStart ← bestEnd ← 0
    for i ← 1 to length(nums) - 1:
        if cur + nums[i] < nums[i]:
            cur ← nums[i]
            start ← i
        else:
            cur ← cur + nums[i]
        if cur > best:
            best ← cur
            bestStart ← start
            bestEnd ← i
    return best`

const CODE = `def max_subarray(nums):
    best = cur = nums[0]
    start = best_start = best_end = 0
    for i in range(1, len(nums)):
        if cur + nums[i] < nums[i]:
            cur = nums[i]
            start = i
        else:
            cur = cur + nums[i]
        if cur > best:
            best = cur
            best_start = start
            best_end = i
    return best`

const NUMS = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

function generate(): ArrayPatternStep[] {
  const steps: ArrayPatternStep[] = []
  let cur = NUMS[0]
  let best = NUMS[0]
  let start = 0
  let bestStart = 0
  let bestEnd = 0
  steps.push({
    array: NUMS,
    pointers: [{ name: 'i', index: 0 }],
    runningValue: { label: 'cur', value: cur },
    bestValue: { label: 'best', value: best, range: [bestStart, bestEnd] },
    line: 2,
    message: 'Initialize best = cur = nums[0]',
  })
  for (let i = 1; i < NUMS.length; i++) {
    if (cur + NUMS[i] < NUMS[i]) {
      cur = NUMS[i]
      start = i
      steps.push({
        array: NUMS,
        pointers: [{ name: 'i', index: i }, { name: 'start', index: start, color: '#8b5cf6' }],
        runningValue: { label: 'cur', value: cur },
        bestValue: { label: 'best', value: best, range: [bestStart, bestEnd] },
        line: 6,
        message: `Restart: cur = nums[${i}] = ${NUMS[i]}, start = ${i}`,
      })
    } else {
      cur = cur + NUMS[i]
      steps.push({
        array: NUMS,
        pointers: [{ name: 'i', index: i }, { name: 'start', index: start, color: '#8b5cf6' }],
        runningValue: { label: 'cur', value: cur },
        bestValue: { label: 'best', value: best, range: [bestStart, bestEnd] },
        highlightIndices: Array.from({ length: i - start + 1 }, (_, k) => start + k),
        line: 9,
        message: `Extend: cur = cur + ${NUMS[i]} = ${cur}`,
      })
    }
    if (cur > best) {
      best = cur
      bestStart = start
      bestEnd = i
      steps.push({
        array: NUMS,
        pointers: [{ name: 'i', index: i }, { name: 'start', index: start, color: '#8b5cf6' }],
        runningValue: { label: 'cur', value: cur },
        bestValue: { label: 'best', value: best, range: [bestStart, bestEnd] },
        highlightIndices: Array.from({ length: i - start + 1 }, (_, k) => start + k),
        line: 11,
        message: `New best = ${best} (indices ${bestStart}…${bestEnd})`,
      })
    }
  }
  steps.push({
    array: NUMS,
    bestValue: { label: 'best', value: best, range: [bestStart, bestEnd] },
    highlightIndices: Array.from({ length: bestEnd - bestStart + 1 }, (_, k) => bestStart + k),
    line: 14,
    message: `Return ${best}`,
  })
  return steps
}

export const kadaneAlgorithm: ArrayPatternAlgorithm = {
  id: 'kadane',
  name: "Kadane's (Max Subarray)",
  category: 'Array Patterns',
  complexity: { time: 'O(n)', space: 'O(1)' },
  description:
    "Max contiguous subarray sum in one pass. At each i, either extend the current run or restart from nums[i], keeping the global best.",
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
