import type { BacktrackingSetStep } from '../types'
import clsx from 'clsx'

export function BacktrackingSetViz({ step }: { step: BacktrackingSetStep }) {
  return (
    <div className="w-full h-full flex overflow-hidden">
      <div className="flex-1 overflow-auto p-6 flex flex-col items-start gap-6">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-text-dim mb-2">candidates</div>
          <div className="flex gap-1">
            {step.candidates.map((v, i) => {
              const isActive = step.activeIndex === i
              const isUsed = step.used?.[i]
              return (
                <div
                  key={i}
                  className={clsx(
                    'w-11 h-11 flex items-center justify-center rounded border font-mono font-semibold text-sm',
                    isActive && 'bg-viz-compare/20 border-viz-compare text-viz-compare',
                    !isActive && isUsed && 'bg-viz-pivot/15 border-viz-pivot text-viz-pivot opacity-60',
                    !isActive && !isUsed && 'bg-bg-panel border-border-subtle text-text',
                  )}
                >
                  {v}
                </div>
              )
            })}
          </div>
        </div>

        <div className="w-full">
          <div className="text-[10px] uppercase tracking-wider text-text-dim mb-2">current selection</div>
          <div className="min-h-[48px] flex items-center gap-1 border border-dashed border-border-subtle rounded p-2">
            {step.current.length === 0 ? (
              <span className="text-text-dim text-xs italic px-2">[ ]</span>
            ) : (
              step.current.map((v, i) => (
                <div
                  key={i}
                  className="w-10 h-10 flex items-center justify-center rounded bg-viz-sorted/15 border border-viz-sorted text-viz-sorted font-mono font-semibold text-sm"
                >
                  {v}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-full">
          <div className="text-[10px] uppercase tracking-wider text-text-dim mb-2">
            results ({step.results.length})
          </div>
          <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
            {step.results.length === 0 ? (
              <span className="text-text-dim text-xs italic">no solutions yet</span>
            ) : (
              step.results.map((r, i) => (
                <div
                  key={i}
                  className="px-2 py-1 rounded bg-bg-panel border border-border-subtle text-xs font-mono text-text"
                >
                  [{r.join(', ')}]
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="w-[240px] shrink-0 border-l border-border-subtle flex flex-col overflow-hidden bg-bg-panel">
        <div className="px-4 py-2 text-[10px] uppercase tracking-wider text-text-dim border-b border-border-subtle">
          call stack
        </div>
        <div className="p-3 flex flex-col gap-1 max-h-96 overflow-y-auto">
          {(step.callStack ?? []).length === 0 ? (
            <div className="text-xs text-text-dim italic">empty</div>
          ) : (
            step.callStack!
              .slice()
              .reverse()
              .map((c, i) => (
                <div
                  key={i}
                  className="px-2 py-1 rounded bg-bg border border-border-subtle text-xs font-mono text-text-muted break-all"
                >
                  {c}
                </div>
              ))
          )}
        </div>
        {step.action && (
          <div className="mt-auto px-4 py-3 border-t border-border-subtle text-xs font-mono flex items-center justify-between">
            <span className="text-text-dim">action</span>
            <span
              className={clsx(
                'font-semibold',
                step.action === 'record' && 'text-viz-sorted',
                step.action === 'push' && 'text-viz-compare',
                step.action === 'pop' && 'text-viz-swap',
                step.action === 'include' && 'text-viz-sorted',
                step.action === 'exclude' && 'text-text-dim',
              )}
            >
              {step.action}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
