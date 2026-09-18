import type { StackStep } from '../types'
import clsx from 'clsx'
import { ArrowDown, ArrowUp } from 'lucide-react'

export function StackViz({ step }: { step: StackStep }) {
  const items = step.stack
  const topIdx = items.length - 1
  const cellH = 40
  const cellW = 100

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6">
        <div className="text-[10px] uppercase tracking-wider text-text-dim">
          top {items.length ? '↓' : ''}
        </div>
        <div className="relative flex flex-col-reverse items-center" style={{ minHeight: 200 }}>
          {items.length === 0 && (
            <div className="text-text-dim text-sm italic">empty</div>
          )}
          {items.map((v, i) => {
            const isTop = i === topIdx
            const isHighlighted = step.highlightIdx === i
            const isPushOp = step.operation === 'push' && isHighlighted
            const isPopOp = step.operation === 'pop' && isHighlighted
            return (
              <div
                key={i}
                className={clsx(
                  'flex items-center justify-center font-mono font-semibold text-sm rounded border transition-colors',
                  isPushOp && 'bg-viz-sorted/20 border-viz-sorted text-viz-sorted',
                  isPopOp && 'bg-viz-swap/20 border-viz-swap text-viz-swap',
                  !isPushOp && !isPopOp && isHighlighted && 'bg-viz-compare/20 border-viz-compare text-viz-compare',
                  !isPushOp && !isPopOp && !isHighlighted && 'bg-bg-panel border-border-subtle text-text',
                )}
                style={{ width: cellW, height: cellH, marginTop: -1 }}
              >
                {v}
                {isTop && (
                  <span className="absolute right-[-64px] text-[11px] font-mono text-accent flex items-center gap-1">
                    <ArrowDown className="w-3 h-3" /> top
                  </span>
                )}
              </div>
            )
          })}
          <div
            className="border-t-2 border-x-2 border-border-subtle rounded-t-md bg-bg"
            style={{ width: cellW + 16, height: 8, marginTop: 0 }}
          />
        </div>
        <div className="text-[10px] uppercase tracking-wider text-text-dim">bottom</div>
        {step.operation === 'push' && step.operand !== undefined && (
          <OpChip color="text-viz-sorted" label={`push(${step.operand})`} icon="in" />
        )}
        {step.operation === 'pop' && step.operand !== undefined && (
          <OpChip color="text-viz-swap" label={`pop() → ${step.operand}`} icon="out" />
        )}
      </div>
    </div>
  )
}

function OpChip({
  color,
  label,
  icon,
}: {
  color: string
  label: string
  icon: 'in' | 'out'
}) {
  return (
    <div className={clsx('flex items-center gap-1 text-xs font-mono', color)}>
      {icon === 'in' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}
      {label}
    </div>
  )
}
