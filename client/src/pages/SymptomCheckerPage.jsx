import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Card } from '../components/Card'
import { Field } from '../components/Field'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { api } from '../utils/api'

function Pill({ children, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-800">
      {children}
      <button onClick={onRemove} className="text-slate-500 hover:text-slate-700" type="button">
        ×
      </button>
    </span>
  )
}

export function SymptomCheckerPage() {
  const [symptom, setSymptom] = useState('')
  const [symptoms, setSymptoms] = useState([])
  const [loading, setLoading] = useState(false)
  const [latest, setLatest] = useState(null)

  useEffect(() => {
    api
      .get('/recommendations/me')
      .then((r) => setLatest(r.data.items?.[0] || null))
      .catch(() => {})
  }, [])

  function addSymptom() {
    const s = symptom.trim().toLowerCase()
    if (!s) return
    if (symptoms.includes(s)) return
    setSymptoms((prev) => [...prev, s].slice(0, 20))
    setSymptom('')
  }

  async function analyze() {
    if (symptoms.length === 0) return toast.error('Add at least one symptom')
    setLoading(true)
    try {
      const { data } = await api.post('/recommendations', { symptoms })
      setLatest(data.recommendation)
      toast.success('Recommendation generated')
    } catch (e) {
      toast.error(e?.response?.data?.error?.message || 'Failed to analyze symptoms')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Symptom checker</h1>
        <p className="mt-2 text-sm text-slate-600">Enter symptoms in plain language (e.g. “fever”, “cough”).</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Symptoms" subtitle="Add a few symptoms then run analysis">
          <div className="space-y-4">
            <Field label="Add symptom">
              <div className="flex gap-2">
                <Input
                  value={symptom}
                  onChange={(e) => setSymptom(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addSymptom()
                    }
                  }}
                  placeholder="e.g. fever"
                />
                <Button variant="secondary" type="button" onClick={addSymptom}>
                  Add
                </Button>
              </div>
            </Field>

            <div className="flex flex-wrap gap-2">
              {symptoms.map((s) => (
                <Pill key={s} onRemove={() => setSymptoms((prev) => prev.filter((x) => x !== s))}>
                  {s}
                </Pill>
              ))}
            </div>

            <Button loading={loading} onClick={analyze} className="w-full">
              Analyze
            </Button>
          </div>
        </Card>

        <Card title="Recommendation" subtitle="Mock AI output (modular and replaceable)">
          {!latest ? (
            <div className="text-sm text-slate-600">No recommendation yet.</div>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <div className="font-semibold text-slate-900">Possible conditions</div>
                <div className="mt-1 text-slate-700">{latest.possibleConditions?.join(', ')}</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Suggested specialists</div>
                <div className="mt-1 text-slate-700">{latest.suggestedSpecializations?.join(', ')}</div>
              </div>
              <div>
                <div className="font-semibold text-slate-900">Advice</div>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-700">
                  {(latest.advice || []).map((a, idx) => (
                    <li key={idx}>{a}</li>
                  ))}
                </ul>
              </div>
              <div className="text-xs text-slate-500">Confidence: {Math.round((latest.confidence || 0.6) * 100)}%</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

