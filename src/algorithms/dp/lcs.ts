import type { DPAlgorithm, DPStep } from '../../types'

const PSEUDO = `procedure LCS(a, b):
    m, n ← length(a), length(b)
    dp ← (m + 1) × (n + 1) table of zeros
    for i ← 1 to m:
        for j ← 1 to n:
            if a[i - 1] = b[j - 1]:
                dp[i][j] ← dp[i - 1][j - 1] + 1
            else:
                dp[i][j] ← max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`

const CODE = `def lcs(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]`

const A = 'ABCBDAB'
const B = 'BDCAB'

function generate(): DPStep[] {
  const m = A.length
  const n = B.length
  const dp: (number | null)[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(null),
  )
  const steps: DPStep[] = []
  const rowLabels = ['·', ...A.split('')]
  const colLabels = ['·', ...B.split('')]
  const snap = (line: number, message: string, extra: Partial<DPStep> = {}) => {
    steps.push({
      table: dp.map((r) => [...r]),
      rowLabels,
      colLabels,
      rowHeader: `a="${A}"`,
      colHeader: `b="${B}"`,
      line,
      message,
      ...extra,
    })
  }
  for (let i = 0; i <= m; i++) dp[i][0] = 0
  for (let j = 0; j <= n; j++) dp[0][j] = 0
  snap(3, 'Init base row/col to 0')
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (A[i - 1] === B[j - 1]) {
        dp[i][j] = (dp[i - 1][j - 1] as number) + 1
        snap(6, `a[${i - 1}]='${A[i - 1]}' == b[${j - 1}]'='${B[j - 1]}' → dp = dp[${i - 1}][${j - 1}]+1 = ${dp[i][j]}`, {
          currentCell: [i, j],
          readCells: [[i - 1, j - 1]],
          formula: `${dp[i - 1][j - 1]} + 1`,
        })
      } else {
        const a = dp[i - 1][j] as number
        const b = dp[i][j - 1] as number
        dp[i][j] = Math.max(a, b)
        snap(8, `'${A[i - 1]}' != '${B[j - 1]}' → max(dp[${i - 1}][${j}]=${a}, dp[${i}][${j - 1}]=${b}) = ${dp[i][j]}`, {
          currentCell: [i, j],
          readCells: [
            [i - 1, j],
            [i, j - 1],
          ],
          formula: `max(${a}, ${b})`,
        })
      }
    }
  }
  snap(9, `LCS length = dp[${m}][${n}] = ${dp[m][n]}`, { finalCell: [m, n] })
  return steps
}

export const lcsDP: DPAlgorithm = {
  id: 'lcs',
  name: 'Longest Common Subsequence',
  category: 'Dynamic Programming',
  complexity: { time: 'O(m·n)', space: 'O(m·n)' },
  description:
    'Length of the longest subseq. common to two strings. Match → dp[i-1][j-1]+1, else max of the two neighbours.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
