import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { api } from '../utils/api'

export function DoctorDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])

  const pending = useMemo(() => appointments.filter((a) => a.status === 'pending'), [appointments])

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/appointments/me')
      setAppointments(data.items || [])
    } catch (e) {
      toast.error('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function setStatus(id, status) {
    try {
      await api.patch(`/appointments/${id}/status`, { status })
      toast.success(`Appointment ${status}`)
      await load()
    } catch (e) {
      toast.error(e?.response?.data?.error?.message || 'Update failed')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Doctor dashboard</h1>
          <p className="mt-2 text-sm text-slate-600">
            {loading ? 'Loading…' : `You have ${pending.length} pending appointment request(s).`}
          </p>
        </div>
        <button onClick={load} className="text-sm font-medium text-sky-700 hover:text-sky-600">
          Refresh
        </button>
      </div>

      <Card title="Appointment requests" subtitle="Accept or reject pending bookings">
        {loading ? (
          <div className="text-sm text-slate-600">Loading…</div>
        ) : appointments.length === 0 ? (
          <div className="text-sm text-slate-600">No appointments yet.</div>
        ) : (
          <div className="space-y-3">
            {appointments.map((a) => (
              <div key={a.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {new Date(a.datetime).toLocaleString()}
                    </div>
                    {a.reason && <div className="mt-1 text-sm text-slate-600">{a.reason}</div>}
                  </div>
                  <div className="flex items-center gap-2">
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
                    {a.status === 'pending' && (
                      <>
                        <Button variant="secondary" onClick={() => setStatus(a.id, 'rejected')}>
                          Reject
                        </Button>
                        <Button onClick={() => setStatus(a.id, 'accepted')}>Accept</Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

