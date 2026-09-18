import type { SortAlgorithm, SortStep } from '../../types'

const PSEUDO = `procedure countingSort(arr):
    if arr is empty: return arr
    lo, hi ← min(arr), max(arr)
    count ← array of (hi - lo + 1) zeros
    for v in arr:
        count[v - lo] ← count[v - lo] + 1
    out ← empty list
    for i, c in count:
        append (i + lo) to out, c times
    return out`

const CODE = `def counting_sort(arr):
    if not arr: return arr
    lo, hi = min(arr), max(arr)
    count = [0] * (hi - lo + 1)
    for v in arr:
        count[v - lo] += 1
    out = []
    for i, c in enumerate(count):
        out.extend([i + lo] * c)
    return out`

function generate(input: number[]): SortStep[] {
  const arr = [...input]
  const steps: SortStep[] = []
  const n = arr.length
  steps.push({ array: [...arr], line: 1, message: 'Start counting sort' })
  const lo = Math.min(...arr)
  const hi = Math.max(...arr)
  const count = Array(hi - lo + 1).fill(0)
  steps.push({ array: [...arr], line: 3, message: `min=${lo}, max=${hi}` })
  for (let i = 0; i < n; i++) {
    count[arr[i] - lo]++
    steps.push({
      array: [...arr],
      compare: [i, i],
      line: 6,
      message: `count[${arr[i] - lo}] += 1 (value ${arr[i]})`,
    })
  }
  const out: number[] = []
  for (let i = 0; i < count.length; i++) {
    for (let c = 0; c < count[i]; c++) out.push(i + lo)
  }
  for (let i = 0; i < n; i++) arr[i] = out[i]
  steps.push({
    array: [...arr],
    sorted: Array.from({ length: n }, (_, i) => i),
    line: 9,
    message: 'Reconstructed sorted array from counts',
  })
  return steps
}

export const countingSort: SortAlgorithm = {
  id: 'counting-sort',
  name: 'Counting Sort',
  category: 'Sorting',
  complexity: { time: 'O(n + k)', space: 'O(k)' },
  description:
    'Non-comparison sort. Count each value occurrence in a bucket array, then reconstruct. Efficient when the value range k is small relative to n.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
