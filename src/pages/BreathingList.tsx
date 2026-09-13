import { Link } from 'react-router-dom'
import { Wind } from 'lucide-react'
import { breathingPatterns } from '../data/breathing'
import { gradientClasses } from '../lib/gradients'

export function BreathingList() {
  return (
    <div className="pt-8 sm:pt-10">
      <div className="px-4 sm:px-6">
        <h1 className="font-serif text-2xl text-mist-100">Breathing Exercises</h1>
        <p className="mt-1 text-sm text-mist-300/70">
          Guided breath patterns to calm the nervous system, sharpen focus, or wind down.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
        {breathingPatterns.map((p) => (
          <Link
            key={p.id}
            to={`/breathing/${p.id}`}
            className="overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/5 transition hover:ring-white/20"
          >
            <div className={`flex h-24 items-center justify-between bg-gradient-to-br ${gradientClasses[p.gradient]} p-4`}>
              <div>
                <p className="font-serif text-lg text-white">{p.title}</p>
                <p className="text-xs text-white/70">
                  {p.inhale}-{p.holdIn}-{p.exhale}-{p.holdOut} · {p.cycles} cycles
                </p>
              </div>
              <Wind className="h-6 w-6 shrink-0 text-white/80" strokeWidth={1.5} />
            </div>
            <div className="p-4">
              <p className="text-sm text-mist-300/80">{p.benefit}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
