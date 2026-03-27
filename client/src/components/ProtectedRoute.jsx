import { Navigate } from 'react-router-dom'
import { useAuth } from '../state/auth'

export function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700 shadow-sm">
          Loading…
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />

  return children
}

