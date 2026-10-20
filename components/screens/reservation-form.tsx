'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Calendar, Clock, AlertTriangle, CheckCircle2, Hourglass, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Panel, Callout } from '@/components/kit/page'
import { Field, Input, Select, Textarea } from '@/components/kit/field'
import { Dialog } from '@/components/kit/dialog'
import { StatusBadge, EquipmentStatusBadge, BookingStatusBadge } from '@/components/kit/status-badge'
import { labs, users, equipment, labById, userByEid, findConflicts, formatDate, formatTime, toMinutes, TODAY } from '@/lib/data'
import { cn } from '@/lib/utils'

export function ReservationForm() {
  const params = useSearchParams()
  const router = useRouter()

  const [userQuery, setUserQuery] = useState('')
  const [userEid, setUserEid] = useState('')
  const [labId, setLabId] = useState(params.get('lab') ?? '')
  const [date, setDate] = useState(params.get('date') ?? TODAY)
  const [start, setStart] = useState(params.get('start') ?? '10:00')
  const [end, setEnd] = useState(params.get('end') ?? '12:00')
  const [purpose, setPurpose] = useState('')
  const [selected, setSelected] = useState<Record<string, number>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [conflictOpen, setConflictOpen] = useState(false)
  const [submitted, setSubmitted] = useState<string | null>(null)

  const matchedUsers = useMemo(() => {
    const q = userQuery.trim().toLowerCase()
    if (!q || userEid) return []
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.eid.toLowerCase().includes(q)).slice(0, 5)
  }, [userQuery, userEid])

  const labEquipment = equipment.filter((e) => e.labId === labId)
  const user = userByEid(userEid)
  const lab = labById(labId)

  function toggleEquipment(id: string, on: boolean) {
    setSelected((s) => {
      const next = { ...s }
      if (on) next[id] = next[id] ?? 1
      else delete next[id]
      return next
    })
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!userEid) next.user = 'Please select a student or lecturer'
    if (!labId) next.lab = 'Please select a laboratory'
    if (!date) next.date = 'Please select a date'
    else if (date < TODAY) next.date = 'Date cannot be in the past'
    if (!start) next.start = 'Start time is required'
    if (!end) next.end = 'End time is required'
    if (start && end && toMinutes(end) <= toMinutes(start)) next.end = 'End time must be later than start time'
    if (!purpose.trim()) next.purpose = 'Please describe the purpose of the reservation'
    if (lab && lab.status !== 'available') next.lab = 'This laboratory is unavailable'
    for (const [id, qty] of Object.entries(selected)) {
      const eq = equipment.find((x) => x.id === id)
      if (eq && (qty < 1 || qty > eq.available)) next[`eq-${id}`] = `Only ${eq.available} available — this equipment quantity is not available`
    }
    setErrors(next)
    if (Object.keys(next).length) return

    if (findConflicts(labId, date, start, end).length) {
      setConflictOpen(true)
      return
    }
    setSubmitted('B016')
  }

  const conflicts = labId ? findConflicts(labId, date, start, end) : []

  if (submitted && lab && user) {
    return (
      <Panel className="mx-auto w-full max-w-2xl">
        <div className="flex flex-col items-center gap-5 py-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-warning-soft text-warning-strong">
            <Hourglass className="size-7" />
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold">Reservation submitted successfully</h2>
            <p className="text-sm text-muted-foreground">
              Booking <span className="font-mono font-medium text-foreground">{submitted}</span> has been created and is awaiting approval.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Status</span>
            <BookingStatusBadge status="pending" />
          </div>
          <dl className="grid w-full grid-cols-2 gap-x-6 gap-y-3 rounded-md border border-border bg-muted/40 p-4 text-left text-sm sm:grid-cols-4">
            <div>
              <dt className="text-xs text-muted-foreground">User</dt>
              <dd className="font-medium">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Laboratory</dt>
              <dd className="font-medium">{lab.name}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Date</dt>
              <dd className="font-medium">{formatDate(date)}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Time</dt>
              <dd className="font-medium tabular-nums">
                {formatTime(start)} – {formatTime(end)}
              </dd>
            </div>
          </dl>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="outline" render={<Link href="/reservations" />}>
              View All Reservations
            </Button>
            <Button render={<Link href="/approvals" />}>Go to Pending Requests</Button>
          </div>
        </div>
      </Panel>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-6 xl:grid-cols-3">
      <div className="flex flex-col gap-6 xl:col-span-2">
        <Panel title="Reservation Details">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="User" htmlFor="r-user" required error={errors.user} hint={!userEid ? 'Search by name or University E-ID' : undefined} className="sm:col-span-2">
              {user ? (
                <div className="flex h-9 items-center justify-between rounded-md border border-input bg-card px-3 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{user.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{user.eid}</span>
                    <StatusBadge tone={user.type === 'lecturer' ? 'violet' : 'info'} size="sm">
                      {user.type === 'lecturer' ? 'Lecturer' : 'Student'}
                    </StatusBadge>
                  </span>
                  <button
                    type="button"
                    aria-label="Clear selected user"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setUserEid('')
                      setUserQuery('')
                    }}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    id="r-user"
                    placeholder="Student or Lecturer"
                    leading={<Search />}
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    invalid={!!errors.user}
                    autoComplete="off"
                    role="combobox"
                    aria-expanded={matchedUsers.length > 0}
                    aria-controls="user-results"
                  />
                  {matchedUsers.length > 0 && (
                    <ul id="user-results" role="listbox" className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-lg">
                      {matchedUsers.map((u) => (
                        <li key={u.eid} role="option" aria-selected={false}>
                          <button
                            type="button"
                            onClick={() => setUserEid(u.eid)}
                            className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                          >
                            <span className="flex flex-col">
                              <span className="font-medium">{u.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {u.department} · {u.faculty}
                              </span>
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">{u.eid}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </Field>

            <Field label="Laboratory" htmlFor="r-lab" required error={errors.lab} className="sm:col-span-2">
              <Select
                id="r-lab"
                value={labId}
                onChange={(e) => {
                  setLabId(e.target.value)
                  setSelected({})
                }}
                invalid={!!errors.lab}
              >
                <option value="">Select Laboratory</option>
                {labs.map((l) => (
                  <option key={l.id} value={l.id} disabled={l.status !== 'available'}>
                    {l.name} ({l.number}){l.status !== 'available' ? ' — unavailable' : ''}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Date" htmlFor="r-date" required error={errors.date} className="sm:col-span-2 lg:col-span-1">
              <Input id="r-date" type="date" min={TODAY} value={date} onChange={(e) => setDate(e.target.value)} leading={<Calendar />} invalid={!!errors.date} />
            </Field>
            <div className="grid grid-cols-2 gap-4 sm:col-span-2 lg:col-span-1">
              <Field label="Start Time" htmlFor="r-start" required error={errors.start}>
                <Input id="r-start" type="time" step={900} value={start} onChange={(e) => setStart(e.target.value)} leading={<Clock />} invalid={!!errors.start} />
              </Field>
              <Field label="End Time" htmlFor="r-end" required error={errors.end}>
                <Input id="r-end" type="time" step={900} value={end} onChange={(e) => setEnd(e.target.value)} leading={<Clock />} invalid={!!errors.end} />
              </Field>
            </div>

            <Field label="Purpose" htmlFor="r-purpose" required error={errors.purpose} className="sm:col-span-2">
              <Textarea id="r-purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Describe the practical, research or teaching activity…" invalid={!!errors.purpose} />
            </Field>
          </div>
        </Panel>

        <Panel title="Equipment" description="Optional — request equipment from the selected laboratory" flush>
          {!labId ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">Select a laboratory to see its equipment.</p>
          ) : labEquipment.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted-foreground">No equipment is registered for this laboratory.</p>
          ) : (
            <ul className="divide-y divide-border">
              {labEquipment.map((eq) => {
                const on = eq.id in selected
                const disabled = eq.available === 0 || eq.status !== 'available'
                const err = errors[`eq-${eq.id}`]
                return (
                  <li key={eq.id} className={cn('flex flex-col gap-2 px-5 py-3', disabled && 'opacity-60')}>
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="flex flex-1 cursor-pointer items-center gap-3 text-sm">
                        <input
                          type="checkbox"
                          className="size-4 accent-primary"
                          checked={on}
                          disabled={disabled}
                          onChange={(e) => toggleEquipment(eq.id, e.target.checked)}
                        />
                        <span className="font-medium">{eq.name}</span>
                        <EquipmentStatusBadge status={eq.status} />
                      </label>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {eq.available} of {eq.total} available
                      </span>
                      <label className="flex items-center gap-2 text-xs text-muted-foreground">
                        Quantity
                        <input
                          type="number"
                          min={1}
                          max={eq.available}
                          aria-label={`${eq.name} quantity`}
                          aria-invalid={!!err || undefined}
                          disabled={!on}
                          value={on ? selected[eq.id] : ''}
                          onChange={(e) => setSelected((s) => ({ ...s, [eq.id]: Number(e.target.value) }))}
                          className="h-8 w-16 rounded-md border border-input bg-card px-2 text-center text-sm text-foreground tabular-nums disabled:bg-muted aria-invalid:border-danger"
                        />
                      </label>
                    </div>
                    {err && (
                      <p role="alert" className="flex items-center gap-1 pl-7 text-xs text-danger-strong">
                        <AlertTriangle className="size-3.5" /> {err}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </Panel>
      </div>

      <div className="flex flex-col gap-6">
        <Panel title="Summary">
          <dl className="flex flex-col gap-3 text-sm">
            <Row label="User" value={user?.name ?? '—'} />
            <Row label="Laboratory" value={lab?.name ?? '—'} />
            <Row label="Date" value={date ? formatDate(date) : '—'} />
            <Row label="Time" value={start && end ? `${formatTime(start)} – ${formatTime(end)}` : '—'} />
            <Row label="Equipment" value={Object.keys(selected).length ? `${Object.keys(selected).length} item(s)` : 'None'} />
          </dl>
          <div className="mt-4 border-t border-border pt-4">
            {labId && start && end && toMinutes(end) > toMinutes(start) ? (
              conflicts.length ? (
                <Callout tone="danger" icon={<AlertTriangle />} title="Time conflict detected">
                  Overlaps {conflicts.map((c) => c.id).join(', ')}. Choose another time to continue.
                </Callout>
              ) : (
                <Callout tone="success" icon={<CheckCircle2 />} title="Time slot is free">
                  No existing reservations overlap this period.
                </Callout>
              )
            ) : (
              <p className="text-xs text-muted-foreground">Availability is verified automatically when you submit.</p>
            )}
          </div>
        </Panel>
        <div className="flex flex-col gap-2">
          <Button type="submit" size="lg">
            Submit Reservation
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.push('/reservations')}>
            Cancel
          </Button>
        </div>
      </div>

      <Dialog
        open={conflictOpen}
        onClose={() => setConflictOpen(false)}
        title="Laboratory Unavailable"
        description="The selected laboratory is already booked during this time period."
        tone="warning"
        size="sm"
        footer={
          <>
            <Button variant="outline" render={<Link href={`/availability?lab=${labId}`} />}>
              Check Availability
            </Button>
            <Button
              onClick={() => {
                setConflictOpen(false)
                document.getElementById('r-start')?.focus()
              }}
            >
              Choose Another Time
            </Button>
          </>
        }
      >
        <ul className="flex flex-col gap-2 text-sm">
          {conflicts.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <span className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                <span className="tabular-nums">
                  {formatTime(c.start)} – {formatTime(c.end)}
                </span>
              </span>
              <BookingStatusBadge status={c.status} />
            </li>
          ))}
        </ul>
      </Dialog>
    </form>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  )
}
