import type { WordSearchAlgorithm, WordSearchStep } from '../../types'

const PSEUDO = `procedure exist(board, word):
    rows, cols ← dimensions of board
    function dfs(r, c, i):
        if i = length(word):
            return TRUE                                     // full match
        if r < 0 or r ≥ rows or c < 0 or c ≥ cols:
            return FALSE                                     // out of bounds
        if board[r][c] ≠ word[i]:
            return FALSE                                     // char mismatch
        tmp ← board[r][c]
        board[r][c] ← '#'                                    // mark visited
        found ← dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1)
             or dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1)
        board[r][c] ← tmp                                    // backtrack
        return found
    for r ← 0 to rows - 1:
        for c ← 0 to cols - 1:
            if dfs(r, c, 0):
                return TRUE
    return FALSE`

const CODE = `def exist(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word):
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return False
        if board[r][c] != word[i]:
            return False
        tmp = board[r][c]
        board[r][c] = '#'                      # mark visited
        found = (dfs(r+1, c, i+1) or dfs(r-1, c, i+1)
              or dfs(r, c+1, i+1) or dfs(r, c-1, i+1))
        board[r][c] = tmp                      # backtrack
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False`

const GRID: string[][] = [
  ['A', 'B', 'C', 'E'],
  ['S', 'F', 'C', 'S'],
  ['A', 'D', 'E', 'E'],
]
const WORD = 'ABCCED'

function generate(): WordSearchStep[] {
  const rows = GRID.length
  const cols = GRID[0].length
  const board = GRID.map((row) => [...row])
  const steps: WordSearchStep[] = []
  const path: Array<[number, number]> = []
  const callStack: string[] = []
  const winning: { path: Array<[number, number]> | null } = { path: null }

  const snap = (
    line: number,
    message: string,
    extra: Partial<WordSearchStep> = {},
  ) => {
    steps.push({
      grid: board.map((row) => [...row]),
      word: WORD,
      pathCells: [...path],
      callStack: [...callStack],
      line,
      message,
      ...extra,
    })
  }

  snap(2, `Search for "${WORD}" in ${rows}×${cols} grid`)

  function dfs(r: number, c: number, i: number): boolean {
    callStack.push(`dfs(${r},${c},i=${i})`)
    snap(4, `Enter dfs(r=${r}, c=${c}, i=${i})`, {
      currentRow: r,
      currentCol: c,
      matchIndex: i,
    })
    if (i === WORD.length) {
      winning.path = [...path]
      snap(5, `i == len(word) → found "${WORD}"!`, {
        currentRow: r,
        currentCol: c,
        matchIndex: i,
        found: true,
      })
      callStack.pop()
      return true
    }
    if (r < 0 || r >= rows || c < 0 || c >= cols) {
      snap(7, `Out of bounds (r=${r}, c=${c})`, {
        currentRow: r,
        currentCol: c,
        matchIndex: i,
      })
      callStack.pop()
      return false
    }
    if (board[r][c] !== WORD[i]) {
      snap(9, `board[${r}][${c}]='${board[r][c]}' ≠ word[${i}]='${WORD[i]}'`, {
        currentRow: r,
        currentCol: c,
        matchIndex: i,
      })
      callStack.pop()
      return false
    }
    // Match!
    const orig = board[r][c]
    board[r][c] = '#'
    path.push([r, c])
    snap(11, `Match '${WORD[i]}' at (${r},${c}), mark visited, recurse`, {
      currentRow: r,
      currentCol: c,
      matchIndex: i,
    })
    const found =
      dfs(r + 1, c, i + 1) ||
      dfs(r - 1, c, i + 1) ||
      dfs(r, c + 1, i + 1) ||
      dfs(r, c - 1, i + 1)
    board[r][c] = orig
    path.pop()
    snap(13, found ? `Return True from (${r},${c})` : `Backtrack — restore '${orig}' at (${r},${c})`, {
      currentRow: r,
      currentCol: c,
      matchIndex: i,
      backtracking: !found,
    })
    callStack.pop()
    return found
  }

  outer: for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      snap(15, `Try starting at (${r}, ${c})`, {
        currentRow: r,
        currentCol: c,
      })
      if (dfs(r, c, 0)) break outer
    }
  }

  if (winning.path) {
    // Final snap: re-highlight the winning path (board is restored to original by now)
    steps.push({
      grid: GRID.map((row) => [...row]),
      word: WORD,
      pathCells: winning.path,
      matchIndex: WORD.length,
      found: true,
      line: 18,
      message: `Solution: path length = ${winning.path.length}`,
    })
  } else {
    steps.push({
      grid: GRID.map((row) => [...row]),
      word: WORD,
      line: 20,
      message: 'No path found → return False',
    })
  }
  return steps
}

export const wordSearchAlgorithm: WordSearchAlgorithm = {
  id: 'word-search',
  name: 'Word Search',
  category: 'Backtracking',
  complexity: { time: 'O(m·n·4^L)', space: 'O(L)' },
  description:
    'Search a 2D grid for a word by DFS with backtracking — mark visited cells with a sentinel, restore on return.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
