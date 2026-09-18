import { useState } from 'react'
import clsx from 'clsx'
import { CodePane } from './CodePane'

type Props = {
  pseudocode?: string
  code: string
  highlightLine?: number | null
}

// Wraps CodePane with a Pseudo|Python tab toggle. Pseudocode is preferred
// when available so the visualizer stays language-agnostic; users can flip
// to the concrete Python implementation as needed.
export function AlgorithmCodePane({ pseudocode, code, highlightLine }: Props) {
  const hasPseudo = !!pseudocode
  const [tab, setTab] = useState<'pseudo' | 'code'>(hasPseudo ? 'pseudo' : 'code')

  const source = tab === 'pseudo' && pseudocode ? pseudocode : code

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-border-subtle bg-bg-panel">
        <button
          onClick={() => setTab('pseudo')}
          disabled={!hasPseudo}
          className={clsx(
            'px-3 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded transition-colors',
            tab === 'pseudo'
              ? 'bg-bg text-text shadow-sm'
              : 'text-text-muted hover:text-text',
            !hasPseudo && 'opacity-40 cursor-not-allowed',
          )}
        >
          Pseudocode
        </button>
        <button
          onClick={() => setTab('code')}
          className={clsx(
            'px-3 py-0.5 text-[11px] font-mono uppercase tracking-wider rounded transition-colors',
            tab === 'code'
              ? 'bg-bg text-text shadow-sm'
              : 'text-text-muted hover:text-text',
          )}
        >
          Python
        </button>
        {!hasPseudo && (
          <span className="ml-auto text-[10px] text-text-dim italic pr-2">
            pseudocode coming soon
          </span>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <CodePane code={source} highlightLine={highlightLine ?? null} />
      </div>
    </div>
  )
}
