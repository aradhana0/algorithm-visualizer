import { useMemo, useState } from 'react'
import type { WordSearchAlgorithm } from '../types'
import { useStepPlayer } from '../hooks/useStepPlayer'
import { PlaybackControls } from './PlaybackControls'
import { AlgorithmCodePane } from './AlgorithmCodePane'
import { WordSearchViz } from './WordSearchViz'
import { PanelLeftClose, PanelLeftOpen, RotateCcw } from 'lucide-react'

type Props = { algorithm: WordSearchAlgorithm }

export function WordSearchVisualizer({ algorithm }: Props) {
  const [seed, setSeed] = useState(0)
  const [codeCollapsed, setCodeCollapsed] = useState(false)
  const steps = useMemo(() => algorithm.generate(), [algorithm, seed])
  const player = useStepPlayer(steps, 300)
  const current = player.current ?? steps[0]

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-border-subtle">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text">{algorithm.name}</h2>
            <p className="text-sm text-text-muted mt-1 max-w-3xl">{algorithm.description}</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-text-muted font-mono">
            <span>Time: <span className="text-text">{algorithm.complexity.time}</span></span>
            <span>Space: <span className="text-text">{algorithm.complexity.space}</span></span>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button onClick={() => setSeed((s) => s + 1)} className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded bg-bg-hover hover:bg-border-subtle text-text">
            <RotateCcw className="w-3.5 h-3.5" /> Restart
          </button>
          <div className="flex-1" />
          <button onClick={() => setCodeCollapsed((c) => !c)} className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded bg-bg-hover hover:bg-border-subtle text-text-muted hover:text-text">
            {codeCollapsed ? (<><PanelLeftOpen className="w-3.5 h-3.5" /> Show code</>) : (<><PanelLeftClose className="w-3.5 h-3.5" /> Hide code</>)}
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
            {current && <WordSearchViz step={current} />}
          </div>
          {current?.message && (
            <div className="px-6 py-2 text-xs font-mono text-text-muted border-t border-border-subtle/50">
              <span className="text-text-dim">→</span> {current.message}
            </div>
          )}
        </div>
      </div>
      <PlaybackControls playing={player.playing} onTogglePlay={player.togglePlay} onStepForward={player.stepForward} onStepBack={player.stepBack} onJumpStart={player.jumpStart} onJumpEnd={player.jumpEnd} onReset={() => setSeed((s) => s + 1)} step={player.step} total={player.total} speed={player.speed} onSpeedChange={player.setSpeed} />
    </div>
  )
}
