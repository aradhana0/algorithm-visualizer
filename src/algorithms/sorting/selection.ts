import type { SortAlgorithm, SortStep } from '../../types'

const PSEUDO = `procedure selectionSort(arr):
    n ← length(arr)
    for i ← 0 to n - 2:
        minIdx ← i
        for j ← i + 1 to n - 1:
            if arr[j] < arr[minIdx]:
                minIdx ← j
        swap arr[i], arr[minIdx]`

const CODE = `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]`

function generate(input: number[]): SortStep[] {
  const arr = [...input]
  const steps: SortStep[] = []
  const sorted: number[] = []
  const n = arr.length
  steps.push({ array: [...arr], line: 1, message: 'Start' })

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i
    steps.push({
      array: [...arr],
      sorted: [...sorted],
      line: 4,
      message: `min_idx = ${i}`,
    })
    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        compare: [minIdx, j],
        sorted: [...sorted],
        line: 6,
        message: `Compare a[${j}]=${arr[j]} with min a[${minIdx}]=${arr[minIdx]}`,
      })
      if (arr[j] < arr[minIdx]) {
        minIdx = j
        steps.push({
          array: [...arr],
          compare: [minIdx, minIdx],
          sorted: [...sorted],
          line: 7,
          message: `New min at ${j}`,
        })
      }
    }
    if (minIdx !== i) {
      ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
      steps.push({
        array: [...arr],
        swap: [i, minIdx],
        sorted: [...sorted],
        line: 8,
        message: `Swap min into position ${i}`,
      })
    }
    sorted.push(i)
  }
  sorted.push(n - 1)
  steps.push({ array: [...arr], sorted: [...sorted], line: 1, message: 'Sorted' })
  return steps
}

export const selectionSort: SortAlgorithm = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'Sorting',
  complexity: { time: 'O(n²)', space: 'O(1)' },
  description:
    'Finds the minimum in the unsorted region and swaps it into the next sorted position. Fewer swaps than bubble sort.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
