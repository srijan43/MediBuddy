import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { api } from '../utils/api'

export function PatientDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])
  const [recommendations, setRecommendations] = useState([])

  const pendingCount = useMemo(
    () => appointments.filter((a) => a.status === 'pending').length,
    [appointments]
  )

  async function load() {
    setLoading(true)
    try {
      const [a, r] = await Promise.all([api.get('/appointments/me'), api.get('/recommendations/me')])
      setAppointments(a.data.items || [])
      setRecommendations(r.data.items || [])
    } catch (e) {
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Patient dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            {loading ? 'Loading your data…' : `You have ${pendingCount} pending appointment(s).`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/symptoms">
            <Button variant="secondary">Check symptoms</Button>
          </Link>
          <Link to="/appointments/book">
            <Button>Book appointment</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Recent recommendations"
          subtitle="Your latest symptom analyses"
          right={
            <button onClick={load} className="text-sm font-medium text-sky-700 hover:text-sky-600">
              Refresh
            </button>
          }
        >
          {loading ? (
            <div className="text-sm text-slate-600">Loading…</div>
          ) : recommendations.length === 0 ? (
            <div className="text-sm text-slate-600">No recommendations yet.</div>
          ) : (
            <div className="space-y-3">
              {recommendations.slice(0, 5).map((r) => (
                <div key={r.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="text-sm font-semibold text-slate-900">
                    Symptoms: <span className="font-medium">{r.symptoms.join(', ')}</span>
                  </div>
                  <div className="mt-2 text-sm text-slate-600">
                    Suggested: {r.suggestedSpecializations?.join(', ') || 'General Physician'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Appointments" subtitle="Your latest bookings">
          {loading ? (
            <div className="text-sm text-slate-600">Loading…</div>
          ) : appointments.length === 0 ? (
            <div className="text-sm text-slate-600">No appointments yet.</div>
          ) : (
            <div className="space-y-3">
              {appointments.slice(0, 6).map((a) => (
                <div key={a.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900">
                      {new Date(a.datetime).toLocaleString()}
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        a.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-700'
                          : a.status === 'rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  {a.reason && <div className="mt-2 text-sm text-slate-600">{a.reason}</div>}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

