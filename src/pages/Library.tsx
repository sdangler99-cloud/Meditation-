import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { allSessions, contentTypeLabels } from '../data/content'
import { SessionCard } from '../components/SessionCard'
import type { ContentType } from '../data/types'

const TYPE_TABS: (ContentType | 'all')[] = ['all', 'meditation', 'sleep', 'sound', 'music']

export function Library() {
  const [params, setParams] = useSearchParams()
  const activeType = (params.get('type') as ContentType | 'all') || 'all'
  const activeCategory = params.get('category') || ''
  const [query, setQuery] = useState('')

  const categories = useMemo(() => {
    const scoped = activeType === 'all' ? allSessions : allSessions.filter((s) => s.type === activeType)
    return Array.from(new Set(scoped.map((s) => s.category))).sort()
  }, [activeType])

  const filtered = useMemo(() => {
    return allSessions.filter((s) => {
      if (activeType !== 'all' && s.type !== activeType) return false
      if (activeCategory && s.category !== activeCategory) return false
      if (query && !`${s.title} ${s.description} ${s.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
        return false
      return true
    })
  }, [activeType, activeCategory, query])

  const setType = (t: ContentType | 'all') => {
    const next = new URLSearchParams(params)
    if (t === 'all') next.delete('type')
    else next.set('type', t)
    next.delete('category')
    setParams(next, { replace: true })
  }

  const setCategory = (c: string) => {
    const next = new URLSearchParams(params)
    if (!c) next.delete('category')
    else next.set('category', c)
    setParams(next, { replace: true })
  }

  return (
    <div className="pt-8 sm:pt-10">
      <div className="px-4 sm:px-6">
        <h1 className="font-serif text-2xl text-mist-100">Library</h1>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-300/50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search meditations, sounds, stories…"
            className="w-full rounded-xl border border-white/10 bg-ink-800 py-2.5 pl-9 pr-3 text-sm text-mist-100 placeholder:text-mist-300/40 focus:border-lavender-400 focus:outline-none"
          />
        </div>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          {TYPE_TABS.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition ${
                activeType === t
                  ? 'bg-lavender-500 text-white'
                  : 'bg-ink-800 text-mist-300/70 hover:text-mist-100'
              }`}
            >
              {t === 'all' ? 'All' : contentTypeLabels[t]}
            </button>
          ))}
        </div>

        {categories.length > 1 && (
          <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setCategory('')}
              className={`shrink-0 rounded-full px-3 py-1 text-xs transition ${
                !activeCategory ? 'text-lavender-400' : 'text-mist-300/50 hover:text-mist-100'
              }`}
            >
              All categories
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs transition ${
                  activeCategory === c ? 'text-lavender-400' : 'text-mist-300/50 hover:text-mist-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:px-6 md:grid-cols-4 lg:grid-cols-5">
        {filtered.map((s) => (
          <SessionCard key={s.id} session={s} fluid />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-12 text-center text-sm text-mist-300/60">
            Nothing matches yet — try a different search or category.
          </p>
        )}
      </div>
    </div>
  )
}
