import { Link } from 'react-router-dom'
import { Card } from '../components/Card'

function Feature({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-sm text-slate-600">{children}</div>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-sky-50 p-8 shadow-sm md:p-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
            AI-assisted symptom insights · Secure scheduling
          </div>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Personalized healthcare recommendations, built for scale.
          </h1>
          <p className="mt-4 text-base text-slate-600 md:text-lg">
            MediBuddy helps patients understand symptoms, connects them with the right specialists, and streamlines
            appointment booking—without compromising security.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-medium text-white hover:bg-sky-500"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-medium text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Feature title="Symptom checker (mock AI)">
          Modular rules-based engine that can later swap to real AI APIs.
        </Feature>
        <Feature title="Find specialists">
          Search and filter doctors by name, specialization, and city with pagination.
        </Feature>
        <Feature title="Appointments">
          Patients book; doctors accept/reject. Role-based access enforced via JWT.
        </Feature>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card
          title="For patients"
          subtitle="Fast insights, simple booking, secure profiles."
          right={
            <Link to="/signup" className="text-sm font-medium text-sky-700 hover:text-sky-600">
              Create patient account →
            </Link>
          }
        >
          <ul className="list-disc pl-5 text-sm text-slate-600">
            <li>Symptom-to-specialist suggestions</li>
            <li>View recommendations history</li>
            <li>Book appointments in minutes</li>
          </ul>
        </Card>
        <Card
          title="For doctors"
          subtitle="Manage incoming requests and keep your profile updated."
          right={
            <Link to="/signup" className="text-sm font-medium text-sky-700 hover:text-sky-600">
              Create doctor account →
            </Link>
          }
        >
          <ul className="list-disc pl-5 text-sm text-slate-600">
            <li>Accept or reject appointments</li>
            <li>Update specialization, clinic, city</li>
            <li>See appointment pipeline at a glance</li>
          </ul>
        </Card>
      </section>
    </div>
  )
}

