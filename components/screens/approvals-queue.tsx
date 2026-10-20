'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Eye, ClipboardCheck, Calendar, Clock, FlaskConical, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Panel, EmptyState } from '@/components/kit/page'
import { BookingStatusBadge, StatusBadge } from '@/components/kit/status-badge'
import { ConfirmDialog } from '@/components/kit/dialog'
import { Field, Textarea } from '@/components/kit/field'
import { useToast } from '@/components/kit/toast'
import { bookings as seed, labById, userByEid, equipmentById, formatDate, formatTime, findConflicts, type Booking } from '@/lib/data'

export function ApprovalsQueue() {
  const toast = useToast()
  const [items, setItems] = useState<Booking[]>(seed.filter((b) => b.status === 'pending').sort((a, b) => a.createdAt.localeCompare(b.createdAt)))
  const [action, setAction] = useState<{ type: 'approve' | 'reject'; booking: Booking } | null>(null)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState<string | undefined>()

  function apply() {
    if (!action) return
    if (action.type === 'reject' && !reason.trim()) {
      setReasonError('Please provide a reason for rejection')
      return
    }
    setItems((prev) => prev.filter((b) => b.id !== action.booking.id))
    toast({
      tone: action.type === 'approve' ? 'success' : 'danger',
      title: action.type === 'approve' ? 'Booking approved' : 'Booking rejected',
      body: `${action.booking.id} · ${labById(action.booking.labId)?.name}`,
    })
    setAction(null)
    setReason('')
    setReasonError(undefined)
  }

  if (items.length === 0) {
    return (
      <Panel>
        <EmptyState
          icon={<ClipboardCheck />}
          title="All caught up"
          description="There are no pending booking requests. New requests will appear here."
          action={
            <Button variant="outline" render={<Link href="/reservations" />}>
              View all reservations
            </Button>
          }
        />
      </Panel>
    )
  }

  return (
    <>
      <p className="-mt-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground tabular-nums">{items.length}</span> request{items.length === 1 ? '' : 's'} awaiting decision, oldest first.
      </p>
      <ul className="flex flex-col gap-4">
        {items.map((b) => {
          const lab = labById(b.labId)
          const user = userByEid(b.userEid)
          const otherConflicts = findConflicts(b.labId, b.date, b.start, b.end).filter((c) => c.id !== b.id)
          return (
            <li key={b.id}>
              <article className="flex flex-col rounded-lg border border-border bg-card shadow-[0_1px_2px_0_rgb(15_30_70/0.04)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-semibold">{b.id}</span>
                    <BookingStatusBadge status={b.status} />
                    <span className="text-xs text-muted-foreground">Requested {b.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" render={<Link href={`/reservations/${b.id}`} />}>
                      <Eye /> View Details
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => setAction({ type: 'reject', booking: b })}>
                      <X /> Reject
                    </Button>
                    <Button variant="success" size="sm" onClick={() => setAction({ type: 'approve', booking: b })}>
                      <Check /> Approve
                    </Button>
                  </div>
                </div>
                <div className="grid gap-5 p-5 lg:grid-cols-[1.2fr_1fr_1fr]">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">User</span>
                      <span className="flex items-center gap-2 text-sm font-medium">
                        {user?.name}
                        <StatusBadge tone={user?.type === 'lecturer' ? 'violet' : 'info'} size="sm">
                          {user?.type === 'lecturer' ? 'Lecturer' : 'Student'}
                        </StatusBadge>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.eid} · {user?.department}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">Purpose</span>
                      <p className="text-sm leading-relaxed text-pretty">{b.purpose}</p>
                    </div>
                  </div>
                  <dl className="flex flex-col gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="size-4 text-muted-foreground" />
                      <span className="font-medium">{lab?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="size-4 text-muted-foreground" />
                      {formatDate(b.date)}
                    </div>
                    <div className="flex items-center gap-2 tabular-nums">
                      <Clock className="size-4 text-muted-foreground" />
                      {formatTime(b.start)} – {formatTime(b.end)}
                    </div>
                    {otherConflicts.length > 0 && (
                      <p className="flex items-center gap-1.5 text-xs text-warning-strong">
                        <AlertTriangle className="size-3.5" /> Overlaps {otherConflicts.map((c) => c.id).join(', ')}
                      </p>
                    )}
                  </dl>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-muted-foreground">Requested Equipment</span>
                    {b.equipment.length === 0 ? (
                      <span className="text-sm text-muted-foreground">None</span>
                    ) : (
                      <ul className="flex flex-col gap-1.5">
                        {b.equipment.map((e) => {
                          const eq = equipmentById(e.equipmentId)
                          const short = eq ? eq.available < e.qty : false
                          return (
                            <li key={e.equipmentId} className="flex items-center justify-between rounded-md border border-border px-2.5 py-1.5 text-sm">
                              <span>{eq?.name}</span>
                              <span className="flex items-center gap-2 text-xs">
                                <span className="tabular-nums">× {e.qty}</span>
                                <span className={short ? 'font-medium text-danger-strong' : 'text-muted-foreground'}>{eq?.available} available</span>
                              </span>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </article>
            </li>
          )
        })}
      </ul>

      <ConfirmDialog
        open={action?.type === 'approve'}
        onClose={() => setAction(null)}
        onConfirm={apply}
        title="Approve Booking?"
        description={`Approve booking ${action?.booking.id ?? ''} for ${action ? labById(action.booking.labId)?.name : ''} on ${action ? formatDate(action.booking.date) : ''}?`}
        confirmLabel="Approve"
        confirmVariant="success"
        tone="success"
      />
      <ConfirmDialog
        open={action?.type === 'reject'}
        onClose={() => {
          setAction(null)
          setReasonError(undefined)
        }}
        onConfirm={apply}
        title="Reject Booking?"
        description={`Are you sure you want to reject booking ${action?.booking.id ?? ''}?`}
        confirmLabel="Reject"
        confirmVariant="danger"
        tone="danger"
      >
        <Field label="Reason for rejection" htmlFor="q-reject-reason" required error={reasonError}>
          <Textarea id="q-reject-reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain why the request cannot be approved." className="min-h-20" invalid={!!reasonError} />
        </Field>
      </ConfirmDialog>
    </>
  )
}
