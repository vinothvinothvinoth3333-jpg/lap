'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle2, XCircle, Search, ArrowRight, Info, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Panel, Callout } from '@/components/kit/page'
import { Field, Input, Select } from '@/components/kit/field'
import { BookingStatusBadge, LabStatusBadge } from '@/components/kit/status-badge'
import {
  labs,
  bookings,
  labById,
  userByEid,
  findConflicts,
  formatTime,
  formatDate,
  toMinutes,
  TODAY,
  type Booking,
} from '@/lib/data'

type Result =
  | { kind: 'available' }
  | { kind: 'conflict'; conflicts: Booking[] }
  | { kind: 'lab-unavailable'; reason: string }

export function AvailabilityChecker() {
  const params = useSearchParams()
  const [labId, setLabId] = useState(params.get('lab') ?? '')
  const [date, setDate] = useState(TODAY)
  const [start, setStart] = useState('10:00')
  const [end, setEnd] = useState('12:00')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [result, setResult] = useState<Result | null>(null)

  const lab = labById(labId)
  const dayBookings = lab
    ? bookings
        .filter((b) => b.labId === labId && b.date === date && (b.status === 'approved' || b.status === 'pending'))
        .sort((a, b) => a.start.localeCompare(b.start))
    : []

  function check(e: React.FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!labId) next.lab = 'Please select a laboratory'
    if (!date) next.date = 'Please select a date'
    if (!start) next.start = 'Start time is required'
    if (!end) next.end = 'End time is required'
    if (start && end && toMinutes(end) <= toMinutes(start)) next.end = 'End time must be later than start time'
    setErrors(next)
    if (Object.keys(next).length) {
      setResult(null)
      return
    }
    if (lab && lab.status !== 'available') {
      setResult({
        kind: 'lab-unavailable',
        reason: lab.status === 'maintenance' ? 'This laboratory is currently under maintenance.' : 'This laboratory is marked as unavailable.',
      })
      return
    }
    const conflicts = findConflicts(labId, date, start, end)
    setResult(conflicts.length ? { kind: 'conflict', conflicts } : { kind: 'available' })
  }

  const bookingHref = `/reservations/new?lab=${labId}&date=${date}&start=${start}&end=${end}`

  return (
    <div className="grid gap-6 xl:grid-cols-5">
      <Panel title="Check Availability" description="Select the laboratory and time period you want to verify" className="xl:col-span-2">
        <form onSubmit={check} noValidate className="flex flex-col gap-4">
          <Field label="Laboratory" htmlFor="a-lab" required error={errors.lab}>
            <Select
              id="a-lab"
              value={labId}
              onChange={(e) => {
                setLabId(e.target.value)
                setResult(null)
              }}
              invalid={!!errors.lab}
            >
              <option value="">Select Laboratory</option>
              {labs.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.number})
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Date" htmlFor="a-date" required error={errors.date}>
            <Input
              id="a-date"
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                setResult(null)
              }}
              leading={<Calendar />}
              invalid={!!errors.date}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Time" htmlFor="a-start" required error={errors.start}>
              <Input
                id="a-start"
                type="time"
                step={900}
                value={start}
                onChange={(e) => {
                  setStart(e.target.value)
                  setResult(null)
                }}
                leading={<Clock />}
                invalid={!!errors.start}
              />
            </Field>
            <Field label="End Time" htmlFor="a-end" required error={errors.end}>
              <Input
                id="a-end"
                type="time"
                step={900}
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value)
                  setResult(null)
                }}
                leading={<Clock />}
                invalid={!!errors.end}
              />
            </Field>
          </div>
          <Button type="submit" size="lg" className="mt-1">
            <Search /> Check Availability
          </Button>
          <p className="flex items-start gap-2 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0" />
            The system rejects any period that overlaps an approved or pending reservation, so double bookings cannot be created.
          </p>
        </form>
      </Panel>

      <div className="flex flex-col gap-6 xl:col-span-3">
        {result === null && (
          <Panel className="flex-1">
            <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <Search className="size-6" />
              <p className="text-sm">Select a laboratory and time period, then press <span className="font-medium text-foreground">Check Availability</span>.</p>
            </div>
          </Panel>
        )}

        {result?.kind === 'available' && lab && (
          <Callout
            tone="success"
            icon={<CheckCircle2 />}
            title="Laboratory Available"
            actions={
              <Button variant="success" render={<Link href={bookingHref} />}>
                Continue to Booking <ArrowRight />
              </Button>
            }
          >
            <p>
              <span className="font-medium">{lab.name}</span> is available on {formatDate(date)} from {formatTime(start)} to {formatTime(end)}.
            </p>
          </Callout>
        )}

        {result?.kind === 'conflict' && lab && (
          <Callout
            tone="danger"
            icon={<XCircle />}
            title="Laboratory Unavailable"
            actions={
              <>
                <Button variant="outline" onClick={() => document.getElementById('a-start')?.focus()}>
                  Choose Another Time
                </Button>
                <Button variant="outline" onClick={() => document.getElementById('a-lab')?.focus()}>
                  Choose Another Laboratory
                </Button>
              </>
            }
          >
            <p className="mb-3">
              <span className="font-medium">{lab.name}</span> is already booked during the selected period. Conflicting reservation
              {result.conflicts.length > 1 ? 's' : ''}:
            </p>
            <ul className="flex flex-col gap-2">
              {result.conflicts.map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-danger/20 bg-card px-3 py-2 text-foreground">
                  <span className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                    <span className="font-medium tabular-nums">
                      {formatTime(c.start)} – {formatTime(c.end)}
                    </span>
                    <span className="text-muted-foreground">{userByEid(c.userEid)?.name}</span>
                  </span>
                  <BookingStatusBadge status={c.status} />
                </li>
              ))}
            </ul>
          </Callout>
        )}

        {result?.kind === 'lab-unavailable' && lab && (
          <Callout tone="warning" icon={<XCircle />} title="Laboratory Unavailable">
            <p>
              {result.reason} Current status: <LabStatusBadge status={lab.status} />
            </p>
          </Callout>
        )}

        {lab && (
          <Panel
            title={`Schedule for ${formatDate(date)}`}
            description={`${lab.name} · ${dayBookings.length} existing reservation${dayBookings.length === 1 ? '' : 's'}`}
            flush
          >
            <DayTimeline bookings={dayBookings} requested={result ? { start, end, ok: result.kind === 'available' } : null} />
          </Panel>
        )}
      </div>
    </div>
  )
}

const DAY_START = 8
const DAY_END = 18
const HOURS = Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => DAY_START + i)

function DayTimeline({
  bookings,
  requested,
}: {
  bookings: Booking[]
  requested: { start: string; end: string; ok: boolean } | null
}) {
  const total = (DAY_END - DAY_START) * 60
  const pos = (t: string) => ((toMinutes(t) - DAY_START * 60) / total) * 100

  return (
    <div className="flex flex-col gap-2 p-5">
      <div className="relative h-16 rounded-md border border-border bg-muted/40">
        {HOURS.map((h) => (
          <span
            key={h}
            className="absolute top-0 h-full border-l border-border/70 first:border-0"
            style={{ left: `${((h - DAY_START) / (DAY_END - DAY_START)) * 100}%` }}
          />
        ))}
        {bookings.map((b) => (
          <div
            key={b.id}
            title={`${b.id} · ${formatTime(b.start)} – ${formatTime(b.end)}`}
            className={`absolute top-2 flex h-6 items-center overflow-hidden rounded px-2 text-[11px] font-medium ${
              b.status === 'pending' ? 'bg-warning text-foreground' : 'bg-info text-primary-foreground'
            }`}
            style={{ left: `${pos(b.start)}%`, width: `${pos(b.end) - pos(b.start)}%` }}
          >
            <span className="truncate">{b.id}</span>
          </div>
        ))}
        {requested && (
          <div
            className={`absolute bottom-2 flex h-6 items-center overflow-hidden rounded border-2 border-dashed px-2 text-[11px] font-semibold ${
              requested.ok ? 'border-success bg-success-soft text-success-strong' : 'border-danger bg-danger-soft text-danger-strong'
            }`}
            style={{ left: `${pos(requested.start)}%`, width: `${pos(requested.end) - pos(requested.start)}%` }}
          >
            <span className="truncate">Requested</span>
          </div>
        )}
      </div>
      <div className="relative h-4 text-[10px] text-muted-foreground">
        {HOURS.map((h) => (
          <span key={h} className="absolute -translate-x-1/2 tabular-nums" style={{ left: `${((h - DAY_START) / (DAY_END - DAY_START)) * 100}%` }}>
            {h.toString().padStart(2, '0')}:00
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground">
        <Legend className="bg-info" label="Approved booking" />
        <Legend className="bg-warning" label="Pending request" />
        <Legend className="border-2 border-dashed border-success bg-success-soft" label="Requested period (free)" />
        <Legend className="border-2 border-dashed border-danger bg-danger-soft" label="Requested period (conflict)" />
      </div>
    </div>
  )
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-5 rounded-sm ${className}`} />
      {label}
    </span>
  )
}
