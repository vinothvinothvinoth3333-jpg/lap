import { cn } from '@/lib/utils'
import type { BookingStatus, EquipmentStatus, LabStatus } from '@/lib/data'

export type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'violet'

const toneClasses: Record<Tone, string> = {
  success: 'bg-success-soft text-success-strong [&>i]:bg-success',
  warning: 'bg-warning-soft text-warning-strong [&>i]:bg-warning',
  danger: 'bg-danger-soft text-danger-strong [&>i]:bg-danger',
  info: 'bg-info-soft text-info-strong [&>i]:bg-info',
  neutral: 'bg-neutral-soft text-neutral-strong [&>i]:bg-neutral',
  violet: 'bg-violet-soft text-violet-strong [&>i]:bg-violet',
}

export function StatusBadge({
  tone,
  children,
  className,
  size = 'md',
}: {
  tone: Tone
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md font-medium whitespace-nowrap',
        size === 'md' ? 'h-6 px-2 text-xs' : 'h-5 px-1.5 text-[11px]',
        toneClasses[tone],
        className,
      )}
    >
      <i aria-hidden className="size-1.5 shrink-0 rounded-full" />
      {children}
    </span>
  )
}

export const labTone: Record<LabStatus, Tone> = {
  available: 'success',
  unavailable: 'neutral',
  maintenance: 'danger',
}

export const bookingTone: Record<BookingStatus, Tone> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  cancelled: 'neutral',
  completed: 'info',
}

export const equipmentTone: Record<EquipmentStatus, Tone> = {
  available: 'success',
  unavailable: 'danger',
  maintenance: 'warning',
}

export function LabStatusBadge({ status }: { status: LabStatus }) {
  const label = { available: 'Available', unavailable: 'Unavailable', maintenance: 'Under Maintenance' }
  return <StatusBadge tone={labTone[status]}>{label[status]}</StatusBadge>
}

export function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const label = { pending: 'Pending', approved: 'Approved', rejected: 'Rejected', cancelled: 'Cancelled', completed: 'Completed' }
  return <StatusBadge tone={bookingTone[status]}>{label[status]}</StatusBadge>
}

export function EquipmentStatusBadge({ status }: { status: EquipmentStatus }) {
  const label = { available: 'Available', unavailable: 'Unavailable', maintenance: 'Maintenance' }
  return <StatusBadge tone={equipmentTone[status]}>{label[status]}</StatusBadge>
}
