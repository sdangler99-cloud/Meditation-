import { Link } from 'react-router-dom'
import { Wind } from 'lucide-react'
import { sessionsById } from '../data/content'
import { breathingPatterns } from '../data/breathing'
import { SessionCard } from '../components/SessionCard'
import { gradientClasses } from '../lib/gradients'
import { useLibrary } from '../state/LibraryContext'

export function Favorites() {
  const { favorites } = useLibrary()
  const favSessions = favorites.map((id) => sessionsById.get(id)).filter((s): s is NonNullable<typeof s> => !!s)
  const favBreathing = favorites
    .map((id) => breathingPatterns.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)

  const isEmpty = favSessions.length === 0 && favBreathing.length === 0

  return (
    <div className="pt-8 sm:pt-10">
      <div className="px-4 sm:px-6">
        <h1 className="font-serif text-2xl text-mist-100">Favorites</h1>
        <p className="mt-1 text-sm text-mist-300/70">Everything you’ve saved to come back to.</p>
      </div>

      {isEmpty ? (
        <div className="mt-16 flex flex-col items-center gap-2 px-4 text-center">
          <p className="text-mist-300/60">Nothing saved yet.</p>
          <Link to="/library" className="text-sm text-lavender-400">
            Explore the library
          </Link>
        </div>
      ) : (
        <>
          {favBreathing.length > 0 && (
            <div className="mt-6 grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:px-6 md:grid-cols-4">
              {favBreathing.map((p) => (
                <Link
                  key={p.id}
                  to={`/breathing/${p.id}`}
                  className="overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/5 transition hover:ring-white/20"
                >
                  <div className={`flex h-24 items-end bg-gradient-to-br ${gradientClasses[p.gradient]} p-3`}>
                    <Wind className="ml-auto h-5 w-5 text-white/80" strokeWidth={1.75} />
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-mist-100">{p.title}</p>
                    <p className="mt-0.5 truncate text-xs text-mist-300/70">Breathing Exercise</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:px-6 md:grid-cols-4">
            {favSessions.map((s) => (
              <SessionCard key={s.id} session={s} fluid />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
