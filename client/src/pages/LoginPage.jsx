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

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) })

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values)
      navigate('/dashboard')
    } catch (e) {
      toast.error(e?.response?.data?.error?.message || 'Login failed')
    }
  })

  return (
    <div className="mx-auto max-w-lg">
      <Card title="Welcome back" subtitle="Sign in to your MediBuddy account">
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Email" error={errors.email?.message}>
            <Input placeholder="you@company.com" {...register('email')} />
          </Field>
          <Field label="Password" error={errors.password?.message}>
            <Input type="password" placeholder="••••••••" {...register('password')} />
          </Field>
          <Button loading={isSubmitting} type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <div className="mt-4 text-sm text-slate-600">
          New here?{' '}
          <Link className="font-medium text-sky-700 hover:text-sky-600" to="/signup">
            Create an account
          </Link>
        </div>
      </Card>
    </div>
  )
}

