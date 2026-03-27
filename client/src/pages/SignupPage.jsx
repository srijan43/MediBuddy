import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Card } from '../components/Card'
import { Field } from '../components/Field'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { useAuth } from '../state/auth'

const schema = z
  .object({
    role: z.enum(['patient', 'doctor']),
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    specialization: z.string().optional(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((v) => (v.role === 'doctor' ? !!v.specialization?.trim() : true), {
    message: 'Specialization is required for doctors',
    path: ['specialization'],
  })

export function SignupPage() {
  const navigate = useNavigate()
  const { signup } = useAuth()

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: 'patient' },
  })

  const role = watch('role')

  const onSubmit = handleSubmit(async (values) => {
    try {
      const payload = {
        role: values.role,
        name: values.name,
        email: values.email,
        password: values.password,
        specialization: values.role === 'doctor' ? values.specialization : undefined,
      }
      await signup(payload)
      navigate('/dashboard')
    } catch (e) {
      toast.error(e?.response?.data?.error?.message || 'Signup failed')
    }
  })

  return (
    <div className="mx-auto max-w-lg">
      <Card title="Create your account" subtitle="Patient or doctor—get started in minutes">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Account type" error={errors.role?.message}>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm">
                <input type="radio" value="patient" {...register('role')} />
                Patient
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm">
                <input type="radio" value="doctor" {...register('role')} />
                Doctor
              </label>
            </div>
          </Field>

          <Field label="Full name" error={errors.name?.message}>
            <Input placeholder="Your name" {...register('name')} />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <Input placeholder="you@company.com" {...register('email')} />
          </Field>
          {role === 'doctor' && (
            <Field label="Specialization" error={errors.specialization?.message}>
              <Input placeholder="e.g., Cardiologist" {...register('specialization')} />
            </Field>
          )}
          <Field label="Password" hint="At least 8 characters" error={errors.password?.message}>
            <Input type="password" placeholder="••••••••" {...register('password')} />
          </Field>
          <Field label="Confirm password" error={errors.confirmPassword?.message}>
            <Input type="password" placeholder="••••••••" {...register('confirmPassword')} />
          </Field>
          <Button loading={isSubmitting} type="submit" className="w-full">
            Create account
          </Button>
        </form>
        <div className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-medium text-sky-700 hover:text-sky-600" to="/login">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  )
}

