import { useState } from 'react'
import { ChevronLeft, ChevronRight, Shuffle } from 'lucide-react'
import { affirmationCards, affirmationCategories } from '../data/affirmations'

const CATEGORY_GRADIENT: Record<string, string> = {
  Confidence: 'from-orange-500 to-red-400',
  'Self-Love': 'from-rose-400 to-pink-400',
  Abundance: 'from-amber-500 to-yellow-400',
  Calm: 'from-sky-500 to-cyan-400',
  Motivation: 'from-violet-500 to-fuchsia-400',
  Healing: 'from-emerald-500 to-teal-400',
}

export function Affirmations() {
  const [category, setCategory] = useState<string>('All')
  const cards = category === 'All' ? affirmationCards : affirmationCards.filter((c) => c.category === category)
  const [index, setIndex] = useState(0)
  const card = cards[index % cards.length]

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + cards.length) % cards.length)

  return (
    <div className="pt-8 sm:pt-10">
      <div className="px-4 sm:px-6">
        <h1 className="font-serif text-2xl text-mist-100">Daily Affirmations</h1>
        <p className="mt-1 text-sm text-mist-300/70">A gentle reminder for however you’re feeling today.</p>

        <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
          {['All', ...affirmationCategories].map((c) => (
            <button
              key={c}
              onClick={() => {
                setCategory(c)
                setIndex(0)
              }}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition ${
                category === c ? 'bg-lavender-500 text-white' : 'bg-ink-800 text-mist-300/70 hover:text-mist-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center px-4 sm:px-6">
        <div
          className={`flex min-h-56 w-full max-w-lg flex-col items-center justify-center gap-4 rounded-3xl bg-gradient-to-br p-8 text-center shadow-xl ${
            CATEGORY_GRADIENT[card.category] ?? 'from-violet-500 to-fuchsia-400'
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-widest text-white/70">{card.category}</p>
          <p className="font-serif text-2xl leading-snug text-white sm:text-3xl">“{card.text}”</p>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => go(-1)}
            className="rounded-full bg-ink-800 p-2.5 text-mist-100 ring-1 ring-white/10 transition hover:ring-white/30"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIndex(Math.floor(Math.random() * cards.length))}
            className="flex items-center gap-2 rounded-full bg-ink-800 px-4 py-2.5 text-sm text-mist-100 ring-1 ring-white/10 transition hover:ring-white/30"
          >
            <Shuffle className="h-4 w-4" /> Shuffle
          </button>
          <button
            onClick={() => go(1)}
            className="rounded-full bg-ink-800 p-2.5 text-mist-100 ring-1 ring-white/10 transition hover:ring-white/30"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-xs text-mist-300/50">
          {(index % cards.length) + 1} of {cards.length}
        </p>
      </div>
    </div>
  )
}
