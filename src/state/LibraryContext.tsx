import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'

export interface CompletedEntry {
  id: string
  title: string
  durationMin: number
  completedAt: string // ISO date
}

interface LibraryState {
  favorites: string[]
  toggleFavorite: (id: string) => void
  isFavorite: (id: string) => boolean
  history: CompletedEntry[]
  logSession: (entry: Omit<CompletedEntry, 'completedAt'>) => void
  totalMinutes: number
  sessionsCompleted: number
  streakDays: number
}

const LibraryContext = createContext<LibraryState | null>(null)

const dayKey = (d: Date) => d.toISOString().slice(0, 10)

function computeStreak(history: CompletedEntry[]): number {
  if (history.length === 0) return 0
  const days = new Set(history.map((h) => h.completedAt.slice(0, 10)))
  let streak = 0
  const cursor = new Date()
  // If nothing logged today yet, streak still counts back from yesterday.
  if (!days.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }
  while (days.has(dayKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage<string[]>('serenity:favorites', [])
  const [history, setHistory] = useLocalStorage<CompletedEntry[]>('serenity:history', [])

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }

  const logSession: LibraryState['logSession'] = (entry) => {
    setHistory((prev) => [...prev, { ...entry, completedAt: new Date().toISOString() }])
  }

  const value = useMemo<LibraryState>(() => {
    const totalMinutes = history.reduce((sum, h) => sum + h.durationMin, 0)
    return {
      favorites,
      toggleFavorite,
      isFavorite: (id: string) => favorites.includes(id),
      history,
      logSession,
      totalMinutes,
      sessionsCompleted: history.length,
      streakDays: computeStreak(history),
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [favorites, history])

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
}

export function useLibrary() {
  const ctx = useContext(LibraryContext)
  if (!ctx) throw new Error('useLibrary must be used within LibraryProvider')
  return ctx
}
