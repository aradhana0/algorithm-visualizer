import type { DPAlgorithm, DPStep } from '../../types'

const PSEUDO = `procedure coinChange(coins, amount):
    dp ← array of (amount + 1) copies of ∞
    dp[0] ← 0
    for a ← 1 to amount:
        for each coin c in coins:
            if c ≤ a and dp[a - c] + 1 < dp[a]:
                dp[a] ← dp[a - c] + 1
    return dp[amount] if dp[amount] ≠ ∞ else -1`

const CODE = `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a and dp[a - c] + 1 < dp[a]:
                dp[a] = dp[a - c] + 1
    return dp[amount] if dp[amount] != float('inf') else -1`

const COINS = [1, 3, 4]
const AMOUNT = 11

function generate(): DPStep[] {
  const dp: (number | null | string)[] = Array(AMOUNT + 1).fill('∞')
  const steps: DPStep[] = []
  const snap = (line: number, message: string, extra: Partial<DPStep> = {}) => {
    steps.push({
      table: [[...dp]],
      colLabels: Array.from({ length: AMOUNT + 1 }, (_, i) => String(i)),
      colHeader: 'amount',
      line,
      message,
      ...extra,
    })
  }
  snap(2, `coins=${JSON.stringify(COINS)}, amount=${AMOUNT}`)
  dp[0] = 0
  snap(3, 'dp[0] = 0', { currentCell: [0, 0] })
  for (let a = 1; a <= AMOUNT; a++) {
    snap(4, `Compute dp[${a}]`, { currentCell: [0, a] })
    for (const c of COINS) {
      if (c <= a) {
        const prev = dp[a - c]
        const cur = dp[a]
        const candidate = typeof prev === 'number' ? prev + 1 : Infinity
        const curNum = typeof cur === 'number' ? cur : Infinity
        snap(6, `coin ${c}: dp[${a - c}] + 1 = ${prev === '∞' ? '∞' : (prev as number) + 1}, current dp[${a}] = ${cur}`, {
          currentCell: [0, a],
          readCells: [[0, a - c]],
        })
        if (candidate < curNum) {
          dp[a] = candidate
          snap(7, `dp[${a}] = ${candidate}`, {
            currentCell: [0, a],
            readCells: [[0, a - c]],
          })
        }
      }
    }
  }
  const ans = dp[AMOUNT]
  snap(8, typeof ans === 'number' ? `Return ${ans} coins` : 'No solution → -1', {
    finalCell: [0, AMOUNT],
  })
  return steps
}

export const coinChangeDP: DPAlgorithm = {
  id: 'coin-change',
  name: 'Coin Change',
  category: 'Dynamic Programming',
  complexity: { time: 'O(amount·|coins|)', space: 'O(amount)' },
  description:
    'Min number of coins to make target amount. For each amount a, try each coin c: dp[a] = min(dp[a], dp[a-c] + 1).',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
