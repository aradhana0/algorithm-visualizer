import type { ArrayPatternAlgorithm, ArrayPatternStep } from '../../types'

const PSEUDO = `procedure maxSumWindow(nums, k):
    windowSum ← sum of first k elements
    best ← windowSum
    for r ← k to length(nums) - 1:
        windowSum ← windowSum + nums[r] - nums[r - k]
        if windowSum > best:
            best ← windowSum
    return best`

const CODE = `def max_sum_window(nums, k):
    window_sum = sum(nums[:k])
    best = window_sum
    for r in range(k, len(nums)):
        window_sum += nums[r] - nums[r - k]
        if window_sum > best:
            best = window_sum
    return best`

const NUMS = [2, 1, 5, 1, 3, 2, 8, 1, 4]
const K = 3

function generate(): ArrayPatternStep[] {
  const steps: ArrayPatternStep[] = []
  let sum = 0
  for (let i = 0; i < K; i++) sum += NUMS[i]
  let best = sum
  let bestStart = 0
  let bestEnd = K - 1
  steps.push({
    array: NUMS,
    windowLeft: 0,
    windowRight: K - 1,
    runningValue: { label: `window_sum (k=${K})`, value: sum },
    bestValue: { label: 'best', value: best, range: [bestStart, bestEnd] },
    line: 2,
    message: `Initial window sum = ${sum}`,
  })
  for (let r = K; r < NUMS.length; r++) {
    sum += NUMS[r] - NUMS[r - K]
    steps.push({
      array: NUMS,
      windowLeft: r - K + 1,
      windowRight: r,
      runningValue: { label: 'window_sum', value: sum },
      bestValue: { label: 'best', value: best, range: [bestStart, bestEnd] },
      line: 5,
      message: `slide: +${NUMS[r]} -${NUMS[r - K]} → ${sum}`,
    })
    if (sum > best) {
      best = sum
      bestStart = r - K + 1
      bestEnd = r
      steps.push({
        array: NUMS,
        windowLeft: r - K + 1,
        windowRight: r,
        runningValue: { label: 'window_sum', value: sum },
        bestValue: { label: 'best', value: best, range: [bestStart, bestEnd] },
        line: 7,
        message: `New best = ${best}`,
      })
    }
  }
  steps.push({
    array: NUMS,
    bestValue: { label: 'best', value: best, range: [bestStart, bestEnd] },
    line: 8,
    message: `Return ${best}`,
  })
  return steps
}

export const slidingWindowAlgorithm: ArrayPatternAlgorithm = {
  id: 'sliding-window',
  name: 'Sliding Window (fixed k)',
  category: 'Array Patterns',
  complexity: { time: 'O(n)', space: 'O(1)' },
  description:
    'Max sum of any k-element contiguous window. Compute the initial window, then slide by adding the new right element and dropping the old left.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
