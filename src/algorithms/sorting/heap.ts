import type { SortAlgorithm, SortStep } from '../../types'

const PSEUDO = `procedure heapSort(arr):
    n ← length(arr)
    for i ← ⌊n/2⌋ - 1 down to 0:
        heapify(arr, n, i)
    for i ← n - 1 down to 1:
        swap arr[0], arr[i]
        heapify(arr, i, 0)

procedure heapify(arr, n, i):
    largest ← i
    l ← 2·i + 1
    r ← 2·i + 2
    if l < n and arr[l] > arr[largest]:
        largest ← l
    if r < n and arr[r] > arr[largest]:
        largest ← r
    if largest ≠ i:
        swap arr[i], arr[largest]
        heapify(arr, n, largest)`

const CODE = `def heap_sort(arr):
    n = len(arr)
    for i in range(n // 2 - 1, -1, -1):
        heapify(arr, n, i)
    for i in range(n - 1, 0, -1):
        arr[0], arr[i] = arr[i], arr[0]
        heapify(arr, i, 0)

def heapify(arr, n, i):
    largest = i
    l = 2 * i + 1
    r = 2 * i + 2
    if l < n and arr[l] > arr[largest]:
        largest = l
    if r < n and arr[r] > arr[largest]:
        largest = r
    if largest != i:
        arr[i], arr[largest] = arr[largest], arr[i]
        heapify(arr, n, largest)`

function generate(input: number[]): SortStep[] {
  const arr = [...input]
  const steps: SortStep[] = []
  const n = arr.length
  const sorted: number[] = []
  steps.push({ array: [...arr], line: 1, message: 'Start' })

  function heapify(size: number, i: number) {
    let largest = i
    const l = 2 * i + 1
    const r = 2 * i + 2
    if (l < size) {
      steps.push({
        array: [...arr],
        compare: [largest, l],
        sorted: [...sorted],
        line: 14,
        message: `Heapify: compare a[${largest}] and left child a[${l}]`,
      })
      if (arr[l] > arr[largest]) largest = l
    }
    if (r < size) {
      steps.push({
        array: [...arr],
        compare: [largest, r],
        sorted: [...sorted],
        line: 16,
        message: `Heapify: compare a[${largest}] and right child a[${r}]`,
      })
      if (arr[r] > arr[largest]) largest = r
    }
    if (largest !== i) {
      ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
      steps.push({
        array: [...arr],
        swap: [i, largest],
        sorted: [...sorted],
        line: 19,
        message: `Swap a[${i}] and a[${largest}]`,
      })
      heapify(size, largest)
    }
  }

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i)
  steps.push({ array: [...arr], sorted: [...sorted], line: 4, message: 'Max-heap built' })

  for (let i = n - 1; i > 0; i--) {
    ;[arr[0], arr[i]] = [arr[i], arr[0]]
    sorted.unshift(i)
    steps.push({
      array: [...arr],
      swap: [0, i],
      sorted: [...sorted],
      line: 6,
      message: `Move max to end (index ${i})`,
    })
    heapify(i, 0)
  }
  sorted.unshift(0)
  steps.push({ array: [...arr], sorted: [...sorted], line: 1, message: 'Sorted' })
  return steps
}

export const heapSort: SortAlgorithm = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'Sorting',
  complexity: { time: 'O(n log n)', space: 'O(1)' },
  description:
    'Build a max-heap, then repeatedly extract the max and place it at the end. In-place, unstable.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
