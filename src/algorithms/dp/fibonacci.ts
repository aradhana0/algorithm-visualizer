import type { DPAlgorithm, DPStep } from '../../types'

const PSEUDO = `procedure fib(n):
    if n ≤ 1:
        return n
    dp ← array of (n + 1) zeros
    dp[0] ← 0
    dp[1] ← 1
    for i ← 2 to n:
        dp[i] ← dp[i - 1] + dp[i - 2]
    return dp[n]`

const CODE = `def fib(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[0] = 0
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`

const N = 10

function generate(): DPStep[] {
  const steps: DPStep[] = []
  const dp: (number | null)[] = Array(N + 1).fill(null)

  const snap = (line: number, message: string, extra: Partial<DPStep> = {}) => {
    steps.push({
      table: [[...dp]],
      colLabels: Array.from({ length: N + 1 }, (_, i) => String(i)),
      colHeader: 'i',
      line,
      message,
      ...extra,
    })
  }

  snap(2, `Compute fib(${N})`)
  dp[0] = 0
  snap(5, 'dp[0] = 0', { currentCell: [0, 0] })
  dp[1] = 1
  snap(6, 'dp[1] = 1', { currentCell: [0, 1] })
  for (let i = 2; i <= N; i++) {
    snap(7, `Loop i = ${i}`, {})
    snap(8, `dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]}`, {
      readCells: [
        [0, i - 1],
        [0, i - 2],
      ],
      formula: `dp[${i}] = dp[${i - 1}] + dp[${i - 2}]`,
    })
    dp[i] = (dp[i - 1] as number) + (dp[i - 2] as number)
    snap(8, `dp[${i}] = ${dp[i]}`, {
      currentCell: [0, i],
      readCells: [
        [0, i - 1],
        [0, i - 2],
      ],
    })
  }
  snap(9, `Return dp[${N}] = ${dp[N]}`, { finalCell: [0, N] })
  return steps
}

export const fibonacciDP: DPAlgorithm = {
  id: 'fib-dp',
  name: 'Fibonacci (Tabulation)',
  category: 'Dynamic Programming',
  complexity: { time: 'O(n)', space: 'O(n)' },
  description:
    'Bottom-up tabulation: fill dp[i] from dp[i-1] + dp[i-2] iteratively. Avoids the exponential recursion of naive fib.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
