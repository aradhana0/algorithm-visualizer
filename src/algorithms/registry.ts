import type {
  AlgorithmCategory,
  ArrayPatternAlgorithm,
  BacktrackingAlgorithm,
  BacktrackingSetAlgorithm,
  DPAlgorithm,
  GraphAlgorithm,
  HashTableAlgorithm,
  HeapAlgorithm,
  LinkedListAlgorithm,
  QueueAlgorithm,
  SearchAlgorithm,
  SegTreeAlgorithm,
  SortAlgorithm,
  StackAlgorithm,
  TreeAlgorithm,
  TrieAlgorithm,
  UnionFindAlgorithm,
  WordSearchAlgorithm,
} from '../types'
import { bubbleSort } from './sorting/bubble'
import { selectionSort } from './sorting/selection'
import { insertionSort } from './sorting/insertion'
import { mergeSort } from './sorting/merge'
import { quickSort } from './sorting/quick'
import { heapSort } from './sorting/heap'
import { countingSort } from './sorting/counting'
import { radixSort } from './sorting/radix'
import { bucketSort } from './sorting/bucket'
import { traverseList } from './linked-list/traverse'
import { reverseList } from './linked-list/reverse'
import { cycleDetection } from './linked-list/cycle-detection'
import { mergeSortedLists } from './linked-list/merge'
import { stackAlgorithm } from './data-structures/stack'
import { queueAlgorithm } from './data-structures/queue'
import { hashTableAlgorithm } from './data-structures/hashtable'
import { heapAlgorithm } from './data-structures/heap'
import { trieAlgorithm } from './data-structures/trie'
import { unionFindAlgorithm } from './data-structures/union-find'
import { segTreeAlgorithm } from './data-structures/segtree'
import { linearSearch } from './searching/linear'
import { binarySearch } from './searching/binary'
import { bfsAlgorithm } from './graph/bfs'
import { dfsAlgorithm } from './graph/dfs'
import { dijkstraAlgorithm } from './graph/dijkstra'
import { topologicalSort } from './graph/topological'
import { kruskalAlgorithm } from './graph/kruskal'
import { primAlgorithm } from './graph/prim'
import { bellmanFordAlgorithm } from './graph/bellman-ford'
import { bstAlgorithm } from './trees/bst'
import {
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  levelorderTraversal,
} from './trees/traversals'
import { iterativeInorder } from './trees/iterative-inorder'
import { fibonacciDP } from './dp/fibonacci'
import { knapsackDP } from './dp/knapsack'
import { houseRobberDP } from './dp/house-robber'
import { coinChangeDP } from './dp/coin-change'
import { lcsDP } from './dp/lcs'
import { lisDP } from './dp/lis'
import { editDistanceDP } from './dp/edit-distance'
import { unboundedKnapsackDP } from './dp/unbounded-knapsack'
import { longestPalindromeDP } from './dp/longest-palindrome'
import { nQueensAlgorithm } from './backtracking/n-queens'
import { subsetsAlgorithm } from './backtracking/subsets'
import { permutationsAlgorithm } from './backtracking/permutations'
import { combinationsAlgorithm } from './backtracking/combinations'
import { wordSearchAlgorithm } from './backtracking/word-search'
import { kadaneAlgorithm } from './array-patterns/kadane'
import { slidingWindowAlgorithm } from './array-patterns/sliding-window'
import { twoSumSortedAlgorithm } from './array-patterns/two-sum-sorted'
import { prefixSumAlgorithm } from './array-patterns/prefix-sum'

export const sortingAlgorithms: SortAlgorithm[] = [
  bubbleSort,
  selectionSort,
  insertionSort,
  mergeSort,
  quickSort,
  heapSort,
  countingSort,
  radixSort,
  bucketSort,
]

export const linkedListAlgorithms: LinkedListAlgorithm[] = [
  traverseList,
  reverseList,
  cycleDetection,
  mergeSortedLists,
]

type DSAlgorithm =
  | StackAlgorithm
  | QueueAlgorithm
  | HashTableAlgorithm
  | HeapAlgorithm
  | TrieAlgorithm
  | UnionFindAlgorithm
  | SegTreeAlgorithm
export const dataStructureAlgorithms: DSAlgorithm[] = [
  stackAlgorithm,
  queueAlgorithm,
  hashTableAlgorithm,
  heapAlgorithm,
  trieAlgorithm,
  unionFindAlgorithm,
  segTreeAlgorithm,
]

export const searchAlgorithms: SearchAlgorithm[] = [linearSearch, binarySearch]
export const arrayPatternAlgorithms: ArrayPatternAlgorithm[] = [
  kadaneAlgorithm,
  slidingWindowAlgorithm,
  twoSumSortedAlgorithm,
  prefixSumAlgorithm,
]
export const graphAlgorithms: GraphAlgorithm[] = [
  bfsAlgorithm,
  dfsAlgorithm,
  dijkstraAlgorithm,
  bellmanFordAlgorithm,
  topologicalSort,
  kruskalAlgorithm,
  primAlgorithm,
]
export const treeAlgorithms: TreeAlgorithm[] = [
  bstAlgorithm,
  inorderTraversal,
  preorderTraversal,
  postorderTraversal,
  levelorderTraversal,
  iterativeInorder,
]
export const dpAlgorithms: DPAlgorithm[] = [
  fibonacciDP,
  houseRobberDP,
  coinChangeDP,
  lisDP,
  lcsDP,
  editDistanceDP,
  knapsackDP,
  unboundedKnapsackDP,
  longestPalindromeDP,
]
export const backtrackingAlgorithms: BacktrackingAlgorithm[] = [nQueensAlgorithm]
export const backtrackingSetAlgorithms: BacktrackingSetAlgorithm[] = [
  subsetsAlgorithm,
  permutationsAlgorithm,
  combinationsAlgorithm,
]
export const wordSearchAlgorithms: WordSearchAlgorithm[] = [wordSearchAlgorithm]

export const CUSTOM_CODE_ID = '__custom__'

export type RegistryEntry =
  | { kind: 'sort'; id: string; name: string; category: AlgorithmCategory; algorithm: SortAlgorithm }
  | {
      kind: 'linkedlist'
      id: string
      name: string
      category: AlgorithmCategory
      algorithm: LinkedListAlgorithm
    }
  | {
      kind: 'datastructure'
      id: string
      name: string
      category: AlgorithmCategory
      algorithm: DSAlgorithm
    }
  | {
      kind: 'search'
      id: string
      name: string
      category: AlgorithmCategory
      algorithm: SearchAlgorithm
    }
  | {
      kind: 'arraypattern'
      id: string
      name: string
      category: AlgorithmCategory
      algorithm: ArrayPatternAlgorithm
    }
  | {
      kind: 'graph'
      id: string
      name: string
      category: AlgorithmCategory
      algorithm: GraphAlgorithm
    }
  | {
      kind: 'tree'
      id: string
      name: string
      category: AlgorithmCategory
      algorithm: TreeAlgorithm
    }
  | {
      kind: 'dp'
      id: string
      name: string
      category: AlgorithmCategory
      algorithm: DPAlgorithm
    }
  | {
      kind: 'backtracking'
      id: string
      name: string
      category: AlgorithmCategory
      algorithm: BacktrackingAlgorithm
    }
  | {
      kind: 'backtrackingset'
      id: string
      name: string
      category: AlgorithmCategory
      algorithm: BacktrackingSetAlgorithm
    }
  | {
      kind: 'wordsearch'
      id: string
      name: string
      category: AlgorithmCategory
      algorithm: WordSearchAlgorithm
    }
  | { kind: 'custom'; id: string; name: string; category: AlgorithmCategory }
  | { kind: 'placeholder'; id: string; name: string; category: AlgorithmCategory }

export const registry: RegistryEntry[] = [
  ...sortingAlgorithms.map(
    (a): RegistryEntry => ({ kind: 'sort', id: a.id, name: a.name, category: 'Sorting', algorithm: a }),
  ),
  ...searchAlgorithms.map(
    (a): RegistryEntry => ({ kind: 'search', id: a.id, name: a.name, category: 'Searching', algorithm: a }),
  ),
  ...arrayPatternAlgorithms.map(
    (a): RegistryEntry => ({
      kind: 'arraypattern',
      id: a.id,
      name: a.name,
      category: 'Array Patterns',
      algorithm: a,
    }),
  ),
  ...graphAlgorithms.map(
    (a): RegistryEntry => ({ kind: 'graph', id: a.id, name: a.name, category: 'Graph', algorithm: a }),
  ),
  ...treeAlgorithms.map(
    (a): RegistryEntry => ({ kind: 'tree', id: a.id, name: a.name, category: 'Trees', algorithm: a }),
  ),
  ...dpAlgorithms.map(
    (a): RegistryEntry => ({
      kind: 'dp',
      id: a.id,
      name: a.name,
      category: 'Dynamic Programming',
      algorithm: a,
    }),
  ),
  ...dataStructureAlgorithms.map(
    (a): RegistryEntry => ({
      kind: 'datastructure',
      id: a.id,
      name: a.name,
      category: 'Data Structures',
      algorithm: a,
    }),
  ),
  ...linkedListAlgorithms.map(
    (a): RegistryEntry => ({
      kind: 'linkedlist',
      id: a.id,
      name: `Linked List · ${a.name}`,
      category: 'Data Structures',
      algorithm: a,
    }),
  ),
  ...backtrackingAlgorithms.map(
    (a): RegistryEntry => ({
      kind: 'backtracking',
      id: a.id,
      name: a.name,
      category: 'Backtracking',
      algorithm: a,
    }),
  ),
  ...backtrackingSetAlgorithms.map(
    (a): RegistryEntry => ({
      kind: 'backtrackingset',
      id: a.id,
      name: a.name,
      category: 'Backtracking',
      algorithm: a,
    }),
  ),
  ...wordSearchAlgorithms.map(
    (a): RegistryEntry => ({
      kind: 'wordsearch',
      id: a.id,
      name: a.name,
      category: 'Backtracking',
      algorithm: a,
    }),
  ),
  { kind: 'custom', id: CUSTOM_CODE_ID, name: 'Custom Python Code', category: 'Custom Code' },
]

export const categoryOrder: AlgorithmCategory[] = [
  'Sorting',
  'Searching',
  'Array Patterns',
  'Graph',
  'Trees',
  'Dynamic Programming',
  'Data Structures',
  'Backtracking',
  'Custom Code',
]

export function groupedRegistry() {
  const map = new Map<AlgorithmCategory, RegistryEntry[]>()
  for (const cat of categoryOrder) map.set(cat, [])
  for (const entry of registry) map.get(entry.category)!.push(entry)
  return categoryOrder.map((cat) => ({ category: cat, entries: map.get(cat) ?? [] }))
}
