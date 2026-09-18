import { Play, Pause, SkipBack, SkipForward, RotateCcw, StepForward, StepBack } from 'lucide-react'

type Props = {
  playing: boolean
  onTogglePlay: () => void
  onStepForward: () => void
  onStepBack: () => void
  onJumpStart: () => void
  onJumpEnd: () => void
  onReset: () => void
  step: number
  total: number
  speed: number
  onSpeedChange: (speed: number) => void
}

export function PlaybackControls({
  playing,
  onTogglePlay,
  onStepForward,
  onStepBack,
  onJumpStart,
  onJumpEnd,
  onReset,
  step,
  total,
  speed,
  onSpeedChange,
}: Props) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-t border-border-subtle bg-bg-panel">
      <button
        onClick={onReset}
        className="p-2 rounded hover:bg-bg-hover text-text-muted hover:text-text"
        title="Reset (new input)"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <button
        onClick={onJumpStart}
        className="p-2 rounded hover:bg-bg-hover text-text-muted hover:text-text"
        title="Jump to start"
      >
        <SkipBack className="w-4 h-4" />
      </button>
      <button
        onClick={onStepBack}
        className="p-2 rounded hover:bg-bg-hover text-text-muted hover:text-text"
        title="Step back"
      >
        <StepBack className="w-4 h-4" />
      </button>
      <button
        onClick={onTogglePlay}
        className="p-2 rounded bg-accent text-white hover:bg-accent-hover"
        title={playing ? 'Pause' : 'Play'}
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <button
        onClick={onStepForward}
        className="p-2 rounded hover:bg-bg-hover text-text-muted hover:text-text"
        title="Step forward"
      >
        <StepForward className="w-4 h-4" />
      </button>
      <button
        onClick={onJumpEnd}
        className="p-2 rounded hover:bg-bg-hover text-text-muted hover:text-text"
        title="Jump to end"
      >
        <SkipForward className="w-4 h-4" />
      </button>

      <div className="ml-4 text-xs text-text-muted font-mono min-w-[80px]">
        Step {step} / {Math.max(0, total - 1)}
      </div>

      <div className="flex-1 flex items-center gap-2 mx-4">
        <input
          type="range"
          min={0}
          max={Math.max(0, total - 1)}
          value={step}
          onChange={(e) => {
            const v = Number(e.target.value)
            const diff = v - step
            if (diff > 0) for (let i = 0; i < diff; i++) onStepForward()
            else if (diff < 0) for (let i = 0; i < -diff; i++) onStepBack()
          }}
          className="w-full accent-accent"
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <span>Speed</span>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="bg-bg text-text border border-border-subtle rounded px-2 py-1 text-xs"
        >
          <option value={2}>0.5x</option>
          <option value={1}>1x</option>
          <option value={0.5}>2x</option>
          <option value={0.25}>4x</option>
          <option value={0.1}>10x</option>
        </select>
      </div>
    </div>
  )
}
