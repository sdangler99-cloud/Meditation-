import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChevronLeft, Heart, Pause, Play, RotateCcw } from 'lucide-react'
import { breathingPatterns } from '../data/breathing'
import { gradientClasses } from '../lib/gradients'
import { useAmbientAudio } from '../audio/useAmbientAudio'
import { useLibrary } from '../state/LibraryContext'

type Phase = 'inhale' | 'holdIn' | 'exhale' | 'holdOut'

const PHASE_LABEL: Record<Phase, string> = {
  inhale: 'Breathe In',
  holdIn: 'Hold',
  exhale: 'Breathe Out',
  holdOut: 'Hold',
}

export function BreathingPlayer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const pattern = breathingPatterns.find((p) => p.id === id)
  const { logSession, isFavorite, toggleFavorite } = useLibrary()

  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState<Phase>('inhale')
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(pattern?.inhale ?? 4)
  const [cycle, setCycle] = useState(0)
  const [completed, setCompleted] = useState(false)
  const loggedRef = useRef(false)

  useAmbientAudio('chimes', isPlaying, 0.2)

  const phaseOrder: { phase: Phase; duration: number }[] = pattern
    ? [
        { phase: 'inhale' as const, duration: pattern.inhale },
        { phase: 'holdIn' as const, duration: pattern.holdIn },
        { phase: 'exhale' as const, duration: pattern.exhale },
        { phase: 'holdOut' as const, duration: pattern.holdOut },
      ].filter((p) => p.duration > 0)
    : []

  useEffect(() => {
    if (!isPlaying || !pattern || completed) return
    const interval = setInterval(() => {
      setPhaseTimeLeft((prev) => {
        if (prev > 1) return prev - 1
        // advance to next phase
        setPhase((currentPhase) => {
          const idx = phaseOrder.findIndex((p) => p.phase === currentPhase)
          const nextIdx = (idx + 1) % phaseOrder.length
          if (nextIdx === 0) {
            setCycle((c) => {
              const nextCycle = c + 1
              if (nextCycle >= pattern.cycles) {
                setIsPlaying(false)
                setCompleted(true)
              }
              return nextCycle
            })
          }
          setPhaseTimeLeft(phaseOrder[nextIdx]?.duration ?? 1)
          return phaseOrder[nextIdx]?.phase ?? currentPhase
        })
        return prev
      })
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, completed, pattern?.id])

  useEffect(() => {
    if (completed && pattern && !loggedRef.current) {
      loggedRef.current = true
      const totalSeconds =
        pattern.cycles * (pattern.inhale + pattern.holdIn + pattern.exhale + pattern.holdOut)
      logSession({
        id: pattern.id,
        title: pattern.title,
        durationMin: Math.max(1, Math.round(totalSeconds / 60)),
      })
    }
  }, [completed, pattern, logSession])

  useEffect(() => {
    if (!pattern) return
    setPhase('inhale')
    setPhaseTimeLeft(pattern.inhale)
    setCycle(0)
    setCompleted(false)
    setIsPlaying(false)
    loggedRef.current = false
  }, [pattern])

  if (!pattern) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-mist-300/70">We couldn’t find that breathing exercise.</p>
        <Link to="/breathing" className="text-sm text-lavender-400">
          Browse breathing exercises
        </Link>
      </div>
    )
  }

  const scale = phase === 'inhale' ? 1.4 : phase === 'exhale' ? 0.75 : phase === 'holdIn' ? 1.4 : 0.75
  const phaseDuration =
    phase === 'inhale' ? pattern.inhale : phase === 'holdIn' ? pattern.holdIn : phase === 'exhale' ? pattern.exhale : pattern.holdOut

  return (
    <div className={`relative min-h-screen bg-gradient-to-b ${gradientClasses[pattern.gradient]}`}>
      <div className="absolute inset-0 bg-ink-950/60" />
      <div className="relative flex min-h-screen flex-col items-center px-4 pb-12 pt-6 text-white">
        <div className="mb-6 flex w-full max-w-md items-center justify-between">
          <button onClick={() => navigate(-1)} className="rounded-full bg-black/20 p-2 backdrop-blur-sm">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3">
            <p className="text-sm text-white/70">
              Cycle {Math.min(cycle + 1, pattern.cycles)} / {pattern.cycles}
            </p>
            <button
              onClick={() => toggleFavorite(pattern.id)}
              className="rounded-full bg-black/20 p-2 backdrop-blur-sm"
              aria-label={isFavorite(pattern.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-4 w-4 ${isFavorite(pattern.id) ? 'fill-rose-400 text-rose-400' : 'text-white'}`} />
            </button>
          </div>
        </div>

        <div className="text-center">
          <h1 className="font-serif text-2xl sm:text-3xl">{pattern.title}</h1>
          <p className="mt-1 max-w-sm text-sm text-white/70">{pattern.benefit}</p>
        </div>

        <div className="relative my-14 flex h-72 w-72 items-center justify-center">
          <div
            className="absolute h-48 w-48 rounded-full bg-white/20"
            style={{
              transform: `scale(${isPlaying || completed ? scale : 1})`,
              transition: isPlaying ? `transform ${phaseDuration}s ease-in-out` : 'transform 0.5s ease',
            }}
          />
          <div className="absolute h-36 w-36 rounded-full bg-white/10 backdrop-blur-sm" />
          <div className="z-10 text-center">
            <p className="font-serif text-2xl">{completed ? 'Done' : PHASE_LABEL[phase]}</p>
            {!completed && <p className="mt-1 text-4xl font-light">{phaseTimeLeft}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (completed) return
              setIsPlaying((p) => !p)
            }}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur-md transition hover:bg-white/25"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
          </button>
          {completed && (
            <button
              onClick={() => {
                setPhase('inhale')
                setPhaseTimeLeft(pattern.inhale)
                setCycle(0)
                setCompleted(false)
                loggedRef.current = false
              }}
              className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-3 text-sm backdrop-blur-sm transition hover:bg-white/25"
            >
              <RotateCcw className="h-4 w-4" /> Restart
            </button>
          )}
        </div>

        <p className="mt-10 max-w-md text-center text-sm leading-relaxed text-white/80">{pattern.description}</p>
      </div>
    </div>
  )
}
