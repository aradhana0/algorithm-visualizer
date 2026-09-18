import type { DPAlgorithm, DPStep } from '../../types'

const PSEUDO = `procedure editDistance(a, b):
    m, n ← length(a), length(b)
    dp ← (m + 1) × (n + 1) table of zeros
    for i ← 0 to m: dp[i][0] ← i
    for j ← 0 to n: dp[0][j] ← j
    for i ← 1 to m:
        for j ← 1 to n:
            if a[i - 1] = b[j - 1]:
                dp[i][j] ← dp[i - 1][j - 1]
            else:
                dp[i][j] ← 1 + min(dp[i - 1][j],       // delete
                                    dp[i][j - 1],      // insert
                                    dp[i - 1][j - 1])  // replace
    return dp[m][n]`

const CODE = `def edit_distance(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1): dp[i][0] = i
    for j in range(n + 1): dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j],    # delete
                                    dp[i][j-1],   # insert
                                    dp[i-1][j-1]) # replace
    return dp[m][n]`

const A = 'kitten'
const B = 'sitting'

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
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  snap(4, 'Init base: dp[i][0]=i, dp[0][j]=j')
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (A[i - 1] === B[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1]
        snap(7, `'${A[i - 1]}' matches '${B[j - 1]}' → carry diagonal`, {
          currentCell: [i, j],
          readCells: [[i - 1, j - 1]],
          formula: `dp[${i - 1}][${j - 1}] = ${dp[i - 1][j - 1]}`,
        })
      } else {
        const del = dp[i - 1][j] as number
        const ins = dp[i][j - 1] as number
        const rep = dp[i - 1][j - 1] as number
        dp[i][j] = 1 + Math.min(del, ins, rep)
        snap(9, `'${A[i - 1]}' → '${B[j - 1]}': 1 + min(del=${del}, ins=${ins}, rep=${rep})`, {
          currentCell: [i, j],
          readCells: [
            [i - 1, j],
            [i, j - 1],
            [i - 1, j - 1],
          ],
          formula: `1 + min(${del}, ${ins}, ${rep}) = ${dp[i][j]}`,
        })
      }
    }
  }
  snap(11, `Edit distance = dp[${m}][${n}] = ${dp[m][n]}`, { finalCell: [m, n] })
  return steps
}

export const editDistanceDP: DPAlgorithm = {
  id: 'edit-distance',
  name: 'Edit Distance',
  category: 'Dynamic Programming',
  complexity: { time: 'O(m·n)', space: 'O(m·n)' },
  description:
    'Min ops (insert/delete/replace) to convert a to b. Match → carry diagonal; else 1 + min of three neighbours.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
