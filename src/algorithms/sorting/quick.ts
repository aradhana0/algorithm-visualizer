import type { SortAlgorithm, SortStep } from '../../types'

const PSEUDO = `procedure quickSort(arr, lo, hi):
    if lo < hi:
        p ← partition(arr, lo, hi)
        quickSort(arr, lo, p - 1)
        quickSort(arr, p + 1, hi)

procedure partition(arr, lo, hi):
    pivot ← arr[hi]
    i ← lo - 1
    for j ← lo to hi - 1:
        if arr[j] < pivot:
            i ← i + 1
            swap arr[i], arr[j]
    swap arr[i + 1], arr[hi]
    return i + 1`

const CODE = `def quick_sort(arr, lo, hi):
    if lo < hi:
        p = partition(arr, lo, hi)
        quick_sort(arr, lo, p - 1)
        quick_sort(arr, p + 1, hi)

def partition(arr, lo, hi):
    pivot = arr[hi]
    i = lo - 1
    for j in range(lo, hi):
        if arr[j] < pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[hi] = arr[hi], arr[i + 1]
    return i + 1`

function generate(input: number[]): SortStep[] {
  const arr = [...input]
  const steps: SortStep[] = []
  steps.push({ array: [...arr], line: 1, message: 'Start' })

  function partition(lo: number, hi: number): number {
    const pivotVal = arr[hi]
    steps.push({ array: [...arr], pivot: hi, line: 9, message: `Pivot = ${pivotVal}` })
    let i = lo - 1
    for (let j = lo; j < hi; j++) {
      steps.push({
        array: [...arr],
        pivot: hi,
        compare: [j, hi],
        line: 12,
        message: `Compare a[${j}]=${arr[j]} with pivot`,
      })
      if (arr[j] < pivotVal) {
        i++
        if (i !== j) {
          ;[arr[i], arr[j]] = [arr[j], arr[i]]
          steps.push({
            array: [...arr],
            pivot: hi,
            swap: [i, j],
            line: 14,
            message: `Swap a[${i}] and a[${j}]`,
          })
        }
      }
    }
    ;[arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]]
    steps.push({
      array: [...arr],
      swap: [i + 1, hi],
      line: 15,
      message: `Place pivot at index ${i + 1}`,
    })
    return i + 1
  }

  function sort(lo: number, hi: number) {
    if (lo < hi) {
      const p = partition(lo, hi)
      sort(lo, p - 1)
      sort(p + 1, hi)
    }
  }

  sort(0, arr.length - 1)
  steps.push({
    array: [...arr],
    sorted: Array.from({ length: arr.length }, (_, i) => i),
    line: 1,
    message: 'Sorted',
  })
  return steps
}

export const quickSort: SortAlgorithm = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'Sorting',
  complexity: { time: 'O(n log n) avg / O(n²) worst', space: 'O(log n)' },
  description:
    'Pick a pivot, partition the array around it, recurse. Very fast in practice; worst case on already-sorted input with naive pivot choice.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
