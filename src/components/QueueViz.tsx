import type { QueueStep } from '../types'
import clsx from 'clsx'
import { ArrowRight, ArrowLeft } from 'lucide-react'

export function QueueViz({ step }: { step: QueueStep }) {
  const items = step.queue
  const cellW = 62
  const cellH = 46

  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-8 text-[11px] font-mono">
          <span className="text-viz-swap flex items-center gap-1">
            <ArrowRight className="w-3 h-3" /> dequeue (front)
          </span>
          <span className="text-viz-sorted flex items-center gap-1">
            enqueue (back) <ArrowLeft className="w-3 h-3" />
          </span>
        </div>
        <div className="flex items-center">
          <div className="text-[10px] uppercase tracking-wider text-text-dim mr-3">front</div>
          <div className="flex items-stretch">
            {items.length === 0 ? (
              <div
                className="flex items-center justify-center text-text-dim text-sm italic border border-dashed border-border-subtle rounded"
                style={{ width: cellW * 3, height: cellH }}
              >
                empty
              </div>
            ) : (
              items.map((v, i) => {
                const isFront = i === 0
                const isBack = i === items.length - 1
                const isHighlighted = step.highlightIdx === i
                const isEnq = step.operation === 'enqueue' && isHighlighted
                const isDeq = step.operation === 'dequeue' && isHighlighted
                return (
                  <div
                    key={i}
                    className={clsx(
                      'flex items-center justify-center font-mono font-semibold text-sm border transition-colors relative',
                      isEnq && 'bg-viz-sorted/20 border-viz-sorted text-viz-sorted',
                      isDeq && 'bg-viz-swap/20 border-viz-swap text-viz-swap',
                      !isEnq && !isDeq && isHighlighted && 'bg-viz-compare/20 border-viz-compare text-viz-compare',
                      !isEnq && !isDeq && !isHighlighted && 'bg-bg-panel border-border-subtle text-text',
                      i === 0 && 'rounded-l-md',
                      i === items.length - 1 && 'rounded-r-md',
                      i > 0 && '-ml-px',
                    )}
                    style={{ width: cellW, height: cellH }}
                  >
                    {v}
                    {isFront && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent">
                        front
                      </span>
                    )}
                    {isBack && items.length > 1 && (
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent">
                        back
                      </span>
                    )}
                    {isFront && isBack && items.length === 1 && (
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-accent">
                        (only)
                      </span>
                    )}
                  </div>
                )
              })
            )}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-text-dim ml-3">back</div>
        </div>
        {step.operation === 'enqueue' && step.operand !== undefined && (
          <div className="text-xs font-mono text-viz-sorted flex items-center gap-1">
            enqueue({step.operand})
          </div>
        )}
        {step.operation === 'dequeue' && step.operand !== undefined && (
          <div className="text-xs font-mono text-viz-swap flex items-center gap-1">
            dequeue() → {step.operand}
          </div>
        )}
      </div>
    </div>
  )
}
