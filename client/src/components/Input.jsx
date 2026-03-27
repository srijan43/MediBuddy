import { forwardRef } from 'react'

export const Input = forwardRef(function Input(
  { className = '', type = 'text', ...props },
  ref
) {
  return (
    <input
      ref={ref}
      type={type}
      className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-sky-500/30 placeholder:text-slate-400 focus:ring-4 ${className}`}
      {...props}
    />
  )
})

