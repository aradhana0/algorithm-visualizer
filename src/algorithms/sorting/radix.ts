import type { SortAlgorithm, SortStep } from '../../types'

const PSEUDO = `procedure radixSort(arr):
    if arr is empty: return arr
    maxVal ← max(arr)
    exp ← 1
    while ⌊maxVal / exp⌋ > 0:
        // bucket sort by digit at position exp
        buckets ← 10 empty lists
        for v in arr:
            append v to buckets[⌊v / exp⌋ mod 10]
        arr ← concat all buckets in order
        exp ← exp × 10
    return arr`

const CODE = `def radix_sort(arr):
    if not arr: return arr
    max_val = max(arr)
    exp = 1
    while max_val // exp > 0:
        # counting sort by digit (exp)
        buckets = [[] for _ in range(10)]
        for v in arr:
            buckets[(v // exp) % 10].append(v)
        arr = [v for bucket in buckets for v in bucket]
        exp *= 10
    return arr`

function generate(input: number[]): SortStep[] {
  const arr = [...input]
  const steps: SortStep[] = []
  const n = arr.length
  steps.push({ array: [...arr], line: 1, message: 'Start radix sort (LSD)' })
  const maxVal = Math.max(...arr)
  let exp = 1
  while (Math.floor(maxVal / exp) > 0) {
    steps.push({
      array: [...arr],
      line: 5,
      message: `Sort by digit at position exp=${exp}`,
    })
    const buckets: number[][] = Array.from({ length: 10 }, () => [])
    for (let i = 0; i < n; i++) {
      const d = Math.floor(arr[i] / exp) % 10
      buckets[d].push(arr[i])
      steps.push({
        array: [...arr],
        compare: [i, i],
        line: 8,
        message: `${arr[i]} → bucket ${d}`,
      })
    }
    const out: number[] = []
    for (const b of buckets) for (const v of b) out.push(v)
    for (let i = 0; i < n; i++) arr[i] = out[i]
    steps.push({
      array: [...arr],
      line: 9,
      message: `Concatenate buckets for exp=${exp}`,
    })
    exp *= 10
  }
  steps.push({
    array: [...arr],
    sorted: Array.from({ length: n }, (_, i) => i),
    line: 1,
    message: 'Sorted',
  })
  return steps
}

export const radixSort: SortAlgorithm = {
  id: 'radix-sort',
  name: 'Radix Sort',
  category: 'Sorting',
  complexity: { time: 'O(d·(n + k))', space: 'O(n + k)' },
  description:
    'LSD radix sort: stable bucket-sort by each decimal digit from least to most significant. Non-comparison, works well for integers with bounded digit count d.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
