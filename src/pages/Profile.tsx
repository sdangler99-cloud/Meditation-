import { Flame, Clock, CheckCircle2, Heart } from 'lucide-react'
import { useLibrary } from '../state/LibraryContext'

export function Profile() {
  const { streakDays, totalMinutes, sessionsCompleted, favorites, history } = useLibrary()
  const recent = [...history].reverse().slice(0, 10)

  const stats = [
    { label: 'Day Streak', value: streakDays, icon: Flame, color: 'text-orange-400' },
    { label: 'Minutes Practiced', value: totalMinutes, icon: Clock, color: 'text-sky-400' },
    { label: 'Sessions Completed', value: sessionsCompleted, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'Favorites Saved', value: favorites.length, icon: Heart, color: 'text-rose-400' },
  ]

  return (
    <div className="pt-8 sm:pt-10">
      <div className="px-4 sm:px-6">
        <h1 className="font-serif text-2xl text-mist-100">Your Practice</h1>
        <p className="mt-1 text-sm text-mist-300/70">A quiet record of the time you’ve given yourself.</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl bg-ink-800 p-4 ring-1 ring-white/5">
            <Icon className={`h-5 w-5 ${color}`} />
            <p className="mt-3 font-serif text-2xl text-mist-100">{value}</p>
            <p className="mt-0.5 text-xs text-mist-300/60">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 px-4 sm:px-6">
        <h2 className="mb-3 font-serif text-lg text-mist-100">Recent Sessions</h2>
        {recent.length === 0 ? (
          <p className="text-sm text-mist-300/60">
            You haven’t completed a session yet — your history will show up here once you do.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-white/5 overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/5">
            {recent.map((h, i) => (
              <div key={`${h.id}-${h.completedAt}-${i}`} className="flex items-center justify-between px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-mist-100">{h.title}</p>
                  <p className="text-xs text-mist-300/50">{new Date(h.completedAt).toLocaleString()}</p>
                </div>
                <span className="shrink-0 text-xs text-mist-300/60">{h.durationMin} min</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
