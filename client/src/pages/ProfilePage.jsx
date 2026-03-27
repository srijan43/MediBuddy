import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Card } from '../components/Card'
import { Field } from '../components/Field'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { api } from '../utils/api'
import { useAuth } from '../state/auth'

export function ProfilePage() {
  const { user, profile, refreshMe } = useAuth()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    age: '',
    gender: 'prefer_not_to_say',
    medicalHistory: '',
    allergies: '',
    currentMedications: '',
    specialization: '',
    bio: '',
    clinic: '',
    city: '',
  })

  useEffect(() => {
    if (!user) return
    setForm((f) => ({
      ...f,
      age: profile?.age ?? '',
      gender: profile?.gender ?? 'prefer_not_to_say',
      medicalHistory: profile?.medicalHistory ?? '',
      allergies: profile?.allergies ?? '',
      currentMedications: profile?.currentMedications ?? '',
      specialization: profile?.specialization ?? '',
      bio: profile?.bio ?? '',
      clinic: profile?.clinic ?? '',
      city: profile?.city ?? '',
    }))
  }, [user, profile])

  async function save() {
    setSaving(true)
    try {
      if (user.role === 'patient') {
        await api.put('/me/patient', {
          age: form.age === '' ? undefined : Number(form.age),
          gender: form.gender,
          medicalHistory: form.medicalHistory,
          allergies: form.allergies,
          currentMedications: form.currentMedications,
        })
      } else {
        await api.put('/me/doctor', {
          specialization: form.specialization,
          bio: form.bio,
          clinic: form.clinic,
          city: form.city,
        })
      }
      toast.success('Profile updated')
      await refreshMe()
    } catch (e) {
      toast.error(e?.response?.data?.error?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 md:text-3xl">Profile</h1>
        <p className="mt-2 text-sm text-slate-600">Update your details. This data is stored securely in MongoDB.</p>
      </div>

      <Card
        title="Account"
        subtitle="Basic info"
        right={
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {user?.role}
          </span>
        }
      >
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Name">
            <Input value={user?.name || ''} disabled />
          </Field>
          <Field label="Email">
            <Input value={user?.email || ''} disabled />
          </Field>
        </div>
      </Card>

      {user?.role === 'patient' ? (
        <Card title="Patient profile" subtitle="Medical context improves recommendations">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Age">
              <Input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            </Field>
            <Field label="Gender">
              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-sky-500/30 focus:ring-4"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="prefer_not_to_say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </Field>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Field label="Allergies">
              <Input value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} />
            </Field>
            <Field label="Current medications">
              <Input
                value={form.currentMedications}
                onChange={(e) => setForm({ ...form, currentMedications: e.target.value })}
              />
            </Field>
          </div>
          <div className="mt-3">
            <Field label="Medical history">
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-sky-500/30 focus:ring-4"
                rows={5}
                value={form.medicalHistory}
                onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
              />
            </Field>
          </div>
          <div className="mt-4">
            <Button loading={saving} onClick={save}>
              Save changes
            </Button>
          </div>
        </Card>
      ) : (
        <Card title="Doctor profile" subtitle="Help patients find you">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Specialization">
              <Input
                value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              />
            </Field>
            <Field label="City">
              <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </Field>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <Field label="Clinic">
              <Input value={form.clinic} onChange={(e) => setForm({ ...form, clinic: e.target.value })} />
            </Field>
            <Field label="Bio">
              <Input value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4">
            <Button loading={saving} onClick={save}>
              Save changes
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

