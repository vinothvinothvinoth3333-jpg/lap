'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Ban, Calendar, Clock, FlaskConical, User, FileText, Microscope, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader, Panel } from '@/components/kit/page'
import { BookingStatusBadge, StatusBadge } from '@/components/kit/status-badge'
import { ConfirmDialog } from '@/components/kit/dialog'
import { Field, Textarea } from '@/components/kit/field'
import { useToast } from '@/components/kit/toast'
import { labById, userByEid, equipmentById, formatDate, formatTime, currentStaff, type Booking, type BookingStatus } from '@/lib/data'

export function ReservationDetails({ booking: initial, breadcrumb }: { booking: Booking; breadcrumb: React.ReactNode }) {
  const toast = useToast()
  const [booking, setBooking] = useState(initial)
  const [action, setAction] = useState<'approve' | 'reject' | 'cancel' | null>(null)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string | undefined>()

  const lab = labById(booking.labId)
  const user = userByEid(booking.userEid)

  function apply() {
    if (action === 'reject' && !reason.trim()) {
      setReasonError('Please provide a reason for rejection')
      return
    }
    const status: BookingStatus = action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'cancelled'
    setBooking((b) => ({ ...b, status }))
    toast({
      tone: action === 'approve' ? 'success' : action === 'reject' ? 'danger' : 'info',
      title: `Booking ${status}`,
      body: `${booking.id} has been ${status} by ${currentStaff.name}.`,
    })
    setAction(null)
    setReason('')
    setReasonError(undefined)
  }

  return (
    <>
      <PageHeader
        breadcrumb={breadcrumb}
        title={`Booking ${booking.id}`}
        subtitle={`Requested ${booking.createdAt}`}
        actions={
          <>
            {booking.status === 'pending' && (
              <>
                <Button variant="danger" onClick={() => setAction('reject')}>
                  <X /> Reject
                </Button>
                <Button variant="success" onClick={() => setAction('approve')}>
                  <Check /> Approve
                </Button>
              </>
            )}
            {booking.status === 'approved' && (
              <Button variant="outline" onClick={() => setAction('cancel')}>
                <Ban /> Cancel Booking
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Booking Information" className="xl:col-span-2">
          <div className="mb-5 flex items-center justify-between rounded-md bg-muted/50 px-4 py-3">
            <span className="text-sm text-muted-foreground">Current status</span>
            <BookingStatusBadge status={booking.status} />
          </div>
          <dl className="grid gap-x-8 gap-y-5 text-sm sm:grid-cols-2">
            <Item icon={<User />} label="User">
              <span className="flex flex-col">
                <span className="font-medium">{user?.name}</span>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{user?.eid}</span>
                  <StatusBadge tone={user?.type === 'lecturer' ? 'violet' : 'info'} size="sm">
                    {user?.type === 'lecturer' ? 'Lecturer' : 'Student'}
                  </StatusBadge>
                </span>
              </span>
            </Item>
            <Item icon={<FlaskConical />} label="Laboratory">
              <span className="flex flex-col">
                <Link href={`/labs/${lab?.id}`} className="font-medium hover:underline">
                  {lab?.name}
                </Link>
                <span className="text-xs text-muted-foreground">
                  Room {lab?.number} · {lab?.location}
                </span>
              </span>
            </Item>
            <Item icon={<Calendar />} label="Date">
              <span className="font-medium">{formatDate(booking.date)}</span>
            </Item>
            <Item icon={<Clock />} label="Time">
              <span className="font-medium tabular-nums">
                {formatTime(booking.start)} – {formatTime(booking.end)}
              </span>
            </Item>
            <Item icon={<FileText />} label="Purpose" className="sm:col-span-2">
              <p className="leading-relaxed text-pretty">{booking.purpose}</p>
            </Item>
            <Item icon={<Microscope />} label="Requested Equipment" className="sm:col-span-2">
              {booking.equipment.length === 0 ? (
                <span className="text-muted-foreground">No equipment requested</span>
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {booking.equipment.map((e) => {
                    const eq = equipmentById(e.equipmentId)
                    return (
                      <li key={e.equipmentId} className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm">
                        <span className="font-medium">{eq?.name}</span>
                        <span className="rounded bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">× {e.qty}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </Item>
          </dl>
        </Panel>

        <Panel title="Activity" description="Booking history">
          <ol className="relative flex flex-col gap-5 border-l border-border pl-5">
            <TimelineItem title="Request submitted" meta={booking.createdAt} tone="info" />
            {booking.status === 'approved' && <TimelineItem title="Approved" meta={`by ${currentStaff.name}`} tone="success" />}
            {booking.status === 'rejected' && <TimelineItem title="Rejected" meta={`by ${currentStaff.name}`} tone="danger" />}
            {booking.status === 'cancelled' && <TimelineItem title="Cancelled" meta={`by ${currentStaff.name}`} tone="neutral" />}
            {booking.status === 'completed' && (
              <>
                <TimelineItem title="Approved" meta={`by ${currentStaff.name}`} tone="success" />
                <TimelineItem title="Completed" meta="Session ended" tone="info" />
              </>
            )}
            {booking.status === 'pending' && <TimelineItem title="Awaiting decision" meta="Pending staff approval" tone="warning" pulse />}
          </ol>
        </Panel>
      </div>

      <ConfirmDialog
        open={action === 'approve'}
        onClose={() => setAction(null)}
        onConfirm={apply}
        title="Approve Booking?"
        description={`Approve booking ${booking.id} for ${lab?.name} on ${formatDate(booking.date)}, ${formatTime(booking.start)} – ${formatTime(booking.end)}?`}
        confirmLabel="Approve"
        confirmVariant="success"
        tone="success"
      >
        <p className="text-sm text-muted-foreground">
          The requester will be notified and the time slot will be blocked for other reservations.
        </p>
      </ConfirmDialog>

      <ConfirmDialog
        open={action === 'reject'}
        onClose={() => {
          setAction(null)
          setReasonError(undefined)
        }}
        onConfirm={apply}
        title="Reject Booking?"
        description={`Are you sure you want to reject booking ${booking.id}?`}
        confirmLabel="Reject"
        confirmVariant="danger"
        tone="danger"
      >
        <Field label="Reason for rejection" htmlFor="reject-reason" required error={reasonError}>
          <Textarea
            id="reject-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Laboratory is reserved for departmental maintenance."
            className="min-h-20"
            invalid={!!reasonError}
          />
        </Field>
      </ConfirmDialog>

      <ConfirmDialog
        open={action === 'cancel'}
        onClose={() => setAction(null)}
        onConfirm={apply}
        title="Cancel Booking?"
        description={`Cancel approved booking ${booking.id}? The time slot will become available again.`}
        confirmLabel="Cancel Booking"
        confirmVariant="danger"
        tone="warning"
      />
    </>
  )
}

function Item({ icon, label, children, className }: { icon: React.ReactNode; label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex gap-3 ${className ?? ''}`}>
      <span className="mt-0.5 text-muted-foreground [&_svg]:size-4">{icon}</span>
      <div className="flex min-w-0 flex-col gap-1">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd>{children}</dd>
      </div>
    </div>
  )
}

function TimelineItem({ title, meta, tone, pulse }: { title: string; meta: string; tone: 'info' | 'success' | 'danger' | 'neutral' | 'warning'; pulse?: boolean }) {
  const dot = { info: 'bg-info', success: 'bg-success', danger: 'bg-danger', neutral: 'bg-neutral', warning: 'bg-warning' }[tone]
  return (
    <li className="relative">
      <span className={`absolute -left-[26px] top-1 size-3 rounded-full ring-4 ring-card ${dot} ${pulse ? 'animate-pulse' : ''}`} />
      <p className="text-sm font-medium">{title}</p>
      <p className="flex items-center gap-1 text-xs text-muted-foreground">
        <History className="size-3" /> {meta}
      </p>
    </li>
  )
}
