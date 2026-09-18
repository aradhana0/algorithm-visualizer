import type { HeapAlgorithm, HeapStep } from '../../types'

const PSEUDO = `class MinHeap:
    field: heap = empty list


    procedure insert(x):
        append x to heap
        siftUp(length(heap) - 1)

    procedure extractMin():
        root ← heap[0]
        last ← remove last of heap
        if heap non-empty:
            heap[0] ← last
            siftDown(0)
        return root

    procedure siftUp(i):
        while i > 0:
            parent ← ⌊(i - 1) / 2⌋
            if heap[i] < heap[parent]:
                swap heap[i], heap[parent]
                i ← parent
            else:
                break

    procedure siftDown(i):
        n ← length(heap)
        loop:
            l, r ← 2·i + 1, 2·i + 2
            smallest ← i
            if l < n and heap[l] < heap[smallest]: smallest ← l
            if r < n and heap[r] < heap[smallest]: smallest ← r
            if smallest = i: break
            swap heap[i], heap[smallest]
            i ← smallest`

const CODE = `class MinHeap:
    def __init__(self):
        self.heap = []

    def insert(self, x):
        self.heap.append(x)
        self._sift_up(len(self.heap) - 1)

    def extract_min(self):
        root = self.heap[0]
        last = self.heap.pop()
        if self.heap:
            self.heap[0] = last
            self._sift_down(0)
        return root

    def _sift_up(self, i):
        while i > 0:
            parent = (i - 1) // 2
            if self.heap[i] < self.heap[parent]:
                self.heap[i], self.heap[parent] = self.heap[parent], self.heap[i]
                i = parent
            else:
                break

    def _sift_down(self, i):
        n = len(self.heap)
        while True:
            l, r = 2*i + 1, 2*i + 2
            smallest = i
            if l < n and self.heap[l] < self.heap[smallest]: smallest = l
            if r < n and self.heap[r] < self.heap[smallest]: smallest = r
            if smallest == i: break
            self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]
            i = smallest`

const INSERT_SEQ = [7, 3, 12, 1, 8, 20, 2]
const EXTRACT_COUNT = 3

function generate(): HeapStep[] {
  const heap: number[] = []
  const steps: HeapStep[] = []

  const snap = (line: number, message: string, extra: Partial<HeapStep> = {}) => {
    steps.push({ heap: [...heap], line, message, ...extra })
  }

  snap(3, 'Empty heap')

  for (const x of INSERT_SEQ) {
    snap(5, `Call insert(${x})`, { operation: 'insert' })
    heap.push(x)
    snap(6, `Append ${x} at index ${heap.length - 1}`, {
      operation: 'insert',
      activeIdx: heap.length - 1,
    })
    // sift up
    let i = heap.length - 1
    snap(15, `_sift_up(${i})`, { operation: 'insert', activeIdx: i })
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2)
      snap(16, `Compare heap[${i}]=${heap[i]} with parent heap[${parent}]=${heap[parent]}`, {
        operation: 'insert',
        activeIdx: i,
        compareIdx: [i, parent],
      })
      if (heap[i] < heap[parent]) {
        ;[heap[i], heap[parent]] = [heap[parent], heap[i]]
        snap(18, `Swap up: ${heap[parent]} ↔ ${heap[i]}`, {
          operation: 'insert',
          activeIdx: parent,
          swapIdx: [i, parent],
        })
        i = parent
      } else {
        snap(20, 'Heap property satisfied — stop', {
          operation: 'insert',
          activeIdx: i,
        })
        break
      }
    }
  }

  for (let k = 0; k < EXTRACT_COUNT; k++) {
    snap(8, 'Call extract_min()', { operation: 'extract' })
    const root = heap[0]
    snap(9, `root = heap[0] = ${root}`, { operation: 'extract', activeIdx: 0 })
    const last = heap.pop()!
    snap(10, `last = heap.pop() = ${last}`, { operation: 'extract' })
    if (heap.length > 0) {
      heap[0] = last
      snap(12, `heap[0] = ${last}`, { operation: 'extract', activeIdx: 0 })
      // sift down
      snap(24, '_sift_down(0)', { operation: 'extract', activeIdx: 0 })
      let i = 0
      while (true) {
        const l = 2 * i + 1
        const r = 2 * i + 2
        let smallest = i
        if (l < heap.length) {
          snap(28, `Compare left heap[${l}]=${heap[l]} with smallest heap[${smallest}]=${heap[smallest]}`, {
            operation: 'extract',
            activeIdx: i,
            compareIdx: [smallest, l],
          })
          if (heap[l] < heap[smallest]) smallest = l
        }
        if (r < heap.length) {
          snap(29, `Compare right heap[${r}]=${heap[r]} with smallest heap[${smallest}]=${heap[smallest]}`, {
            operation: 'extract',
            activeIdx: i,
            compareIdx: [smallest, r],
          })
          if (heap[r] < heap[smallest]) smallest = r
        }
        if (smallest === i) {
          snap(30, 'Heap property restored — stop', { operation: 'extract', activeIdx: i })
          break
        }
        ;[heap[i], heap[smallest]] = [heap[smallest], heap[i]]
        snap(31, `Swap down: ${heap[i]} ↔ ${heap[smallest]}`, {
          operation: 'extract',
          activeIdx: smallest,
          swapIdx: [i, smallest],
        })
        i = smallest
      }
    }
    snap(14, `Returned ${root}`, { operation: 'extract' })
  }
  return steps
}

export const heapAlgorithm: HeapAlgorithm = {
  id: 'heap-basic',
  name: 'Min Heap',
  kind: 'heap',
  complexity: { time: 'O(log n) insert/extract', space: 'O(n)' },
  description:
    'A complete binary tree stored as an array. Parent of i is (i-1)//2; children are 2i+1 and 2i+2. insert sifts up; extract_min replaces root with last and sifts down.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
