import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Studio Hôte — Quiz & Blind Test',
  description: 'Gestionnaire de Quiz & Blind Test propulsé par Supabase',
}

export default function HostDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="h-16 px-6 flex justify-between border-b border-white/10 items-center bg-slate-900/80 backdrop-blur">
        <div className="flex items-center gap-6">
          <Link
            href="/host/dashboard"
            className="font-black text-xl tracking-tight flex items-center gap-2"
          >
            <span>🎛️</span>
            <span>Studio Hôte</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link
              href="/host/dashboard"
              className="hover:text-white font-semibold"
            >
              Mes Packs
            </Link>
            <Link
              href="/host/dashboard/how-to"
              className="hover:text-white font-semibold"
            >
              Guide &amp; Aide
            </Link>
          </nav>
        </div>

        <Link
          href="/"
          className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 font-semibold transition"
        >
          🕹️ Vue Joueur (PIN)
        </Link>
      </header>
      <main className="flex-grow p-6 max-w-6xl w-full mx-auto">{children}</main>
    </div>
  )
}
