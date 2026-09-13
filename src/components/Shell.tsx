import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Library, Wind, Heart, User } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/breathing', label: 'Breathe', icon: Wind },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/profile', label: 'Profile', icon: User },
]

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950 text-mist-100">
      <div className="mx-auto flex min-h-screen max-w-6xl">
        <nav className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col border-r border-white/5 px-4 py-6 sm:flex">
          <div className="mb-8 flex items-center gap-2 px-2">
            <span className="text-xl">🌙</span>
            <span className="font-serif text-lg">Serenity</span>
          </div>
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? 'bg-ink-700 text-mist-100'
                      : 'text-mist-300/70 hover:bg-ink-800 hover:text-mist-100'
                  }`
                }
              >
                <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>

        <main className="min-w-0 flex-1 pb-24 sm:pb-8">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/5 bg-ink-950/95 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-6xl justify-around px-2 py-2">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[11px] transition ${
                  isActive ? 'text-lavender-400' : 'text-mist-300/60'
                }`
              }
            >
              <Icon className="h-5 w-5" strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
