import { useMemo, useState } from 'react'
import type { SortAlgorithm } from '../types'
import { useStepPlayer } from '../hooks/useStepPlayer'
import { PlaybackControls } from './PlaybackControls'
import { AlgorithmCodePane } from './AlgorithmCodePane'
import { ArrayCells } from './ArrayCells'
import { ArrayBars } from './ArrayBars'
import { Shuffle, RefreshCw, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import clsx from 'clsx'

type Props = {
  algorithm: SortAlgorithm
}

function randomArray(n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10)
}

export function SortingVisualizer({ algorithm }: Props) {
  const [size, setSize] = useState(15)
  const [seed, setSeed] = useState(0)
  const [input, setInput] = useState<number[]>(() => randomArray(15))
  const [codeCollapsed, setCodeCollapsed] = useState(false)
  const [viewMode, setViewMode] = useState<'cells' | 'bars'>('cells')

  const steps = useMemo(() => algorithm.generate(input), [algorithm, input])
  const player = useStepPlayer(steps, 250)
  const current = player.current ?? { array: input }

  function newRandom() {
    setInput(randomArray(size))
    setSeed((s) => s + 1)
  }

  function resize(n: number) {
    setSize(n)
    setInput(randomArray(n))
    setSeed((s) => s + 1)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden" key={seed}>
      <div className="px-6 py-4 border-b border-border-subtle">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">{algorithm.name}</h2>
            <p className="text-sm text-text-muted mt-1 max-w-3xl">{algorithm.description}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-text-muted font-mono">
            <span>
              Time: <span className="text-text">{algorithm.complexity.time}</span>
            </span>
            <span>
              Space: <span className="text-text">{algorithm.complexity.space}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={newRandom}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded bg-bg-hover hover:bg-border-subtle text-text"
          >
            <Shuffle className="w-3.5 h-3.5" />
            New random
          </button>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <RefreshCw className="w-3.5 h-3.5" />
            Size
            <input
              type="range"
              min={5}
              max={60}
              value={size}
              onChange={(e) => resize(Number(e.target.value))}
              className="w-32 accent-accent"
            />
            <span className="font-mono text-text w-6 text-right">{size}</span>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-1 text-xs rounded bg-bg-hover p-0.5">
            <button
              onClick={() => setViewMode('cells')}
              className={clsx(
                'px-3 py-1 rounded transition-colors',
                viewMode === 'cells'
                  ? 'bg-bg text-text shadow-sm'
                  : 'text-text-muted hover:text-text',
              )}
            >
              Array
            </button>
            <button
              onClick={() => setViewMode('bars')}
              className={clsx(
                'px-3 py-1 rounded transition-colors',
                viewMode === 'bars'
                  ? 'bg-bg text-text shadow-sm'
                  : 'text-text-muted hover:text-text',
              )}
            >
              Bars
            </button>
          </div>
          <button
            onClick={() => setCodeCollapsed((c) => !c)}
            className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded bg-bg-hover hover:bg-border-subtle text-text-muted hover:text-text"
            title={codeCollapsed ? 'Show code' : 'Hide code'}
          >
            {codeCollapsed ? (
              <>
                <PanelLeftOpen className="w-3.5 h-3.5" />
                Show code
              </>
            ) : (
              <>
                <PanelLeftClose className="w-3.5 h-3.5" />
                Hide code
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {!codeCollapsed && (
          <div className="w-[420px] shrink-0 border-r border-border-subtle flex flex-col overflow-hidden">
            <AlgorithmCodePane pseudocode={algorithm.pseudocode} code={algorithm.code} highlightLine={current?.line ?? null} />
          </div>
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            {viewMode === 'cells' ? <ArrayCells step={current} /> : <ArrayBars step={current} />}
          </div>
          <div className="px-6 pt-2 pb-3 flex items-center gap-4 text-[11px] font-mono text-text-dim border-t border-border-subtle/50">
            <LegendSwatch color="bg-viz-compare" label="compare" />
            <LegendSwatch color="bg-viz-swap" label="swap" />
            <LegendSwatch color="bg-viz-pivot" label="pivot" />
            <LegendSwatch color="bg-viz-sorted" label="sorted" />
            {current.message && (
              <div className="ml-auto text-text-muted">
                <span className="text-text-dim">→</span> {current.message}
              </div>
            )}
          </div>
        </div>
      </div>

      <PlaybackControls
        playing={player.playing}
        onTogglePlay={player.togglePlay}
        onStepForward={player.stepForward}
        onStepBack={player.stepBack}
        onJumpStart={player.jumpStart}
        onJumpEnd={player.jumpEnd}
        onReset={newRandom}
        step={player.step}
        total={player.total}
        speed={player.speed}
        onSpeedChange={player.setSpeed}
      />
    </div>
  )
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={clsx('inline-block w-3 h-3 rounded-sm', color)} />
      {label}
    </span>
  )
}
