import type { SearchAlgorithm, SearchStep } from '../../types'

const PSEUDO = `procedure linearSearch(arr, target):
    for i ← 0 to length(arr) - 1:
        if arr[i] = target:
            return i
    return -1`

const CODE = `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1`

const ARRAY = [42, 8, 15, 23, 4, 16, 61, 34, 27, 91]
const TARGET = 61

function generate(): SearchStep[] {
  const steps: SearchStep[] = []
  steps.push({
    array: ARRAY,
    target: TARGET,
    line: 1,
    message: `Search for ${TARGET}`,
  })
  for (let i = 0; i < ARRAY.length; i++) {
    steps.push({
      array: ARRAY,
      target: TARGET,
      compareIdx: i,
      line: 3,
      message: `Compare arr[${i}]=${ARRAY[i]} with target ${TARGET}`,
    })
    if (ARRAY[i] === TARGET) {
      steps.push({
        array: ARRAY,
        target: TARGET,
        compareIdx: i,
        foundIdx: i,
        line: 4,
        message: `Match! return ${i}`,
      })
      return steps
    }
  }
  steps.push({
    array: ARRAY,
    target: TARGET,
    foundIdx: null,
    line: 5,
    message: 'Not found — return -1',
  })
  return steps
}

export const linearSearch: SearchAlgorithm = {
  id: 'linear-search',
  name: 'Linear Search',
  category: 'Searching',
  complexity: { time: 'O(n)', space: 'O(1)' },
  description:
    'Walk from index 0 to the end, comparing each element to the target. Simple and works on unsorted arrays.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
