export function Field({ label, hint, error, children }) {
  return (
    <div>
      {label && <div className="text-sm font-medium text-slate-800">{label}</div>}
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
      <div className="mt-2">{children}</div>
      {error && <div className="mt-2 text-sm text-rose-600">{error}</div>}
    </div>
  )
}

