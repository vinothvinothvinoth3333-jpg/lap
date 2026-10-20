import { ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('w-full overflow-x-auto scrollbar-thin', className)}>
      <table className="w-full min-w-max border-collapse text-sm">{children}</table>
    </div>
  )
}

export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="bg-muted/60 text-left text-xs font-medium text-muted-foreground">{children}</thead>
}

export function TH({
  children,
  sortable,
  className,
  align = 'left',
}: {
  children?: React.ReactNode
  sortable?: boolean
  className?: string
  align?: 'left' | 'right' | 'center'
}) {
  return (
    <th
      scope="col"
      className={cn(
        'h-10 border-b border-border px-4 font-medium whitespace-nowrap',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        className,
      )}
    >
      {sortable ? (
        <button type="button" className="inline-flex items-center gap-1 hover:text-foreground">
          {children}
          <ArrowUpDown className="size-3" aria-hidden />
        </button>
      ) : (
        children
      )}
    </th>
  )
}

export function TBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border">{children}</tbody>
}

export function TR({
  children,
  className,
  onClick,
  selected,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  selected?: boolean
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'transition-colors odd:bg-card even:bg-muted/25 hover:bg-accent/60',
        onClick && 'cursor-pointer',
        selected && 'bg-accent',
        className,
      )}
    >
      {children}
    </tr>
  )
}

export function TD({
  children,
  className,
  align = 'left',
  muted,
}: {
  children?: React.ReactNode
  className?: string
  align?: 'left' | 'right' | 'center'
  muted?: boolean
}) {
  return (
    <td
      className={cn(
        'h-12 px-4 align-middle',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        muted && 'text-muted-foreground',
        className,
      )}
    >
      {children}
    </td>
  )
}

export function TableFooter({
  total,
  shown,
  label = 'records',
}: {
  total: number
  shown: number
  label?: string
}) {
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
      <span>
        Showing <span className="font-medium text-foreground tabular-nums">{shown}</span> of{' '}
        <span className="font-medium text-foreground tabular-nums">{total}</span> {label}
      </span>
      <div className="flex items-center gap-1">
        <button type="button" className="h-7 rounded border border-border bg-card px-2 disabled:opacity-50" disabled>
          Previous
        </button>
        <span className="flex h-7 items-center rounded bg-primary px-2.5 text-primary-foreground">1</span>
        <button type="button" className="h-7 rounded border border-border bg-card px-2 disabled:opacity-50" disabled>
          Next
        </button>
      </div>
    </div>
  )
}
