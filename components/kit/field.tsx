'use client'

import { useId } from 'react'
import { AlertCircle, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const controlBase =
  'h-9 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground shadow-none transition-colors placeholder:text-muted-foreground/70 focus:border-ring focus:outline-none focus:ring-3 focus:ring-ring/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground aria-invalid:border-danger aria-invalid:focus:ring-danger/20'

export function Field({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: {
  label: string
  htmlFor?: string
  required?: boolean
  error?: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
        {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="flex items-center gap-1 text-xs text-danger-strong">
          <AlertCircle className="size-3.5" />
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export function Input({
  className,
  invalid,
  leading,
  trailing,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
  leading?: React.ReactNode
  trailing?: React.ReactNode
}) {
  if (leading || trailing) {
    return (
      <div className="relative flex items-center">
        {leading && (
          <span className="pointer-events-none absolute left-3 text-muted-foreground [&_svg]:size-4">
            {leading}
          </span>
        )}
        <input
          aria-invalid={invalid || undefined}
          className={cn(controlBase, leading && 'pl-9', trailing && 'pr-9', className)}
          {...props}
        />
        {trailing && <span className="absolute right-2 flex items-center">{trailing}</span>}
      </div>
    )
  }
  return (
    <input aria-invalid={invalid || undefined} className={cn(controlBase, className)} {...props} />
  )
}

export function Select({
  className,
  invalid,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={cn(controlBase, 'appearance-none pr-9', className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export function Textarea({
  className,
  invalid,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(controlBase, 'h-auto min-h-24 resize-y py-2 leading-relaxed', className)}
      {...props}
    />
  )
}

export function Checkbox({
  label,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: React.ReactNode }) {
  const id = useId()
  return (
    <label htmlFor={props.id ?? id} className={cn('flex cursor-pointer items-center gap-2 text-sm', className)}>
      <input
        id={props.id ?? id}
        type="checkbox"
        className="size-4 rounded border-input accent-primary"
        {...props}
      />
      {label}
    </label>
  )
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string; count?: number }[]
  value: T
  onChange: (v: T) => void
  ariaLabel: string
}) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex h-9 items-center gap-0.5 rounded-md border border-border bg-muted p-0.5"
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            role="tab"
            aria-selected={active}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              'flex h-full items-center gap-1.5 rounded-[5px] px-3 text-sm font-medium transition-colors',
              active
                ? 'bg-card text-foreground shadow-[0_1px_2px_rgb(15_30_70/0.08)]'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {o.label}
            {o.count !== undefined && (
              <span
                className={cn(
                  'rounded px-1.5 text-[11px] tabular-nums',
                  active ? 'bg-accent text-primary' : 'bg-card/60 text-muted-foreground',
                )}
              >
                {o.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
