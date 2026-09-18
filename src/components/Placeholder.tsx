import { Construction } from 'lucide-react'

export function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
      <Construction className="w-12 h-12 mb-4 text-text-dim" />
      <h2 className="text-lg font-semibold text-text">{name}</h2>
      <p className="mt-2 text-sm">Coming next. Sorting visualizers and custom Python code are live now.</p>
    </div>
  )
}
