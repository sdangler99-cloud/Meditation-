import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Heart, Pause, Play, RotateCcw, Volume2 } from 'lucide-react'
import { sessionsById } from '../data/content'
import { gradientClasses } from '../lib/gradients'
import { useAmbientAudio } from '../audio/useAmbientAudio'
import { useLibrary } from '../state/LibraryContext'

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function SessionPlayer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const session = id ? sessionsById.get(id) : undefined
  const { isFavorite, toggleFavorite, logSession } = useLibrary()

  const totalSeconds = (session?.durationMin ?? 0) * 60
  const [elapsed, setElapsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.6)
  const [completed, setCompleted] = useState(false)
  const loggedRef = useRef(false)

  useAmbientAudio(session?.soundscape ?? 'silence', isPlaying, volume)

  useEffect(() => {
    if (!isPlaying || completed) return
    const interval = setInterval(() => {
      setElapsed((prev) => {
        if (prev + 1 >= totalSeconds) {
          clearInterval(interval)
          setIsPlaying(false)
          setCompleted(true)
          return totalSeconds
        }
        return prev + 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying, completed, totalSeconds])

  useEffect(() => {
    if (completed && session && !loggedRef.current) {
      loggedRef.current = true
      logSession({ id: session.id, title: session.title, durationMin: session.durationMin })
    }
  }, [completed, session, logSession])

  useEffect(() => {
    setElapsed(0)
    setIsPlaying(false)
    setCompleted(false)
    loggedRef.current = false
  }, [id])

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-mist-300/70">We couldn’t find that session.</p>
        <Link to="/library" className="text-sm text-lavender-400">
          Browse the library
        </Link>
      </div>
    )
  }

  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0
  const fav = isFavorite(session.id)
  const radius = 120
  const circumference = 2 * Math.PI * radius

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${gradientClasses[session.gradient]}`}>
      <div className="absolute inset-0 bg-ink-950/55" />
      <div className="relative flex min-h-screen flex-col items-center px-4 pb-12 pt-6 text-white">
        <div className="mb-6 flex w-full max-w-md items-center justify-between">
          <button onClick={() => navigate(-1)} className="rounded-full bg-black/20 p-2 backdrop-blur-sm">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => toggleFavorite(session.id)}
            className="rounded-full bg-black/20 p-2 backdrop-blur-sm"
            aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`h-5 w-5 ${fav ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs uppercase tracking-widest text-white/60">{session.category}</p>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl">{session.title}</h1>
          <p className="mt-1 text-sm text-white/70">with {session.narrator}</p>
        </div>

        <div className="relative my-10 flex h-72 w-72 items-center justify-center">
          <svg className="absolute -rotate-90" width="288" height="288">
            <circle cx="144" cy="144" r={radius} stroke="rgba(255,255,255,0.15)" strokeWidth="4" fill="none" />
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="white"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear' }}
            />
          </svg>
          <button
            onClick={() => {
              if (completed) return
              setIsPlaying((p) => !p)
            }}
            className="z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition hover:bg-white/25"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-9 w-9" /> : <Play className="ml-1 h-9 w-9" />}
          </button>
          <div className="absolute -bottom-10 text-sm text-white/80">
            {completed ? 'Complete ✓' : `${formatTime(elapsed)} / ${formatTime(totalSeconds)}`}
          </div>
        </div>

        {completed && (
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <p className="font-serif text-xl">Well done. 🌿</p>
            <p className="max-w-sm text-sm text-white/75">
              Session logged. Take a slow breath before you head back into your day.
            </p>
            <button
              onClick={() => {
                setElapsed(0)
                setCompleted(false)
                loggedRef.current = false
              }}
              className="mt-1 flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm backdrop-blur-sm transition hover:bg-white/25"
            >
              <RotateCcw className="h-4 w-4" /> Play again
            </button>
          </div>
        )}

        <p className="max-w-md text-center text-sm leading-relaxed text-white/80">{session.description}</p>

        <div className="mt-8 flex w-full max-w-xs items-center gap-3">
          <Volume2 className="h-4 w-4 text-white/70" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-white"
          />
        </div>
      </div>
    </div>
  )
}
