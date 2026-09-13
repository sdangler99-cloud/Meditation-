import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function Row({
  title,
  seeAllHref,
  children,
}: {
  title: string
  seeAllHref?: string
  children: ReactNode
}) {
  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between px-4 sm:px-6">
        <h2 className="font-serif text-lg text-mist-100">{title}</h2>
        {seeAllHref && (
          <Link to={seeAllHref} className="text-xs font-medium text-lavender-400 hover:text-lavender-300">
            See all
          </Link>
        )}
      </div>
      <div className="no-scrollbar flex gap-3 overflow-x-auto px-4 pb-1 sm:px-6">{children}</div>
    </section>
  )
}
