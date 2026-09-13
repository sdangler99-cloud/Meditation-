import { Link } from 'react-router-dom'
import { Wind, Sparkles } from 'lucide-react'
import { allSessions, meditationThemeNames } from '../data/content'
import { breathingPatterns } from '../data/breathing'
import { courses } from '../data/courses'
import { affirmationCards } from '../data/affirmations'
import { Row } from '../components/Row'
import { SessionCard } from '../components/SessionCard'
import { gradientClasses } from '../lib/gradients'
import { useLibrary } from '../state/LibraryContext'

const byType = (t: string) => allSessions.filter((s) => s.type === t)

function greeting() {
  const h = new Date().getHours()
  if (h < 5) return 'Still up?'
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export function Home() {
  const { streakDays, favorites } = useLibrary()
  const meditationsFive = meditationThemeNames.map((t) =>
    allSessions.find((s) => s.category === t && s.durationMin === 5),
  )
  const sleepStories = byType('sleep').filter((s) => s.category === 'Sleep Story')
  const sounds = byType('sound')
  const music = byType('music')
  const affirmationOfDay = affirmationCards[new Date().getDate() % affirmationCards.length]

  return (
    <div className="pt-8 sm:pt-10">
      <div className="mb-6 px-4 sm:px-6">
        <p className="text-sm text-mist-300/70">{greeting()}</p>
        <h1 className="mt-1 font-serif text-2xl text-mist-100 sm:text-3xl">What would you like to feel today?</h1>
        {streakDays > 0 && (
          <p className="mt-2 text-xs text-lavender-400">
            🔥 {streakDays}-day streak — keep it going · {favorites.length} favorites saved
          </p>
        )}
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 px-4 sm:grid-cols-4 sm:px-6">
        <Link
          to="/breathing"
          className="flex flex-col items-start gap-2 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-500 p-4 transition hover:brightness-110"
        >
          <Wind className="h-5 w-5 text-white" />
          <span className="text-sm font-medium text-white">1-Minute Breather</span>
        </Link>
        <Link
          to="/library?type=sleep"
          className="flex flex-col items-start gap-2 rounded-2xl bg-gradient-to-br from-indigo-950 to-indigo-700 p-4 transition hover:brightness-110"
        >
          <span className="text-lg">🌙</span>
          <span className="text-sm font-medium text-white">Wind Down for Sleep</span>
        </Link>
        <Link
          to={`/library?type=meditation&category=${encodeURIComponent('Stress Relief')}`}
          className="flex flex-col items-start gap-2 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-400 p-4 transition hover:brightness-110"
        >
          <Sparkles className="h-5 w-5 text-white" />
          <span className="text-sm font-medium text-white">Relieve Stress</span>
        </Link>
        <Link
          to="/affirmations"
          className="flex flex-col items-start gap-2 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 p-4 transition hover:brightness-110"
        >
          <span className="text-lg">✦</span>
          <span className="text-sm font-medium text-white">Daily Affirmation</span>
        </Link>
      </div>

      <Row title="5-Minute Meditations" seeAllHref="/library?type=meditation">
        {meditationsFive.map((s) => s && <SessionCard key={s.id} session={s} />)}
      </Row>

      <Row title="Sleep Stories" seeAllHref="/library?type=sleep">
        {sleepStories.map((s) => (
          <SessionCard key={s.id} session={s} wide />
        ))}
      </Row>

      <Row title="Breathing Exercises" seeAllHref="/breathing">
        {breathingPatterns.map((b) => (
          <Link
            key={b.id}
            to={`/breathing/${b.id}`}
            className="w-40 shrink-0 overflow-hidden rounded-2xl bg-ink-800 ring-1 ring-white/5 transition hover:ring-white/20"
          >
            <div className={`flex h-24 items-end bg-gradient-to-br ${gradientClasses[b.gradient]} p-3`}>
              <Wind className="ml-auto h-5 w-5 text-white/80" strokeWidth={1.75} />
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium text-mist-100">{b.title}</p>
              <p className="mt-0.5 truncate text-xs text-mist-300/70">
                {b.inhale}-{b.holdIn}-{b.exhale}-{b.holdOut} · {b.cycles} cycles
              </p>
            </div>
          </Link>
        ))}
      </Row>

      <Row title="Soundscapes" seeAllHref="/library?type=sound">
        {sounds.map((s) => (
          <SessionCard key={s.id} session={s} />
        ))}
      </Row>

      <Row title="Focus & Sleep Music" seeAllHref="/library?type=music">
        {music.map((s) => (
          <SessionCard key={s.id} session={s} />
        ))}
      </Row>

      <section className="mb-8 px-4 sm:px-6">
        <h2 className="mb-3 font-serif text-lg text-mist-100">Multi-Day Courses</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <Link
              key={c.id}
              to={`/courses/${c.id}`}
              className={`rounded-2xl bg-gradient-to-br p-4 ${gradientClasses[c.gradient]} transition hover:brightness-110`}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-white/70">{c.sessionIds.length} Days</p>
              <p className="mt-1 font-serif text-lg text-white">{c.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-white/80">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8 px-4 sm:px-6">
        <Link
          to="/affirmations"
          className="block rounded-2xl border border-white/10 bg-ink-800 p-5 transition hover:border-white/20"
        >
          <p className="text-xs uppercase tracking-wide text-mist-300/60">Affirmation of the Day</p>
          <p className="mt-2 font-serif text-xl text-mist-100">“{affirmationOfDay.text}”</p>
        </Link>
      </section>
    </div>
  )
}
