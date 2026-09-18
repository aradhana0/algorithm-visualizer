import type { SortAlgorithm, SortStep } from '../../types'

const PSEUDO = `procedure bucketSort(arr):
    if arr is empty: return arr
    lo, hi ← min(arr), max(arr)
    n ← length(arr)
    k ← n           // number of buckets
    buckets ← k empty lists
    span ← (hi - lo) / k  (or 1 if hi = lo)
    for v in arr:
        idx ← min(⌊(v - lo) / span⌋, k - 1)
        append v to buckets[idx]
    for each bucket b:
        sort b
    return concat all buckets in order`

const CODE = `def bucket_sort(arr):
    if not arr: return arr
    lo, hi = min(arr), max(arr)
    n = len(arr)
    k = n  # number of buckets
    buckets = [[] for _ in range(k)]
    span = (hi - lo) / k if hi > lo else 1
    for v in arr:
        idx = min(int((v - lo) / span), k - 1)
        buckets[idx].append(v)
    for b in buckets:
        b.sort()
    return [v for b in buckets for v in b]`

function generate(input: number[]): SortStep[] {
  const arr = [...input]
  const steps: SortStep[] = []
  const n = arr.length
  steps.push({ array: [...arr], line: 1, message: 'Start bucket sort' })
  const lo = Math.min(...arr)
  const hi = Math.max(...arr)
  const k = n
  const span = hi > lo ? (hi - lo) / k : 1
  const buckets: number[][] = Array.from({ length: k }, () => [])
  for (let i = 0; i < n; i++) {
    const idx = Math.min(Math.floor((arr[i] - lo) / span), k - 1)
    buckets[idx].push(arr[i])
    steps.push({
      array: [...arr],
      compare: [i, i],
      line: 9,
      message: `Place ${arr[i]} → bucket ${idx}`,
    })
  }
  const out: number[] = []
  for (const b of buckets) {
    b.sort((a, b) => a - b)
    for (const v of b) out.push(v)
  }
  for (let i = 0; i < n; i++) arr[i] = out[i]
  steps.push({
    array: [...arr],
    sorted: Array.from({ length: n }, (_, i) => i),
    line: 13,
    message: 'Sort each bucket + concatenate',
  })
  return steps
}

export const bucketSort: SortAlgorithm = {
  id: 'bucket-sort',
  name: 'Bucket Sort',
  category: 'Sorting',
  complexity: { time: 'O(n + k)', space: 'O(n + k)' },
  description:
    'Distribute elements into k equal-range buckets, sort each bucket, then concatenate. Efficient for uniformly distributed input.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
