export type SortStep = {
  array: number[]
  compare?: [number, number]
  swap?: [number, number]
  sorted?: number[]
  pivot?: number
  message?: string
  line?: number
}

export type SortAlgorithm = {
  id: string
  name: string
  category: 'Sorting'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: (input: number[]) => SortStep[]
}

export type AlgorithmCategory =
  | 'Sorting'
  | 'Searching'
  | 'Array Patterns'
  | 'Graph'
  | 'Trees'
  | 'Dynamic Programming'
  | 'Data Structures'
  | 'Backtracking'
  | 'Custom Code'

export type LLNode = { id: string; value: number | string }
export type LLEdge = { from: string; to: string | null }
export type LLList = { label?: string; head: string | null; nodes: LLNode[]; edges: LLEdge[] }
export type LLPointer = { name: string; nodeId: string | null; listIndex?: number; color?: string }

export type LinkedListStep = {
  lists: LLList[]
  pointers: LLPointer[]
  highlightNodes?: string[]
  highlightEdges?: Array<{ from: string; to: string | null }>
  line?: number
  message?: string
}

export type LinkedListAlgorithm = {
  id: string
  name: string
  category: 'Data Structures'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => LinkedListStep[]
}

export type StackStep = {
  stack: (number | string)[]
  operation?: 'push' | 'pop' | 'peek'
  operand?: number | string
  highlightIdx?: number
  line?: number
  message?: string
}

export type QueueStep = {
  queue: (number | string)[]
  operation?: 'enqueue' | 'dequeue' | 'peek'
  operand?: number | string
  highlightIdx?: number
  line?: number
  message?: string
}

export type HashEntry = { key: string; value: number | string }
export type HashTableStep = {
  buckets: HashEntry[][]
  targetBucket?: number
  hashKey?: string
  hashValue?: number
  highlightEntry?: { bucket: number; index: number } | null
  operation?: 'insert' | 'lookup' | 'delete'
  line?: number
  message?: string
}

export type HeapStep = {
  heap: number[]
  compareIdx?: [number, number]
  swapIdx?: [number, number]
  activeIdx?: number
  operation?: 'insert' | 'extract' | 'heapify'
  line?: number
  message?: string
}

export type DSKind = 'stack' | 'queue' | 'hashtable' | 'heap'

export type StackAlgorithm = {
  id: string
  name: string
  kind: 'stack'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => StackStep[]
}

export type QueueAlgorithm = {
  id: string
  name: string
  kind: 'queue'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => QueueStep[]
}

export type HashTableAlgorithm = {
  id: string
  name: string
  kind: 'hashtable'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => HashTableStep[]
}

export type HeapAlgorithm = {
  id: string
  name: string
  kind: 'heap'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => HeapStep[]
}

export type SearchStep = {
  array: number[]
  target: number
  compareIdx?: number
  eliminated?: number[]
  lo?: number
  hi?: number
  mid?: number
  foundIdx?: number | null
  line?: number
  message?: string
}

export type SearchAlgorithm = {
  id: string
  name: string
  category: 'Searching'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => SearchStep[]
}

export type GraphNode = { id: string; label: string; x: number; y: number }
export type GraphEdge = { from: string; to: string; weight?: number; directed?: boolean }
export type FrontierEntry = { node: string; priority?: number; from?: string }

export type GraphStep = {
  nodes: GraphNode[]
  edges: GraphEdge[]
  currentNode?: string | null
  visitedNodes?: string[]
  frontierNodes?: string[]
  activeEdges?: Array<{ from: string; to: string }>
  treeEdges?: Array<{ from: string; to: string }>
  distances?: Record<string, number | null>
  queueLabel?: string
  queueContents?: FrontierEntry[]
  path?: string[]
  line?: number
  message?: string
}

export type GraphAlgorithm = {
  id: string
  name: string
  category: 'Graph'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => GraphStep[]
}

export type BinaryTreeNode = {
  id: string
  value: number | string
  left: string | null
  right: string | null
}

export type TreeStep = {
  nodes: BinaryTreeNode[]
  root: string | null
  currentNode?: string | null
  visitedNodes?: string[]
  path?: string[]
  highlightNodes?: string[]
  traversalOrder?: (number | string)[]
  callStack?: string[]
  compareValue?: number | string
  line?: number
  message?: string
}

export type TreeAlgorithm = {
  id: string
  name: string
  category: 'Trees'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => TreeStep[]
}

export type DPStep = {
  table: (number | null | string)[][]
  rowLabels?: string[]
  colLabels?: string[]
  rowHeader?: string
  colHeader?: string
  currentCell?: [number, number]
  readCells?: Array<[number, number]>
  finalCell?: [number, number]
  callStack?: string[]
  formula?: string
  line?: number
  message?: string
}

export type DPAlgorithm = {
  id: string
  name: string
  category: 'Dynamic Programming'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => DPStep[]
}

export type NQueensStep = {
  n: number
  queens: (number | null)[]
  currentRow?: number
  tryingCol?: number
  conflictWith?: { row: number; col: number } | null
  attackedCells?: Array<[number, number]>
  solved?: boolean
  backtracking?: boolean
  solutionsCount?: number
  callStack?: number[]
  line?: number
  message?: string
}

export type BacktrackingAlgorithm = {
  id: string
  name: string
  category: 'Backtracking'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => NQueensStep[]
}

export type BacktrackingSetStep = {
  candidates: (number | string)[]
  current: (number | string)[]
  results: (number | string)[][]
  activeIndex?: number
  used?: boolean[]
  callStack?: string[]
  action?: 'include' | 'exclude' | 'push' | 'pop' | 'record'
  line?: number
  message?: string
}

export type BacktrackingSetAlgorithm = {
  id: string
  name: string
  category: 'Backtracking'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => BacktrackingSetStep[]
}

export type ArrayPatternStep = {
  array: number[]
  windowLeft?: number
  windowRight?: number
  pointers?: Array<{ name: string; index: number; color?: string }>
  auxArray?: (number | string)[]
  auxLabel?: string
  runningValue?: { label: string; value: number | string }
  bestValue?: { label: string; value: number | string; range?: [number, number] }
  highlightIndices?: number[]
  line?: number
  message?: string
}

export type ArrayPatternAlgorithm = {
  id: string
  name: string
  category: 'Array Patterns'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => ArrayPatternStep[]
}

export type TrieNode = {
  id: string
  char: string
  isEnd: boolean
  children: Record<string, string>
}

export type TrieStep = {
  root: string
  nodes: Record<string, TrieNode>
  currentPath?: string[]
  currentWord?: string
  operation?: 'insert' | 'search' | 'startsWith'
  found?: boolean
  words?: string[]
  line?: number
  message?: string
}

export type TrieAlgorithm = {
  id: string
  name: string
  kind: 'trie'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => TrieStep[]
}

export type UnionFindStep = {
  elements: (number | string)[]
  parent: Record<string, string>
  rank?: Record<string, number>
  activeElements?: string[]
  edges?: Array<[string, string]>
  currentOp?: 'find' | 'union'
  operations?: string[]
  line?: number
  message?: string
}

export type UnionFindAlgorithm = {
  id: string
  name: string
  kind: 'unionfind'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => UnionFindStep[]
}

export type SegTreeNode = {
  id: string
  l: number
  r: number
  value: number
  left: string | null
  right: string | null
}

export type SegTreeStep = {
  array: number[]
  nodes: SegTreeNode[]
  root: string | null
  activeNodes?: string[]
  updatedNodes?: string[]
  operation?: 'build' | 'query' | 'update'
  queryRange?: [number, number]
  queryResult?: number | null
  updateIndex?: number
  updateValue?: number
  line?: number
  message?: string
}

export type SegTreeAlgorithm = {
  id: string
  name: string
  kind: 'segtree'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => SegTreeStep[]
}

export type WordSearchStep = {
  grid: string[][]
  word: string
  currentRow?: number
  currentCol?: number
  pathCells?: Array<[number, number]>
  matchIndex?: number
  found?: boolean
  backtracking?: boolean
  visitedInPath?: Array<[number, number]>
  callStack?: string[]
  line?: number
  message?: string
}

export type WordSearchAlgorithm = {
  id: string
  name: string
  category: 'Backtracking'
  complexity: { time: string; space: string }
  description: string
  code: string
  pseudocode?: string
  generate: () => WordSearchStep[]
}
