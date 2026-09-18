import type { GraphEdge, GraphNode } from '../../types'

export const NODES: GraphNode[] = [
  { id: 'A', label: 'A', x: 300, y: 50 },
  { id: 'B', label: 'B', x: 150, y: 140 },
  { id: 'C', label: 'C', x: 450, y: 140 },
  { id: 'D', label: 'D', x: 80, y: 250 },
  { id: 'E', label: 'E', x: 300, y: 250 },
  { id: 'F', label: 'F', x: 520, y: 250 },
  { id: 'G', label: 'G', x: 300, y: 350 },
]

export const UNWEIGHTED_EDGES: GraphEdge[] = [
  { from: 'A', to: 'B' },
  { from: 'A', to: 'C' },
  { from: 'B', to: 'D' },
  { from: 'B', to: 'E' },
  { from: 'C', to: 'E' },
  { from: 'C', to: 'F' },
  { from: 'E', to: 'G' },
]

export const WEIGHTED_EDGES: GraphEdge[] = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 3 },
  { from: 'B', to: 'D', weight: 5 },
  { from: 'B', to: 'E', weight: 2 },
  { from: 'C', to: 'E', weight: 1 },
  { from: 'C', to: 'F', weight: 6 },
  { from: 'E', to: 'G', weight: 8 },
]

export function neighbors(nodeId: string, edges: GraphEdge[]): Array<{ to: string; weight?: number }> {
  const out: Array<{ to: string; weight?: number }> = []
  for (const e of edges) {
    if (e.from === nodeId) out.push({ to: e.to, weight: e.weight })
    else if (!e.directed && e.to === nodeId) out.push({ to: e.from, weight: e.weight })
  }
  return out
}
