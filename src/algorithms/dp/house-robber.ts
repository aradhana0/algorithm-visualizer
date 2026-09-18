import type { DPAlgorithm, DPStep } from '../../types'

const PSEUDO = `procedure rob(nums):
    n ← length(nums)
    if n = 0: return 0
    dp ← array of n zeros
    dp[0] ← nums[0]
    if n > 1: dp[1] ← max(nums[0], nums[1])
    for i ← 2 to n - 1:
        dp[i] ← max(dp[i-1], dp[i-2] + nums[i])
    return dp[n-1]`

const CODE = `def rob(nums):
    n = len(nums)
    if n == 0: return 0
    dp = [0] * n
    dp[0] = nums[0]
    if n > 1: dp[1] = max(nums[0], nums[1])
    for i in range(2, n):
        dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    return dp[n-1]`

const NUMS = [3, 8, 4, 5, 10, 2, 9]

function generate(): DPStep[] {
  const n = NUMS.length
  const dp: (number | null)[] = Array(n).fill(null)
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
  snap(2, `Rob houses [${NUMS.join(', ')}]`)
  dp[0] = NUMS[0]
  snap(5, `dp[0] = nums[0] = ${NUMS[0]}`, { currentCell: [1, 0] })
  dp[1] = Math.max(NUMS[0], NUMS[1])
  snap(6, `dp[1] = max(${NUMS[0]}, ${NUMS[1]}) = ${dp[1]}`, {
    currentCell: [1, 1],
    readCells: [
      [0, 0],
      [0, 1],
    ],
  })
  for (let i = 2; i < n; i++) {
    const skip = dp[i - 1] as number
    const take = (dp[i - 2] as number) + NUMS[i]
    const choice = Math.max(skip, take)
    snap(8, `dp[${i}] = max(dp[${i - 1}]=${skip}, dp[${i - 2}]+nums[${i}]=${dp[i - 2]}+${NUMS[i]}=${take}) = ${choice}`, {
      currentCell: [1, i],
      readCells: [
        [1, i - 1],
        [1, i - 2],
        [0, i],
      ],
      formula: `max(${skip}, ${take}) = ${choice}`,
    })
    dp[i] = choice
  }
  snap(9, `Return dp[${n - 1}] = ${dp[n - 1]}`, { finalCell: [1, n - 1] })
  return steps
}

export const houseRobberDP: DPAlgorithm = {
  id: 'house-robber',
  name: 'House Robber',
  category: 'Dynamic Programming',
  complexity: { time: 'O(n)', space: 'O(n)' },
  description:
    'Max sum of non-adjacent houses. At i, choose max(skip i → dp[i-1], take i → dp[i-2] + nums[i]).',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
