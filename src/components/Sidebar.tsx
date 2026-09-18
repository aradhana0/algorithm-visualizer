import { groupedRegistry } from '../algorithms/registry'
import clsx from 'clsx'
import { Sparkles } from 'lucide-react'

type Props = {
  activeId: string
  onSelect: (id: string) => void
}

export function Sidebar({ activeId, onSelect }: Props) {
  const groups = groupedRegistry()
  return (
    <aside className="w-64 shrink-0 border-r border-border-subtle bg-bg-panel flex flex-col">
      <div className="px-4 py-4 border-b border-border-subtle flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-accent" />
        <div>
          <h1 className="text-sm font-semibold text-text">Algorithm Visualizer</h1>
          <p className="text-[11px] text-text-dim">Interview-ready algorithms + Python trace</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {groups.map(({ category, entries }) => (
          <div key={category} className="mb-3">
            <div className="px-4 py-1 text-[10px] uppercase tracking-wider text-text-dim">
              {category}
            </div>
            {entries.map((entry) => {
              const disabled = entry.kind === 'placeholder'
              const active = entry.id === activeId
              return (
                <button
                  key={entry.id}
                  disabled={disabled}
                  onClick={() => onSelect(entry.id)}
                  className={clsx(
                    'w-full text-left px-4 py-1.5 text-sm flex items-center justify-between',
                    active
                      ? 'bg-accent/15 text-accent border-l-2 border-accent'
                      : 'text-text-muted hover:bg-bg-hover hover:text-text',
                    disabled && 'opacity-40 cursor-not-allowed hover:bg-transparent',
                  )}
                >
                  <span>{entry.name}</span>
                  {disabled && (
                    <span className="text-[9px] uppercase tracking-wider text-text-dim">soon</span>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
