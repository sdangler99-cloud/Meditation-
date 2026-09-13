import { Link, useParams } from 'react-router-dom'
import { ChevronLeft, CheckCircle2, Circle } from 'lucide-react'
import { courses } from '../data/courses'
import { sessionsById } from '../data/content'
import { gradientClasses } from '../lib/gradients'
import { useLibrary } from '../state/LibraryContext'

export function CourseDetail() {
  const { id } = useParams<{ id: string }>()
  const course = courses.find((c) => c.id === id)
  const { history } = useLibrary()
  const completedIds = new Set(history.map((h) => h.id))

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-mist-300/70">We couldn’t find that course.</p>
        <Link to="/" className="text-sm text-lavender-400">
          Back home
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-8 sm:pt-10">
      <div className="px-4 sm:px-6">
        <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm text-mist-300/70 hover:text-mist-100">
          <ChevronLeft className="h-4 w-4" /> Home
        </Link>
        <div className={`rounded-2xl bg-gradient-to-br p-6 ${gradientClasses[course.gradient]}`}>
          <p className="text-xs font-medium uppercase tracking-wide text-white/70">
            {course.sessionIds.length}-Day Course · {course.category}
          </p>
          <h1 className="mt-2 font-serif text-2xl text-white sm:text-3xl">{course.title}</h1>
          <p className="mt-2 max-w-xl text-sm text-white/85">{course.description}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 px-4 sm:px-6">
        {course.sessionIds.map((sid, i) => {
          const session = sessionsById.get(sid)
          if (!session) return null
          const done = completedIds.has(sid)
          return (
            <Link
              key={`${sid}-${i}`}
              to={`/session/${session.id}`}
              className="flex items-center gap-3 rounded-xl bg-ink-800 p-3 ring-1 ring-white/5 transition hover:ring-white/20"
            >
              {done ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
              ) : (
                <Circle className="h-5 w-5 shrink-0 text-mist-300/40" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs text-mist-300/60">Day {i + 1}</p>
                <p className="truncate text-sm font-medium text-mist-100">{session.title}</p>
              </div>
              <span className="shrink-0 text-xs text-mist-300/60">{session.durationMin} min</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
