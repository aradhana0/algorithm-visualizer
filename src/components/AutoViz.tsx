import { Fragment } from 'react'
import clsx from 'clsx'

type Props = {
  name: string
  value: unknown
  changed?: boolean
}

const MAX_NAME_LEN = 60

function safeLabel(v: string, max = MAX_NAME_LEN): string {
  const s = String(v)
  return s.length > max ? s.slice(0, max) + '…' : s
}

// Renders a variable value using the "best" auto-detected visualization
export function AutoViz({ name, value, changed }: Props) {
  const kind = detectKind(value)
  return (
    <div
      className={clsx(
        'border rounded-lg bg-bg-panel p-3 transition-colors',
        changed ? 'border-viz-compare' : 'border-border-subtle',
      )}
    >
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-xs font-mono text-accent break-all">{safeLabel(name)}</span>
        <span className="text-[10px] text-text-dim uppercase tracking-wider">{kind}</span>
      </div>
      {kind === 'array-num' && <NumberArray data={value as number[]} />}
      {kind === 'array-mixed' && <MixedArray data={value as (number | string)[]} />}
      {kind === 'matrix-num' && <NumberMatrix data={value as number[][]} />}
      {kind === 'object' && <ObjectView data={value as Record<string, unknown>} />}
      {kind === 'scalar' && <ScalarView value={value} />}
    </div>
  )
}

function detectKind(v: unknown): 'array-num' | 'array-mixed' | 'matrix-num' | 'object' | 'scalar' {
  if (Array.isArray(v)) {
    if (
      v.length > 0 &&
      v.every((row) => Array.isArray(row)) &&
      (v as unknown[][]).every((row) => row.every((x) => typeof x === 'number'))
    ) {
      return 'matrix-num'
    }
    if (v.every((x) => typeof x === 'number')) return 'array-num'
    return 'array-mixed'
  }
  if (v !== null && typeof v === 'object') return 'object'
  return 'scalar'
}

function NumberArray({ data }: { data: number[] }) {
  const n = data.length
  const cellPx = n <= 12 ? 40 : n <= 20 ? 30 : n <= 32 ? 24 : 18
  const fontPx = n <= 12 ? 13 : n <= 20 ? 11 : 10
  const showIdx = n <= 32
  return (
    <div className="flex flex-wrap gap-1">
      {data.map((v, i) => (
        <div key={i} className="flex flex-col items-center" style={{ width: cellPx }}>
          <div
            className="flex items-center justify-center rounded border border-border-subtle bg-bg text-text font-mono font-semibold"
            style={{ width: cellPx, height: cellPx, fontSize: fontPx }}
          >
            {v}
          </div>
          {showIdx && (
            <div className="text-[9px] text-text-dim font-mono mt-0.5">{i}</div>
          )}
        </div>
      ))}
    </div>
  )
}

function MixedArray({ data }: { data: (number | string)[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {data.map((v, i) => (
        <div
          key={i}
          className="px-2 py-0.5 rounded border border-border-subtle bg-bg text-text font-mono text-xs"
        >
          {String(v)}
        </div>
      ))}
    </div>
  )
}

function NumberMatrix({ data }: { data: number[][] }) {
  // Heatmap: colour intensity by value (min→max range)
  const flat = data.flat()
  const min = Math.min(...flat, 0)
  const max = Math.max(...flat, 1)
  const range = Math.max(max - min, 1)
  const cellPx = data[0].length <= 8 ? 28 : 20
  return (
    <div className="inline-block">
      {data.map((row, r) => (
        <div key={r} className="flex">
          {row.map((v, c) => {
            const t = (v - min) / range
            const alpha = 0.15 + t * 0.6
            return (
              <div
                key={c}
                className="border border-bg flex items-center justify-center font-mono text-[10px] text-text"
                style={{
                  width: cellPx,
                  height: cellPx,
                  backgroundColor: `rgba(139, 92, 246, ${alpha})`,
                }}
                title={`[${r}][${c}]=${v}`}
              >
                {cellPx >= 24 ? v : ''}
              </div>
            )
          })}
        </div>
      ))}
    </div>
  )
}

function ObjectView({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data)
  return (
    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs font-mono">
      {entries.map(([k, v]) => (
        <Fragment key={k}>
          <span className="text-text-dim">{k}:</span>
          <span className="text-text break-all">{formatShort(v)}</span>
        </Fragment>
      ))}
    </div>
  )
}

function ScalarView({ value }: { value: unknown }) {
  return <div className="font-mono text-sm text-text">{formatShort(value)}</div>
}

function formatShort(v: unknown): string {
  if (v === null || v === undefined) return 'None'
  if (typeof v === 'boolean') return v ? 'True' : 'False'
  if (typeof v === 'number' || typeof v === 'string') return JSON.stringify(v)
  try {
    const s = JSON.stringify(v)
    return s.length > 80 ? s.slice(0, 80) + '…' : s
  } catch {
    return String(v)
  }
}
