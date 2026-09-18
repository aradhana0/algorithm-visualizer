import type { DPAlgorithm, DPStep } from '../../types'

const PSEUDO = `procedure longestPalindrome(s):
    n ← length(s)
    dp ← n × n table of FALSE
    bestL, bestR ← 0, 0
    for i ← 0 to n - 1:
        dp[i][i] ← TRUE                              // length 1
    for i ← 0 to n - 2:
        if s[i] = s[i + 1]:
            dp[i][i + 1] ← TRUE                       // length 2
            bestL, bestR ← i, i + 1
    for length ← 3 to n:
        for i ← 0 to n - length:
            j ← i + length - 1
            if s[i] = s[j] and dp[i + 1][j - 1]:
                dp[i][j] ← TRUE
                if length > bestR - bestL + 1:
                    bestL, bestR ← i, j
    return s[bestL..bestR]`

const CODE = `def longest_palindrome(s):
    n = len(s)
    dp = [[False] * n for _ in range(n)]
    best_l, best_r = 0, 0
    for i in range(n):
        dp[i][i] = True
    for i in range(n - 1):
        if s[i] == s[i + 1]:
            dp[i][i + 1] = True
            best_l, best_r = i, i + 1
    for length in range(3, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j] and dp[i + 1][j - 1]:
                dp[i][j] = True
                if length > best_r - best_l + 1:
                    best_l, best_r = i, j
    return s[best_l:best_r + 1]`

const S = 'bananas'

function generate(): DPStep[] {
  const n = S.length
  const dp: (string | null)[][] = Array.from({ length: n }, () => Array(n).fill(null))
  const steps: DPStep[] = []
  const rowLabels = S.split('')
  const colLabels = S.split('')
  const boolCell = (b: boolean | null) => (b === null ? null : b ? 'T' : 'F')
  let bestL = 0
  let bestR = 0

  const snap = (line: number, message: string, extra: Partial<DPStep> = {}) => {
    steps.push({
      table: dp.map((r) => [...r]),
      rowLabels,
      colLabels,
      rowHeader: 'i',
      colHeader: 'j',
      line,
      message,
      ...extra,
    })
  }

  snap(3, `s = "${S}", init dp table with None`)

  // length 1
  for (let i = 0; i < n; i++) {
    dp[i][i] = boolCell(true)
    snap(6, `Length 1: dp[${i}][${i}] = T (single char is a palindrome)`, {
      currentCell: [i, i],
    })
  }
  // length 2
  for (let i = 0; i < n - 1; i++) {
    if (S[i] === S[i + 1]) {
      dp[i][i + 1] = boolCell(true)
      bestL = i
      bestR = i + 1
      snap(9, `Length 2: s[${i}]='${S[i]}' == s[${i + 1}]='${S[i + 1]}' → dp = T`, {
        currentCell: [i, i + 1],
      })
    } else {
      dp[i][i + 1] = boolCell(false)
      snap(9, `Length 2: s[${i}]='${S[i]}' != s[${i + 1}]='${S[i + 1]}' → dp = F`, {
        currentCell: [i, i + 1],
      })
    }
  }
  // length 3+
  for (let length = 3; length <= n; length++) {
    for (let i = 0; i + length - 1 < n; i++) {
      const j = i + length - 1
      const match = S[i] === S[j]
      const innerT = dp[i + 1][j - 1] === 'T'
      const isPal = match && innerT
      dp[i][j] = boolCell(isPal)
      snap(15, `L=${length}: s[${i}]='${S[i]}' vs s[${j}]='${S[j]}', inner dp[${i + 1}][${j - 1}]=${dp[i + 1][j - 1]} → ${isPal ? 'T' : 'F'}`, {
        currentCell: [i, j],
        readCells: [[i + 1, j - 1]],
        formula: `s[i]==s[j] AND dp[i+1][j-1]  →  ${isPal ? 'T' : 'F'}`,
      })
      if (isPal && length > bestR - bestL + 1) {
        bestL = i
        bestR = j
      }
    }
  }
  snap(19, `Longest palindromic substring = "${S.slice(bestL, bestR + 1)}" [${bestL}..${bestR}]`, {
    finalCell: [bestL, bestR],
  })
  return steps
}

export const longestPalindromeDP: DPAlgorithm = {
  id: 'longest-palindrome',
  name: 'Longest Palindromic Substring',
  category: 'Dynamic Programming',
  complexity: { time: 'O(n²)', space: 'O(n²)' },
  description:
    'dp[i][j] = True if s[i..j] is a palindrome. Fill by increasing length: len 1 base, then s[i]==s[j] AND dp[i+1][j-1].',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
