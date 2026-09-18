import type { DPAlgorithm, DPStep } from '../../types'

const PSEUDO = `procedure LIS(nums):
    n ← length(nums)
    dp ← array of n ones
    for i ← 1 to n - 1:
        for j ← 0 to i - 1:
            if nums[j] < nums[i]:
                dp[i] ← max(dp[i], dp[j] + 1)
    return max(dp)`

const CODE = `def lis(nums):
    n = len(nums)
    dp = [1] * n
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    return max(dp)`

const NUMS = [10, 9, 2, 5, 3, 7, 101, 18]

function generate(): DPStep[] {
  const n = NUMS.length
  const dp: number[] = Array(n).fill(1)
  const steps: DPStep[] = []
  const snap = (line: number, message: string, extra: Partial<DPStep> = {}) => {
    steps.push({
      table: [NUMS.map((x) => x), [...dp]],
      rowLabels: ['nums', 'dp'],
      colLabels: NUMS.map((_, i) => String(i)),
      colHeader: 'i',
      line,
      message,
      ...extra,
    })
  }
  snap(2, `Init dp = [1]*${n}`)
  for (let i = 1; i < n; i++) {
    snap(4, `i = ${i} (value=${NUMS[i]})`, { currentCell: [1, i] })
    for (let j = 0; j < i; j++) {
      snap(6, `Compare nums[${j}]=${NUMS[j]} < nums[${i}]=${NUMS[i]}?`, {
        currentCell: [1, i],
        readCells: [
          [0, j],
          [0, i],
          [1, j],
        ],
      })
      if (NUMS[j] < NUMS[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1
        snap(7, `Extend: dp[${i}] = dp[${j}] + 1 = ${dp[i]}`, {
          currentCell: [1, i],
          readCells: [[1, j]],
        })
      }
    }
  }
  const best = Math.max(...dp)
  const bestI = dp.indexOf(best)
  snap(8, `LIS length = max(dp) = ${best}`, { finalCell: [1, bestI] })
  return steps
}

export const lisDP: DPAlgorithm = {
  id: 'lis',
  name: 'Longest Increasing Subsequence',
  category: 'Dynamic Programming',
  complexity: { time: 'O(n²)', space: 'O(n)' },
  description:
    'Length of the longest strictly increasing subseq. dp[i] = 1 + max(dp[j]) over j < i where nums[j] < nums[i].',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
