import type { HashEntry, HashTableAlgorithm, HashTableStep } from '../../types'

const PSEUDO = `class HashTable:
    fields: size, buckets  // buckets[i] is a chain of (key, value) pairs

    procedure init(size = 7):
        self.size ← size
        self.buckets ← array of size empty lists

    procedure hash(key):
        return (sum of char codes of key) mod self.size

    procedure insert(key, value):
        idx ← self.hash(key)
        bucket ← self.buckets[idx]
        for i, (k, _) in bucket:
            if k = key:
                bucket[i] ← (key, value)         // overwrite
                return
        append (key, value) to bucket             // new entry

    procedure lookup(key):
        idx ← self.hash(key)
        for (k, v) in self.buckets[idx]:
            if k = key:
                return v
        return NIL`

const CODE = `class HashTable:
    def __init__(self, size=7):
        self.size = size
        self.buckets = [[] for _ in range(size)]

    def _hash(self, key):
        return sum(ord(c) for c in key) % self.size

    def insert(self, key, value):
        idx = self._hash(key)
        bucket = self.buckets[idx]
        for i, (k, _) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))

    def lookup(self, key):
        idx = self._hash(key)
        for (k, v) in self.buckets[idx]:
            if k == key:
                return v
        return None`

const NUM_BUCKETS = 7

function hashFn(key: string): number {
  let sum = 0
  for (let i = 0; i < key.length; i++) sum += key.charCodeAt(i)
  return sum % NUM_BUCKETS
}

const SCRIPT: Array<
  | { op: 'insert'; k: string; v: number }
  | { op: 'lookup'; k: string }
> = [
  { op: 'insert', k: 'apple', v: 1 },
  { op: 'insert', k: 'bar', v: 2 },
  { op: 'insert', k: 'cat', v: 3 },
  { op: 'insert', k: 'dog', v: 4 },
  { op: 'insert', k: 'egg', v: 5 },
  { op: 'lookup', k: 'cat' },
  { op: 'insert', k: 'apple', v: 99 },
  { op: 'lookup', k: 'missing' },
]

function generate(): HashTableStep[] {
  const buckets: HashEntry[][] = Array.from({ length: NUM_BUCKETS }, () => [])
  const steps: HashTableStep[] = []

  const snap = (
    line: number,
    message: string,
    extra: Partial<HashTableStep> = {},
  ) => {
    steps.push({
      buckets: buckets.map((b) => b.map((e) => ({ ...e }))),
      line,
      message,
      ...extra,
    })
  }

  snap(4, 'Empty hash table (7 buckets)')

  for (const cmd of SCRIPT) {
    if (cmd.op === 'insert') {
      snap(10, `Call insert("${cmd.k}", ${cmd.v})`, {
        operation: 'insert',
        hashKey: cmd.k,
      })
      const idx = hashFn(cmd.k)
      snap(11, `hash("${cmd.k}") = ${idx}`, {
        operation: 'insert',
        hashKey: cmd.k,
        hashValue: idx,
        targetBucket: idx,
      })
      snap(12, `Look up bucket ${idx}`, {
        operation: 'insert',
        hashKey: cmd.k,
        hashValue: idx,
        targetBucket: idx,
      })
      // Search existing keys
      const bucket = buckets[idx]
      let replaced = false
      for (let i = 0; i < bucket.length; i++) {
        snap(13, `Check entry ${i}: key="${bucket[i].key}"`, {
          operation: 'insert',
          hashKey: cmd.k,
          hashValue: idx,
          targetBucket: idx,
          highlightEntry: { bucket: idx, index: i },
        })
        if (bucket[i].key === cmd.k) {
          bucket[i] = { key: cmd.k, value: cmd.v }
          snap(15, `Match — replace value with ${cmd.v}`, {
            operation: 'insert',
            hashKey: cmd.k,
            hashValue: idx,
            targetBucket: idx,
            highlightEntry: { bucket: idx, index: i },
          })
          replaced = true
          break
        }
      }
      if (!replaced) {
        bucket.push({ key: cmd.k, value: cmd.v })
        snap(17, `Append (${cmd.k}, ${cmd.v}) to bucket ${idx}`, {
          operation: 'insert',
          hashKey: cmd.k,
          hashValue: idx,
          targetBucket: idx,
          highlightEntry: { bucket: idx, index: bucket.length - 1 },
        })
      }
    } else {
      snap(19, `Call lookup("${cmd.k}")`, {
        operation: 'lookup',
        hashKey: cmd.k,
      })
      const idx = hashFn(cmd.k)
      snap(20, `hash("${cmd.k}") = ${idx}`, {
        operation: 'lookup',
        hashKey: cmd.k,
        hashValue: idx,
        targetBucket: idx,
      })
      const bucket = buckets[idx]
      let found = false
      for (let i = 0; i < bucket.length; i++) {
        snap(21, `Check entry ${i}: key="${bucket[i].key}"`, {
          operation: 'lookup',
          hashKey: cmd.k,
          hashValue: idx,
          targetBucket: idx,
          highlightEntry: { bucket: idx, index: i },
        })
        if (bucket[i].key === cmd.k) {
          snap(23, `Match — return ${bucket[i].value}`, {
            operation: 'lookup',
            hashKey: cmd.k,
            hashValue: idx,
            targetBucket: idx,
            highlightEntry: { bucket: idx, index: i },
          })
          found = true
          break
        }
      }
      if (!found) {
        snap(24, `Not found — return None`, {
          operation: 'lookup',
          hashKey: cmd.k,
          hashValue: idx,
          targetBucket: idx,
        })
      }
    }
  }
  return steps
}

export const hashTableAlgorithm: HashTableAlgorithm = {
  id: 'hashtable-basic',
  name: 'Hash Table (chaining)',
  kind: 'hashtable',
  complexity: { time: 'O(1) avg / O(n) worst', space: 'O(n)' },
  description:
    'Buckets keyed by hash(key) mod size. Collisions handled by appending to a per-bucket chain. Duplicate keys overwrite the existing entry.',
  code: CODE,
  pseudocode: PSEUDO,
  generate,
}
