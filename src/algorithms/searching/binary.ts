import type { SearchAlgorithm, SearchStep } from '../../types'

const PSEUDO = `procedure binarySearch(arr, target):
    lo, hi ← 0, length(arr) - 1
    while lo ≤ hi:
        mid ← ⌊(lo + hi) / 2⌋
        if arr[mid] = target:
            return mid
        else if arr[mid] < target:
            lo ← mid + 1
        else:
            hi ← mid - 1
    return -1`

const CODE = `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`

const ARRAY = [3, 8, 12, 17, 23, 34, 42, 51, 68, 77, 89, 95]
const TARGET = 51

function generate(): SearchStep[] {
  const steps: SearchStep[] = []
  const arr = ARRAY
  let lo = 0
  let hi = arr.length - 1
  const eliminated: number[] = []

  steps.push({
    array: arr,
    target: TARGET,
    lo,
    hi,
    line: 1,
    message: `Search for ${TARGET} in sorted array`,
  })
  steps.push({
    array: arr,
    target: TARGET,
    lo,
    hi,
    line: 2,
    message: `lo = 0, hi = ${arr.length - 1}`,
  })

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    steps.push({
      array: arr,
      target: TARGET,
      lo,
      hi,
      mid,
      eliminated: [...eliminated],
      line: 3,
      message: `Loop: lo=${lo} <= hi=${hi}`,
    })
    steps.push({
      array: arr,
      target: TARGET,
      lo,
      hi,
      mid,
      eliminated: [...eliminated],
      line: 4,
      message: `mid = (${lo} + ${hi}) // 2 = ${mid}`,
    })
    steps.push({
      array: arr,
      target: TARGET,
      lo,
      hi,
      mid,
      compareIdx: mid,
      eliminated: [...eliminated],
      line: 5,
      message: `Compare arr[${mid}]=${arr[mid]} with target ${TARGET}`,
    })
    if (arr[mid] === TARGET) {
      steps.push({
        array: arr,
        target: TARGET,
        mid,
        foundIdx: mid,
        eliminated: [...eliminated],
        line: 6,
        message: `Match! return ${mid}`,
      })
      return steps
    } else if (arr[mid] < TARGET) {
      // Eliminate left half
      for (let i = lo; i <= mid; i++) eliminated.push(i)
      lo = mid + 1
      steps.push({
        array: arr,
        target: TARGET,
        lo,
        hi,
        eliminated: [...eliminated],
        line: 8,
        message: `${arr[mid]} < ${TARGET} → lo = mid + 1 = ${lo}`,
      })
    } else {
      // Eliminate right half
      for (let i = mid; i <= hi; i++) eliminated.push(i)
      hi = mid - 1
      steps.push({
        array: arr,
        target: TARGET,
        lo,
        hi,
        eliminated: [...eliminated],
        line: 10,
        message: `${arr[mid]} > ${TARGET} → hi = mid - 1 = ${hi}`,
      })
    }
  }

  steps.push({
    array: arr,
    target: TARGET,
    foundIdx: null,
    eliminated: [...eliminated],
    line: 11,
    message: 'lo > hi — not found, return -1',
  })
  return steps
}

export const binarySearch: SearchAlgorithm = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'Searching',
  complexity: { time: 'O(log n)', space: 'O(1)' },
  description:
    'Requires a sorted array. At each step, compare the middle element to the target and eliminate half the remaining range.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
