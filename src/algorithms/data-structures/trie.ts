import type { TrieAlgorithm, TrieNode, TrieStep } from '../../types'

const PSEUDO = `class TrieNode:
    fields: children (map char → TrieNode), isEnd (bool)


class Trie:
    field: root = new TrieNode()


    procedure insert(word):
        node ← root
        for each char c in word:
            if c ∉ node.children:
                node.children[c] ← new TrieNode()
            node ← node.children[c]
        node.isEnd ← TRUE

    procedure search(word):
        node ← root
        for each char c in word:
            if c ∉ node.children:
                return FALSE
            node ← node.children[c]
        return node.isEnd

    procedure startsWith(prefix):
        node ← root
        for each char c in prefix:
            if c ∉ node.children:
                return FALSE
            node ← node.children[c]
        return TRUE`

const CODE = `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                node.children[c] = TrieNode()
            node = node.children[c]
        node.is_end = True

    def search(self, word):
        node = self.root
        for c in word:
            if c not in node.children:
                return False
            node = node.children[c]
        return node.is_end

    def starts_with(self, prefix):
        node = self.root
        for c in prefix:
            if c not in node.children:
                return False
            node = node.children[c]
        return True`

const OPERATIONS: Array<
  | { op: 'insert'; word: string }
  | { op: 'search'; word: string }
  | { op: 'startsWith'; word: string }
> = [
  { op: 'insert', word: 'cat' },
  { op: 'insert', word: 'car' },
  { op: 'insert', word: 'card' },
  { op: 'insert', word: 'dog' },
  { op: 'search', word: 'car' },
  { op: 'search', word: 'cars' },
  { op: 'startsWith', word: 'ca' },
]

function generate(): TrieStep[] {
  const steps: TrieStep[] = []
  const nodes: Record<string, TrieNode> = {
    root: { id: 'root', char: '·', isEnd: false, children: {} },
  }
  let nextId = 1
  const insertedWords: string[] = []

  const snap = (line: number, message: string, extra: Partial<TrieStep> = {}) => {
    steps.push({
      root: 'root',
      nodes: JSON.parse(JSON.stringify(nodes)),
      words: [...insertedWords],
      line,
      message,
      ...extra,
    })
  }

  snap(4, 'Empty trie (root only)')

  for (const op of OPERATIONS) {
    if (op.op === 'insert') {
      snap(11, `insert("${op.word}")`, { operation: 'insert', currentWord: op.word })
      let cur = 'root'
      const path = ['root']
      for (const c of op.word) {
        if (!nodes[cur].children[c]) {
          const id = `n${nextId++}`
          nodes[id] = { id, char: c, isEnd: false, children: {} }
          nodes[cur].children[c] = id
          snap(15, `Create child '${c}' under ${nodes[cur].char}`, {
            operation: 'insert',
            currentWord: op.word,
            currentPath: [...path, id],
          })
        }
        cur = nodes[cur].children[c]
        path.push(cur)
        snap(16, `Walk to '${c}'`, {
          operation: 'insert',
          currentWord: op.word,
          currentPath: [...path],
        })
      }
      nodes[cur].isEnd = true
      insertedWords.push(op.word)
      snap(17, `Mark end of "${op.word}"`, {
        operation: 'insert',
        currentWord: op.word,
        currentPath: [...path],
      })
    } else if (op.op === 'search') {
      snap(19, `search("${op.word}")`, { operation: 'search', currentWord: op.word })
      let cur = 'root'
      const path = ['root']
      let found = true
      for (const c of op.word) {
        if (!nodes[cur].children[c]) {
          found = false
          snap(22, `'${c}' not found → return False`, {
            operation: 'search',
            currentWord: op.word,
            currentPath: [...path],
            found: false,
          })
          break
        }
        cur = nodes[cur].children[c]
        path.push(cur)
        snap(23, `Walk to '${c}'`, {
          operation: 'search',
          currentWord: op.word,
          currentPath: [...path],
        })
      }
      if (found) {
        const isEnd = nodes[cur].isEnd
        snap(24, `Reached end — is_end = ${isEnd} → return ${isEnd}`, {
          operation: 'search',
          currentWord: op.word,
          currentPath: [...path],
          found: isEnd,
        })
      }
    } else {
      snap(26, `starts_with("${op.word}")`, {
        operation: 'startsWith',
        currentWord: op.word,
      })
      let cur = 'root'
      const path = ['root']
      let found = true
      for (const c of op.word) {
        if (!nodes[cur].children[c]) {
          found = false
          break
        }
        cur = nodes[cur].children[c]
        path.push(cur)
      }
      snap(30, `Return ${found}`, {
        operation: 'startsWith',
        currentWord: op.word,
        currentPath: [...path],
        found,
      })
    }
  }
  return steps
}

export const trieAlgorithm: TrieAlgorithm = {
  id: 'trie',
  name: 'Trie',
  kind: 'trie',
  complexity: { time: 'O(L)', space: 'O(N·L)' },
  description:
    'Prefix tree for a set of strings. Each node represents a single character; is_end marks a complete word. Insert/search/prefix all run in O(L) where L is the string length.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
