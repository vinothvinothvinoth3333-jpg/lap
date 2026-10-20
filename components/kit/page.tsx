import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  subtitle,
  actions,
  breadcrumb,
}: {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  breadcrumb?: React.ReactNode
}) {
  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-1">
        {breadcrumb && (
          <div className="text-xs text-muted-foreground">{breadcrumb}</div>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  )
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  flush,
}: {
  title?: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  className?: string
  bodyClassName?: string
  flush?: boolean
}) {
  return (
    <section
      className={cn(
        'flex flex-col rounded-lg border border-border bg-card text-card-foreground shadow-[0_1px_2px_0_rgb(15_30_70/0.04)]',
        className,
      )}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-3.5">
          <div className="flex flex-col gap-0.5">
            {title && <h2 className="text-sm font-semibold">{title}</h2>}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={cn(flush ? '' : 'p-5', bodyClassName)}>{children}</div>
    </section>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = 'primary',
}: {
  label: string
  value: string | number
  hint?: string
  icon: React.ReactNode
  tone?: 'primary' | 'success' | 'info' | 'warning'
}) {
  const toneClass = {
    primary: 'bg-accent text-primary',
    success: 'bg-success-soft text-success-strong',
    info: 'bg-info-soft text-info-strong',
    warning: 'bg-warning-soft text-warning-strong',
  }[tone]
  return (
    <div className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 shadow-[0_1px_2px_0_rgb(15_30_70/0.04)]">
      <div
        className={cn(
          'flex size-11 shrink-0 items-center justify-center rounded-lg [&_svg]:size-5',
          toneClass,
        )}
      >
        {icon}
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-2xl font-semibold leading-tight tabular-nums">{value}</span>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-12 text-center',
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-6">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && (
          <p className="max-w-xs text-sm text-muted-foreground text-pretty">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function Callout({
  tone,
  icon,
  title,
  children,
  actions,
  className,
}: {
  tone: 'success' | 'warning' | 'danger' | 'info'
  icon: React.ReactNode
  title: string
  children?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}) {
  const cls = {
    success: 'border-success/30 bg-success-soft text-success-strong',
    warning: 'border-warning/30 bg-warning-soft text-warning-strong',
    danger: 'border-danger/30 bg-danger-soft text-danger-strong',
    info: 'border-info/30 bg-info-soft text-info-strong',
  }[tone]
  return (
    <div
      role="status"
      className={cn('flex flex-col gap-3 rounded-lg border p-4', cls, className)}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 [&_svg]:size-5">{icon}</span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{title}</p>
          {children && <div className="text-sm opacity-90">{children}</div>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap gap-2 pl-8">{actions}</div>}
    </div>
  )
}
