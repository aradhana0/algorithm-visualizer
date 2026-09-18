import type { SortAlgorithm, SortStep } from '../../types'

const PSEUDO = `procedure mergeSort(arr, lo, hi):
    if lo ≥ hi:
        return
    mid ← ⌊(lo + hi) / 2⌋
    mergeSort(arr, lo, mid)
    mergeSort(arr, mid + 1, hi)
    merge(arr, lo, mid, hi)

procedure merge(arr, lo, mid, hi):
    left  ← arr[lo..mid]
    right ← arr[mid + 1..hi]
    i ← 0, j ← 0
    k ← lo
    while i < |left| and j < |right|:
        if left[i] ≤ right[j]:
            arr[k] ← left[i];  i ← i + 1
        else:
            arr[k] ← right[j]; j ← j + 1
        k ← k + 1
    while i < |left|:
        arr[k] ← left[i];  i ← i + 1;  k ← k + 1
    while j < |right|:
        arr[k] ← right[j]; j ← j + 1;  k ← k + 1`

const CODE = `def merge_sort(arr, lo, hi):
    if lo >= hi:
        return
    mid = (lo + hi) // 2
    merge_sort(arr, lo, mid)
    merge_sort(arr, mid + 1, hi)
    merge(arr, lo, mid, hi)

def merge(arr, lo, mid, hi):
    left = arr[lo:mid + 1]
    right = arr[mid + 1:hi + 1]
    i = j = 0
    k = lo
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            arr[k] = left[i]; i += 1
        else:
            arr[k] = right[j]; j += 1
        k += 1
    while i < len(left):
        arr[k] = left[i]; i += 1; k += 1
    while j < len(right):
        arr[k] = right[j]; j += 1; k += 1`

function generate(input: number[]): SortStep[] {
  const arr = [...input]
  const steps: SortStep[] = []
  steps.push({ array: [...arr], line: 1, message: 'Start' })

  function merge(l: number, m: number, r: number) {
    const left = arr.slice(l, m + 1)
    const right = arr.slice(m + 1, r + 1)
    let i = 0,
      j = 0,
      k = l
    while (i < left.length && j < right.length) {
      steps.push({
        array: [...arr],
        compare: [l + i, m + 1 + j],
        line: 16,
        message: `Merge: compare ${left[i]} and ${right[j]}`,
      })
      if (left[i] <= right[j]) {
        arr[k++] = left[i++]
        steps.push({
          array: [...arr],
          swap: [k - 1, k - 1],
          line: 17,
          message: `Write left → a[${k - 1}]`,
        })
      } else {
        arr[k++] = right[j++]
        steps.push({
          array: [...arr],
          swap: [k - 1, k - 1],
          line: 19,
          message: `Write right → a[${k - 1}]`,
        })
      }
    }
    while (i < left.length) {
      arr[k++] = left[i++]
      steps.push({
        array: [...arr],
        swap: [k - 1, k - 1],
        line: 23,
        message: `Copy remainder from left`,
      })
    }
    while (j < right.length) {
      arr[k++] = right[j++]
      steps.push({
        array: [...arr],
        swap: [k - 1, k - 1],
        line: 25,
        message: `Copy remainder from right`,
      })
    }
  }

  function sort(l: number, r: number) {
    if (l >= r) return
    const m = Math.floor((l + r) / 2)
    sort(l, m)
    sort(m + 1, r)
    merge(l, m, r)
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

export const mergeSort: SortAlgorithm = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'Sorting',
  complexity: { time: 'O(n log n)', space: 'O(n)' },
  description:
    'Divide-and-conquer: split the array, sort each half, merge them. Stable and predictable O(n log n).',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
