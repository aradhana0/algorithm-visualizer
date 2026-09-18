import type { DPStep } from '../types'
import clsx from 'clsx'

export function DPTableViz({ step }: { step: DPStep }) {
  const readSet = new Set((step.readCells ?? []).map(([r, c]) => `${r},${c}`))
  const current = step.currentCell
  const final = step.finalCell
  const isCurrent = (r: number, c: number) => current && current[0] === r && current[1] === c
  const isFinal = (r: number, c: number) => final && final[0] === r && final[1] === c

  const rows = step.table
  const cellH = rows.length === 1 ? 44 : 34
  const cellW = rows.length === 1 ? 48 : 38

  return (
    <div className="w-full h-full overflow-auto p-4 flex flex-col items-center gap-4">
      <table className="border-separate" style={{ borderSpacing: 3 }}>
        <thead>
          <tr>
            {step.rowLabels && (
              <th
                className="text-[10px] text-text-dim font-normal align-bottom pr-2 pb-1"
                style={{ height: cellH }}
              >
                {step.rowHeader ?? ''}
              </th>
            )}
            {step.colLabels
              ? step.colLabels.map((cl, i) => (
                  <th
                    key={i}
                    className="text-[10px] font-mono text-text-dim font-normal"
                    style={{ width: cellW, height: cellH * 0.5 }}
                  >
                    {i === 0 && step.colHeader && (
                      <div className="text-[9px] text-text-dim mb-0.5">{step.colHeader}</div>
                    )}
                    {cl}
                  </th>
                ))
              : rows[0].map((_, i) => (
                  <th
                    key={i}
                    className="text-[10px] font-mono text-text-dim font-normal"
                    style={{ width: cellW }}
                  >
                    {i}
                  </th>
                ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {step.rowLabels && (
                <td
                  className="text-[10px] font-mono text-text-dim text-right pr-2"
                  style={{ height: cellH }}
                >
                  {step.rowLabels[r] ?? r}
                </td>
              )}
              {row.map((v, c) => {
                const cur = isCurrent(r, c)
                const fin = isFinal(r, c)
                const read = readSet.has(`${r},${c}`)
                const empty = v === null || v === undefined
                return (
                  <td key={c} className="p-0">
                    <div
                      className={clsx(
                        'flex items-center justify-center rounded border font-mono text-sm transition-colors',
                        fin && 'bg-viz-sorted/25 border-viz-sorted text-viz-sorted font-bold',
                        !fin && cur && 'bg-viz-compare/20 border-viz-compare text-viz-compare font-semibold',
                        !fin && !cur && read && 'bg-viz-pivot/15 border-viz-pivot/60 text-viz-pivot',
                        !fin && !cur && !read && !empty && 'bg-bg-panel border-border-subtle text-text',
                        !fin && !cur && !read && empty && 'bg-bg border-border-subtle/50 text-text-dim',
                      )}
                      style={{ width: cellW, height: cellH }}
                    >
                      {empty ? '·' : v}
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {step.formula && (
        <div className="text-xs font-mono text-text-muted bg-bg-panel border border-border-subtle rounded px-3 py-1.5">
          {step.formula}
        </div>
      )}
      <div className="flex gap-3 text-[10px] font-mono text-text-dim">
        <LegendSwatch color="bg-viz-compare" label="current" />
        <LegendSwatch color="bg-viz-pivot" label="reading" />
        <LegendSwatch color="bg-viz-sorted" label="answer" />
      </div>
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
