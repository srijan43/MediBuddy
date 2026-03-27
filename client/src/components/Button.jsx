export function Button({ variant = 'primary', loading, className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-medium transition disabled:opacity-60 disabled:cursor-not-allowed'
  const styles =
    variant === 'primary'
      ? 'bg-sky-600 text-white hover:bg-sky-500'
      : variant === 'secondary'
        ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
        : 'bg-rose-600 text-white hover:bg-rose-500'

  return (
    <button className={`${base} ${styles} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? 'Please wait…' : props.children}
    </button>
  )
}

