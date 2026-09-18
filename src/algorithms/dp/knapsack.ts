import type { DPAlgorithm, DPStep } from '../../types'

const PSEUDO = `procedure knapsack01(weights, values, capacity):
    n ← length(weights)
    dp ← (n + 1) × (capacity + 1) table of zeros
    for i ← 1 to n:
        w_i, v_i ← weights[i - 1], values[i - 1]
        for w ← 0 to capacity:
            dp[i][w] ← dp[i - 1][w]                            // skip item i
            if w_i ≤ w:
                dp[i][w] ← max(dp[i][w], dp[i - 1][w - w_i] + v_i) // take
    return dp[n][capacity]`

const CODE = `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        w_i, v_i = weights[i - 1], values[i - 1]
        for w in range(capacity + 1):
            dp[i][w] = dp[i - 1][w]
            if w_i <= w:
                dp[i][w] = max(dp[i][w], dp[i - 1][w - w_i] + v_i)
    return dp[n][capacity]`

const WEIGHTS = [2, 3, 4, 5]
const VALUES = [3, 4, 5, 8]
const CAPACITY = 8

function generate(): DPStep[] {
  const n = WEIGHTS.length
  const steps: DPStep[] = []
  const dp: (number | null)[][] = Array.from({ length: n + 1 }, () =>
    Array(CAPACITY + 1).fill(null),
  )

  const rowLabels = ['(none)', ...WEIGHTS.map((w, i) => `w${i + 1}=${w}, v=${VALUES[i]}`)]
  const colLabels = Array.from({ length: CAPACITY + 1 }, (_, w) => String(w))

  const snap = (line: number, message: string, extra: Partial<DPStep> = {}) => {
    steps.push({
      table: dp.map((row) => [...row]),
      rowLabels,
      colLabels,
      rowHeader: 'item i',
      colHeader: 'capacity w',
      line,
      message,
      ...extra,
    })
  }

  snap(3, `Initialize (${n + 1} × ${CAPACITY + 1}) table`, {})
  // Row 0: base case, 0 items → value 0 for all capacities
  for (let w = 0; w <= CAPACITY; w++) dp[0][w] = 0
  snap(3, 'Base row: no items → value 0', {})

  for (let i = 1; i <= n; i++) {
    const w_i = WEIGHTS[i - 1]
    const v_i = VALUES[i - 1]
    snap(4, `Row i=${i}, item weight=${w_i}, value=${v_i}`, {})
    for (let w = 0; w <= CAPACITY; w++) {
      const skip = dp[i - 1][w] as number
      let take: number | null = null
      if (w_i <= w) take = (dp[i - 1][w - w_i] as number) + v_i
      const choice = take !== null && take > skip ? take : skip
      const formula =
        take === null
          ? `w_i(${w_i}) > w(${w}) → dp[${i}][${w}] = dp[${i - 1}][${w}] = ${skip}`
          : `max(skip=${skip}, take=${take}) = ${choice}`
      const reads: Array<[number, number]> = [[i - 1, w]]
      if (take !== null) reads.push([i - 1, w - w_i])
      snap(7, `Compute dp[${i}][${w}]: ${formula}`, {
        currentCell: [i, w],
        readCells: reads,
        formula,
      })
      dp[i][w] = choice
      snap(7, `dp[${i}][${w}] = ${choice}`, {
        currentCell: [i, w],
        readCells: reads,
      })
    }
  }
  snap(9, `Return dp[${n}][${CAPACITY}] = ${dp[n][CAPACITY]}`, {
    finalCell: [n, CAPACITY],
  })
  return steps
}

export const knapsackDP: DPAlgorithm = {
  id: 'knapsack',
  name: '0/1 Knapsack',
  category: 'Dynamic Programming',
  complexity: { time: 'O(n·W)', space: 'O(n·W)' },
  description:
    'Fill a 2D table where dp[i][w] = best value using the first i items with capacity w. Each cell either skips item i or takes it (from dp[i-1][w-w_i] + v_i).',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
