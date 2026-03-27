import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../state/auth'

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-full px-3 py-2 text-sm font-medium ${
          isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200'
        }`
      }
    >
      {children}
    </NavLink>
  )
}

export function AppShell() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-sky-600 text-white font-semibold">
              M
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900">MediBuddy</div>
              <div className="text-xs text-slate-500">Intelligent care platform</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <NavItem to="/">Home</NavItem>
            {user?.role === 'patient' && <NavItem to="/symptoms">Symptom checker</NavItem>}
            {user && <NavItem to="/dashboard">Dashboard</NavItem>}
            {user && <NavItem to="/profile">Profile</NavItem>}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden text-sm text-slate-600 md:inline">
                  {user.name} · {user.role}
                </span>
                <button
                  onClick={logout}
                  className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-slate-500">
          MediBuddy © {new Date().getFullYear()} — Not medical advice.
        </div>
      </footer>
    </div>
  )
}

