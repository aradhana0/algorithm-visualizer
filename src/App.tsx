import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { SortingVisualizer } from './components/SortingVisualizer'
import { LinkedListVisualizer } from './components/LinkedListVisualizer'
import { DataStructureVisualizer } from './components/DataStructureVisualizer'
import { SearchVisualizer } from './components/SearchVisualizer'
import { GraphVisualizer } from './components/GraphVisualizer'
import { TreeVisualizer } from './components/TreeVisualizer'
import { DPVisualizer } from './components/DPVisualizer'
import { BacktrackingVisualizer } from './components/BacktrackingVisualizer'
import { BacktrackingSetVisualizer } from './components/BacktrackingSetVisualizer'
import { ArrayPatternVisualizer } from './components/ArrayPatternVisualizer'
import { WordSearchVisualizer } from './components/WordSearchVisualizer'
import { CustomCodeVisualizer } from './components/CustomCodeVisualizer'
import { Placeholder } from './components/Placeholder'
import { registry, CUSTOM_CODE_ID } from './algorithms/registry'

function App() {
  const [activeId, setActiveId] = useState<string>('bubble-sort')
  const entry = registry.find((e) => e.id === activeId) ?? registry[0]

  return (
    <div className="flex h-full">
      <Sidebar activeId={activeId} onSelect={setActiveId} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {entry.kind === 'sort' && <SortingVisualizer algorithm={entry.algorithm} />}
        {entry.kind === 'linkedlist' && <LinkedListVisualizer algorithm={entry.algorithm} />}
        {entry.kind === 'datastructure' && (
          <DataStructureVisualizer algorithm={entry.algorithm} />
        )}
        {entry.kind === 'search' && <SearchVisualizer algorithm={entry.algorithm} />}
        {entry.kind === 'graph' && <GraphVisualizer algorithm={entry.algorithm} />}
        {entry.kind === 'tree' && <TreeVisualizer algorithm={entry.algorithm} />}
        {entry.kind === 'dp' && <DPVisualizer algorithm={entry.algorithm} />}
        {entry.kind === 'backtracking' && (
          <BacktrackingVisualizer algorithm={entry.algorithm} />
        )}
        {entry.kind === 'backtrackingset' && (
          <BacktrackingSetVisualizer algorithm={entry.algorithm} />
        )}
        {entry.kind === 'arraypattern' && (
          <ArrayPatternVisualizer algorithm={entry.algorithm} />
        )}
        {entry.kind === 'wordsearch' && (
          <WordSearchVisualizer algorithm={entry.algorithm} />
        )}
        {entry.kind === 'custom' && entry.id === CUSTOM_CODE_ID && <CustomCodeVisualizer />}
        {entry.kind === 'placeholder' && <Placeholder name={entry.name} />}
      </main>
    </div>
  )
}

export default App
