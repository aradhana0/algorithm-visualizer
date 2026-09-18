import type { BacktrackingAlgorithm, NQueensStep } from '../../types'

const PSEUDO = `procedure solveNQueens(n):
    queens ← array of n NILs

    function isSafe(row, col):
        for r ← 0 to row - 1:
            c ← queens[r]
            if c = col or |c - col| = |r - row|:
                return FALSE
        return TRUE

    function place(row):
        if row = n:
            return TRUE                       // all rows placed
        for col ← 0 to n - 1:
            if isSafe(row, col):
                queens[row] ← col
                if place(row + 1):
                    return TRUE
                queens[row] ← NIL             // backtrack
        return FALSE

    return queens if place(0) else NIL`

const CODE = `def solve_n_queens(n):
    queens = [None] * n

    def is_safe(row, col):
        for r in range(row):
            c = queens[r]
            if c == col or abs(c - col) == abs(r - row):
                return False
        return True

    def place(row):
        if row == n:
            return True
        for col in range(n):
            if is_safe(row, col):
                queens[row] = col
                if place(row + 1):
                    return True
                queens[row] = None
        return False

    return queens if place(0) else None`

const N = 5

function generate(): NQueensStep[] {
  const n = N
  const queens: (number | null)[] = Array(n).fill(null)
  const steps: NQueensStep[] = []
  const callStack: number[] = []
  let solutionsCount = 0

  const attackedCells = (): Array<[number, number]> => {
    const cells: Array<[number, number]> = []
    for (let r = 0; r < n; r++) {
      const c = queens[r]
      if (c === null) continue
      for (let rr = 0; rr < n; rr++) {
        for (let cc = 0; cc < n; cc++) {
          if (rr === r && cc === c) continue
          if (rr === r || cc === c || Math.abs(rr - r) === Math.abs(cc - c)) {
            cells.push([rr, cc])
          }
        }
      }
    }
    return cells
  }

  const snap = (line: number, message: string, extra: Partial<NQueensStep> = {}) => {
    steps.push({
      n,
      queens: [...queens],
      callStack: [...callStack],
      solutionsCount,
      attackedCells: attackedCells(),
      line,
      message,
      ...extra,
    })
  }

  snap(1, `Solve ${n}-queens: find one valid placement`)

  function isSafe(row: number, col: number): { safe: boolean; conflict: { row: number; col: number } | null } {
    for (let r = 0; r < row; r++) {
      const c = queens[r]!
      if (c === col || Math.abs(c - col) === Math.abs(r - row)) {
        return { safe: false, conflict: { row: r, col: c } }
      }
    }
    return { safe: true, conflict: null }
  }

  function place(row: number): boolean {
    callStack.push(row)
    snap(11, `place(row=${row})`, { currentRow: row })
    if (row === n) {
      solutionsCount++
      snap(12, `row == n → solution found!`, { solved: true })
      callStack.pop()
      return true
    }
    for (let col = 0; col < n; col++) {
      snap(14, `Try (row=${row}, col=${col})`, { currentRow: row, tryingCol: col })
      const { safe, conflict } = isSafe(row, col)
      if (!safe) {
        snap(15, `Not safe — conflicts with queen at (${conflict!.row}, ${conflict!.col})`, {
          currentRow: row,
          tryingCol: col,
          conflictWith: conflict,
        })
        continue
      }
      queens[row] = col
      snap(16, `Safe — place queen at (${row}, ${col})`, {
        currentRow: row,
        tryingCol: col,
      })
      if (place(row + 1)) {
        callStack.pop()
        return true
      }
      queens[row] = null
      snap(19, `Backtrack — remove queen from row ${row}`, {
        currentRow: row,
        backtracking: true,
      })
    }
    snap(20, `No valid col in row ${row} — return False`, { currentRow: row })
    callStack.pop()
    return false
  }

  place(0)

  snap(22, solutionsCount > 0 ? `Solved!` : 'No solution', { solved: solutionsCount > 0 })
  return steps
}

export const nQueensAlgorithm: BacktrackingAlgorithm = {
  id: 'n-queens',
  name: 'N-Queens',
  category: 'Backtracking',
  complexity: { time: 'O(n!)', space: 'O(n)' },
  description:
    'Place n queens on an n×n board with no two attacking each other. Backtracking tries each column in each row, pruning on the fly via the safety check.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
