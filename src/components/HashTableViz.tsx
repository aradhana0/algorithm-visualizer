import type { HashTableStep } from '../types'
import clsx from 'clsx'
import { ArrowRight } from 'lucide-react'

export function HashTableViz({ step }: { step: HashTableStep }) {
  return (
    <div className="w-full h-full overflow-auto p-6 flex items-start justify-center">
      <div className="flex items-start gap-8">
        {/* Hash computation panel on the left */}
        <div className="flex flex-col items-center gap-3 min-w-[180px]">
          <div className="text-[10px] uppercase tracking-wider text-text-dim">hash</div>
          {step.hashKey !== undefined ? (
            <div className="flex flex-col items-center gap-2 border border-border-subtle rounded-lg bg-bg-panel px-4 py-3">
              <div className="font-mono text-sm">
                <span className="text-text-dim">key = </span>
                <span className="text-accent">"{step.hashKey}"</span>
              </div>
              <div className="text-text-dim text-xs">↓</div>
              <div className="font-mono text-xs text-text-dim">sum(ord(c)) % 7</div>
              {step.hashValue !== undefined && (
                <>
                  <div className="text-text-dim text-xs">↓</div>
                  <div className="font-mono text-lg text-viz-compare">bucket {step.hashValue}</div>
                </>
              )}
            </div>
          ) : (
            <div className="text-text-dim text-xs italic">no active key</div>
          )}
        </div>

        <ArrowRight className="w-5 h-5 text-text-dim mt-24" />

        {/* Buckets */}
        <div className="flex flex-col gap-1">
          <div className="text-[10px] uppercase tracking-wider text-text-dim mb-1">buckets</div>
          {step.buckets.map((bucket, bIdx) => {
            const isTarget = step.targetBucket === bIdx
            return (
              <div
                key={bIdx}
                className={clsx(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 border transition-colors',
                  isTarget ? 'border-viz-compare bg-viz-compare/5' : 'border-border-subtle bg-bg-panel',
                )}
              >
                <div
                  className={clsx(
                    'font-mono text-xs w-6 text-right',
                    isTarget ? 'text-viz-compare font-bold' : 'text-text-dim',
                  )}
                >
                  {bIdx}
                </div>
                <div className="text-text-dim">│</div>
                {bucket.length === 0 ? (
                  <div className="text-text-dim text-xs italic">empty</div>
                ) : (
                  <div className="flex items-center gap-1">
                    {bucket.map((entry, i) => {
                      const isHl =
                        step.highlightEntry?.bucket === bIdx && step.highlightEntry?.index === i
                      return (
                        <div key={i} className="flex items-center gap-1">
                          {i > 0 && <span className="text-text-dim text-xs">→</span>}
                          <div
                            className={clsx(
                              'flex items-center rounded border px-2 py-0.5 text-xs font-mono transition-colors',
                              isHl
                                ? 'bg-viz-swap/20 border-viz-swap text-viz-swap'
                                : 'bg-bg border-border-subtle text-text',
                            )}
                          >
                            <span className="text-accent">{entry.key}</span>
                            <span className="text-text-dim mx-1">:</span>
                            <span>{entry.value}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
