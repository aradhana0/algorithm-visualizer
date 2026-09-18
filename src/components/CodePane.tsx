import { useEffect, useRef } from 'react'
import clsx from 'clsx'

type Props = {
  code: string
  highlightLine?: number | null
  language?: string
}

export function CodePane({ code, highlightLine }: Props) {
  const lines = code.split('\n')
  const activeRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [highlightLine])

  return (
    <div className="h-full overflow-auto font-mono text-[13px] leading-6 bg-bg">
      <pre className="py-3">
        {lines.map((line, i) => {
          const ln = i + 1
          const active = highlightLine === ln
          return (
            <div
              key={i}
              ref={active ? activeRef : null}
              className={clsx(
                'flex px-2 whitespace-pre',
                active && 'bg-accent/15 border-l-2 border-accent',
                !active && 'border-l-2 border-transparent',
              )}
            >
              <span className="w-8 pr-3 text-right text-text-dim select-none">{ln}</span>
              <code className={clsx(active ? 'text-text' : 'text-text-muted')}>
                {line || ' '}
              </code>
            </div>
          )
        })}
      </pre>
    </div>
  )
}
