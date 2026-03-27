import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Card } from '../components/Card'
import { Field } from '../components/Field'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { api } from '../utils/api'

export function BookAppointmentPage() {
  const [q, setQ] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [city, setCity] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [totalPages, setTotalPages] = useState(1)

  const [doctorProfileId, setDoctorProfileId] = useState('')
  const [datetime, setDatetime] = useState('')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canBook = useMemo(() => !!doctorProfileId && !!datetime, [doctorProfileId, datetime])

  async function load() {
    setLoading(true)
    try {
      const { data } = await api.get('/doctors', { params: { q, specialization, city, page, limit: 8 } })
      setItems(data.items || [])
      setTotalPages(data.totalPages || 1)
    } catch (e) {
      toast.error('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  async function book() {
    if (!canBook) return toast.error('Select a doctor and date/time')
    setSubmitting(true)
    try {
      await api.post('/appointments', { doctorProfileId, datetime: new Date(datetime).toISOString(), reason })
      toast.success('Appointment requested')
      setReason('')
    } catch (e) {
      toast.error(e?.response?.data?.error?.message || 'Booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Book an appointment</h1>
        <p className="mt-2 text-sm text-slate-600">Search doctors and request a time. Doctors will accept/reject.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card title="Search" subtitle="Filter by name, specialization, city">
          <div className="space-y-3">
            <Field label="Search">
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g., Dr. Patel" />
            </Field>
            <Field label="Specialization">
              <Input
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="e.g., Cardiologist"
              />
            </Field>
            <Field label="City">
              <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g., Pune" />
            </Field>
            <Button
              variant="secondary"
              onClick={() => {
                setPage(1)
                load()
              }}
              className="w-full"
            >
              Apply filters
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card
            title="Doctors"
            subtitle={loading ? 'Loading…' : `${items.length} result(s)`}
            right={
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <div className="text-sm text-slate-600">
                  Page {page} / {totalPages}
                </div>
                <Button
                  variant="secondary"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            }
          >
            {loading ? (
              <div className="text-sm text-slate-600">Loading…</div>
            ) : items.length === 0 ? (
              <div className="text-sm text-slate-600">No doctors found.</div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {items.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDoctorProfileId(d.profile?.id || d.id)}
                    className={`text-left rounded-2xl border p-4 transition ${
                      doctorProfileId === (d.profile?.id || d.id)
                        ? 'border-sky-300 bg-sky-50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                    type="button"
                  >
                    <div className="text-sm font-semibold text-slate-900">{d.user?.name || 'Doctor'}</div>
                    <div className="mt-1 text-sm text-slate-600">{d.profile?.specialization}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {(d.profile?.city && `City: ${d.profile.city}`) || '—'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card title="Request time" subtitle="Select a doctor, then choose date/time">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Date & time">
                <Input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} />
              </Field>
              <Field label="Reason (optional)">
                <Input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Short reason" />
              </Field>
            </div>
            <div className="mt-4">
              <Button loading={submitting} disabled={!canBook} onClick={book} className="w-full md:w-auto">
                Request appointment
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

