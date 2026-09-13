import type { GradientKey } from '../data/types'

export const gradientClasses: Record<GradientKey, string> = {
  dusk: 'from-indigo-500 via-purple-500 to-pink-500',
  ocean: 'from-sky-500 via-blue-500 to-cyan-400',
  forest: 'from-emerald-600 via-teal-500 to-green-400',
  ember: 'from-orange-500 via-red-500 to-amber-400',
  lavender: 'from-violet-500 via-purple-500 to-fuchsia-400',
  midnight: 'from-indigo-950 via-indigo-800 to-purple-700',
  dawn: 'from-amber-400 via-orange-400 to-rose-400',
  rose: 'from-rose-400 via-pink-400 to-fuchsia-300',
  gold: 'from-amber-500 via-yellow-500 to-orange-400',
  slate: 'from-slate-600 via-slate-500 to-slate-400',
  sky: 'from-sky-400 via-cyan-400 to-blue-300',
}

export const gradientAccent: Record<GradientKey, string> = {
  dusk: 'text-purple-300',
  ocean: 'text-sky-300',
  forest: 'text-emerald-300',
  ember: 'text-orange-300',
  lavender: 'text-violet-300',
  midnight: 'text-indigo-300',
  dawn: 'text-amber-300',
  rose: 'text-rose-300',
  gold: 'text-amber-300',
  slate: 'text-slate-300',
  sky: 'text-sky-300',
}
