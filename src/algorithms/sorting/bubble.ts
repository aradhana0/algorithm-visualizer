import type { SortAlgorithm, SortStep } from '../../types'

const PSEUDO = `procedure bubbleSort(arr):
    n ← length(arr)
    for i ← 0 to n - 2:
        for j ← 0 to n - i - 2:
            if arr[j] > arr[j + 1]:
                swap arr[j], arr[j + 1]`

const CODE = `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]`

function generate(input: number[]): SortStep[] {
  const arr = [...input]
  const steps: SortStep[] = []
  const sorted: number[] = []
  steps.push({ array: [...arr], line: 1, message: 'Start' })

  const n = arr.length
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        compare: [j, j + 1],
        sorted: [...sorted],
        line: 5,
        message: `Compare a[${j}]=${arr[j]} and a[${j + 1}]=${arr[j + 1]}`,
      })
      if (arr[j] > arr[j + 1]) {
        ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        steps.push({
          array: [...arr],
          swap: [j, j + 1],
          sorted: [...sorted],
          line: 6,
          message: `Swap a[${j}] and a[${j + 1}]`,
        })
      }
    }
    sorted.unshift(n - i - 1)
  }
  sorted.unshift(0)
  steps.push({ array: [...arr], sorted: [...sorted], line: 1, message: 'Sorted' })
  return steps
}

export const bubbleSort: SortAlgorithm = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'Sorting',
  complexity: { time: 'O(n²)', space: 'O(1)' },
  description:
    'Repeatedly walks the array, swapping adjacent pairs that are out of order. Simple to understand, poor performance on large inputs.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
