import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import type { Session } from '../data/types'
import { gradientClasses } from '../lib/gradients'
import { typeIcons } from '../lib/icons'
import { useLibrary } from '../state/LibraryContext'

export function SessionCard({
  session,
  wide = false,
  fluid = false,
}: {
  session: Session
  wide?: boolean
  /** Fills the width of its grid/flex cell instead of using a fixed scroll-row width. */
  fluid?: boolean
}) {
  const { isFavorite, toggleFavorite } = useLibrary()
  const Icon = typeIcons[session.type]
  const fav = isFavorite(session.id)

  return (
    <Link
      to={session.type === 'breathing' ? `/breathing/${session.id}` : `/session/${session.id}`}
      className={`group relative overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/5 transition hover:ring-white/20 ${
        fluid ? 'w-full' : `shrink-0 ${wide ? 'w-64' : 'w-40'}`
      }`}
    >
      <div
        className={`relative flex ${wide || fluid ? 'h-32' : 'h-24'} items-end bg-gradient-to-br ${gradientClasses[session.gradient]} p-3`}
      >
        <Icon className="absolute right-3 top-3 h-5 w-5 text-white/80" strokeWidth={1.75} />
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(session.id)
          }}
          className="absolute left-3 top-3 rounded-full bg-black/20 p-1.5 backdrop-blur-sm transition hover:bg-black/40"
          aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`h-3.5 w-3.5 ${fav ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
        </button>
      </div>
      <div className="p-3">
        <p className="truncate text-sm font-medium text-mist-100">{session.title}</p>
        <p className="mt-0.5 truncate text-xs text-mist-300/70">
          {session.durationMin} min · {session.narrator}
        </p>
      </div>
    </Link>
  )
}
