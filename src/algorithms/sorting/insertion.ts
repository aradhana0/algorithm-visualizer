import type { SortAlgorithm, SortStep } from '../../types'

const PSEUDO = `procedure insertionSort(arr):
    for i ← 1 to length(arr) - 1:
        j ← i
        while j > 0 and arr[j - 1] > arr[j]:
            swap arr[j - 1], arr[j]
            j ← j - 1`

const CODE = `def insertion_sort(arr):
    for i in range(1, len(arr)):
        j = i
        while j > 0 and arr[j - 1] > arr[j]:
            arr[j - 1], arr[j] = arr[j], arr[j - 1]
            j -= 1`

function generate(input: number[]): SortStep[] {
  const arr = [...input]
  const steps: SortStep[] = []
  const n = arr.length
  steps.push({ array: [...arr], line: 1, message: 'Start' })

  for (let i = 1; i < n; i++) {
    let j = i
    while (j > 0) {
      steps.push({
        array: [...arr],
        compare: [j - 1, j],
        line: 4,
        message: `Compare a[${j - 1}]=${arr[j - 1]} and a[${j}]=${arr[j]}`,
      })
      if (arr[j - 1] > arr[j]) {
        ;[arr[j - 1], arr[j]] = [arr[j], arr[j - 1]]
        steps.push({
          array: [...arr],
          swap: [j - 1, j],
          line: 5,
          message: `Shift a[${j}] leftwards`,
        })
        j--
      } else break
    }
  }
  steps.push({
    array: [...arr],
    sorted: Array.from({ length: n }, (_, i) => i),
    line: 1,
    message: 'Sorted',
  })
  return steps
}

export const insertionSort: SortAlgorithm = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'Sorting',
  complexity: { time: 'O(n²)', space: 'O(1)' },
  description:
    'Builds up a sorted prefix by inserting each new element into its correct place. Fast on nearly-sorted inputs.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
