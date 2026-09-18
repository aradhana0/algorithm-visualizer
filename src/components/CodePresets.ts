export type CodePreset = { id: string; name: string; code: string }

export const CODE_PRESETS: CodePreset[] = [
  {
    id: 'quicksort',
    name: 'Quicksort',
    code: `# Quicksort — the array 'arr' auto-renders as an array cell chart.
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left  = [x for x in arr if x <  pivot]
    mid   = [x for x in arr if x == pivot]
    right = [x for x in arr if x >  pivot]
    return quicksort(left) + mid + quicksort(right)

arr = [7, 2, 9, 4, 1, 8, 3, 6, 5]
sorted_arr = quicksort(arr)
print("sorted:", sorted_arr)
`,
  },
  {
    id: 'bst-insert',
    name: 'BST Insert',
    code: `# BST insert — use viz.tree(...) for the tree view.
def make(v):
    return {"value": v, "children": [{"value": None}, {"value": None}]}

def insert(node, v):
    if node["value"] is None:
        return make(v)
    if v < node["value"]:
        node["children"][0] = insert(node["children"][0], v)
    else:
        node["children"][1] = insert(node["children"][1], v)
    return node

root = {"value": None}
for v in [50, 30, 70, 20, 40, 60, 80, 35, 45]:
    root = insert(root, v)
    viz.tree(root, name="bst", label=f"after inserting {v}")
`,
  },
  {
    id: 'graph-dfs',
    name: 'DFS on graph',
    code: `# DFS on a small graph — use viz.graph(...) for the graph view.
graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"],
}

nodes = list(graph.keys())
edges = []
for u, nbrs in graph.items():
    for v in nbrs:
        if (v, u) not in edges:
            edges.append((u, v))

visited = []
stack = ["A"]
while stack:
    u = stack.pop()
    if u in visited:
        continue
    visited.append(u)
    viz.graph(nodes, edges, highlight_nodes=visited, label=f"visited: {visited}")
    for v in reversed(graph[u]):
        if v not in visited:
            stack.append(v)

print("order:", visited)
`,
  },
  {
    id: 'dp-lcs',
    name: 'DP: Longest Common Subseq.',
    code: `# LCS dynamic programming — dp is a 2D list, auto-renders as a heatmap.
a = "ABCBDAB"
b = "BDCAB"
m, n = len(a), len(b)
dp = [[0] * (n + 1) for _ in range(m + 1)]

for i in range(1, m + 1):
    for j in range(1, n + 1):
        if a[i - 1] == b[j - 1]:
            dp[i][j] = dp[i - 1][j - 1] + 1
        else:
            dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])

print("LCS length:", dp[m][n])
`,
  },
  {
    id: 'fib-memo',
    name: 'Fibonacci (memoized)',
    code: `# Memoized fib — see the memo dict grow and the call stack unwind.
def fib(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]

for i in range(10):
    print(f"fib({i}) = {fib(i)}")
`,
  },
  {
    id: 'two-pointer',
    name: 'Two-pointer sum',
    code: `# Two-sum in a sorted array using two pointers.
arr = [1, 3, 4, 7, 11, 15, 20, 23]
target = 18

left, right = 0, len(arr) - 1
while left < right:
    s = arr[left] + arr[right]
    if s == target:
        print(f"found: arr[{left}] + arr[{right}] = {arr[left]} + {arr[right]}")
        break
    elif s < target:
        left += 1
    else:
        right -= 1
`,
  },
]

export const DEFAULT_CODE = CODE_PRESETS[0].code
