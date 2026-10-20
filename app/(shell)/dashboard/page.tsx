import Link from 'next/link'
import { FlaskConical, CheckCircle2, CalendarDays, Hourglass, ArrowRight, CalendarPlus, CalendarCheck2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader, Panel, StatCard } from '@/components/kit/page'
import { Table, THead, TH, TBody, TR, TD } from '@/components/kit/table'
import { BookingStatusBadge, LabStatusBadge, EquipmentStatusBadge } from '@/components/kit/status-badge'
import {
  bookings,
  labs,
  equipment,
  TODAY,
  formatTime,
  formatDate,
  labById,
  userByEid,
} from '@/lib/data'

export default function DashboardPage() {
  const todays = bookings
    .filter((b) => b.date === TODAY && b.status !== 'cancelled' && b.status !== 'rejected')
    .sort((a, b) => a.start.localeCompare(b.start))
  const upcoming = bookings
    .filter((b) => b.date > TODAY && b.status === 'approved')
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))
    .slice(0, 5)
  const pending = bookings.filter((b) => b.status === 'pending')
  const available = labs.filter((l) => l.status === 'available').length

  const equipmentSummary = {
    available: equipment.filter((e) => e.status === 'available').length,
    maintenance: equipment.filter((e) => e.status === 'maintenance').length,
    unavailable: equipment.filter((e) => e.status === 'unavailable').length,
  }

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Overview of laboratory activities · ${formatDate(TODAY)}`}
        actions={
          <>
            <Button variant="outline" render={<Link href="/availability" />}>
              <CalendarCheck2 />
              Check Availability
            </Button>
            <Button render={<Link href="/reservations/new" />}>
              <CalendarPlus />
              New Reservation
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard label="Total Laboratories" value={labs.length} hint="Across 5 buildings" icon={<FlaskConical />} />
        <StatCard
          label="Available Laboratories"
          value={available}
          hint={`${labs.length - available} unavailable or in maintenance`}
          icon={<CheckCircle2 />}
          tone="success"
        />
        <StatCard label="Today's Bookings" value={todays.length} hint="Approved, pending and completed" icon={<CalendarDays />} tone="info" />
        <StatCard label="Pending Requests" value={pending.length} hint="Awaiting staff approval" icon={<Hourglass />} tone="warning" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          title="Today's Bookings"
          description="All reservations scheduled for today"
          className="xl:col-span-2"
          flush
          actions={
            <Button variant="ghost" size="sm" render={<Link href="/schedule" />}>
              Open schedule <ArrowRight />
            </Button>
          }
        >
          <Table>
            <THead>
              <tr>
                <TH>Time</TH>
                <TH>Laboratory</TH>
                <TH>User</TH>
                <TH>Purpose</TH>
                <TH>Status</TH>
              </tr>
            </THead>
            <TBody>
              {todays.map((b) => (
                <TR key={b.id}>
                  <TD className="font-medium tabular-nums">
                    {formatTime(b.start)} – {formatTime(b.end)}
                  </TD>
                  <TD>{labById(b.labId)?.name}</TD>
                  <TD>{userByEid(b.userEid)?.name}</TD>
                  <TD muted className="max-w-[240px] truncate">
                    {b.purpose}
                  </TD>
                  <TD>
                    <BookingStatusBadge status={b.status} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Panel>

        <Panel
          title="Pending Booking Requests"
          description={`${pending.length} requests need a decision`}
          flush
          actions={
            <Button variant="ghost" size="sm" render={<Link href="/approvals" />}>
              Review all <ArrowRight />
            </Button>
          }
        >
          <ul className="divide-y divide-border">
            {pending.slice(0, 4).map((b) => (
              <li key={b.id} className="flex items-start justify-between gap-3 px-5 py-3">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span className="font-mono text-xs text-muted-foreground">{b.id}</span>
                    {userByEid(b.userEid)?.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {labById(b.labId)?.name} · {formatDate(b.date)}, {formatTime(b.start)}–{formatTime(b.end)}
                  </span>
                </div>
                <Button size="sm" variant="outline" render={<Link href={`/reservations/${b.id}`} />}>
                  Review
                </Button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Upcoming Reservations" description="Next approved bookings" flush>
          <ul className="divide-y divide-border">
            {upcoming.map((b) => (
              <li key={b.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex w-12 shrink-0 flex-col items-center rounded-md border border-border bg-muted/50 py-1 leading-tight">
                  <span className="text-[10px] font-medium uppercase text-muted-foreground">
                    {formatDate(b.date).split(' ')[1]}
                  </span>
                  <span className="text-base font-semibold tabular-nums">{formatDate(b.date).split(' ')[0]}</span>
                </div>
                <div className="flex min-w-0 flex-col">
                  <span className="truncate text-sm font-medium">{labById(b.labId)?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(b.start)} – {formatTime(b.end)} · {userByEid(b.userEid)?.name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Laboratory Status" description="Current status of all laboratories" flush>
          <ul className="divide-y divide-border">
            {labs.slice(0, 6).map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 px-5 py-2.5">
                <div className="flex min-w-0 flex-col">
                  <Link href={`/labs/${l.id}`} className="truncate text-sm font-medium hover:underline">
                    {l.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">
                    {l.number} · Capacity {l.capacity}
                  </span>
                </div>
                <LabStatusBadge status={l.status} />
              </li>
            ))}
          </ul>
          <div className="border-t border-border px-5 py-2.5 text-right">
            <Link href="/labs" className="text-xs font-medium text-primary hover:underline">
              View all {labs.length} laboratories
            </Link>
          </div>
        </Panel>

        <Panel title="Equipment Status" description="Inventory health at a glance">
          <div className="grid grid-cols-3 gap-3">
            <SummaryTile label="Available" value={equipmentSummary.available} status="available" />
            <SummaryTile label="Maintenance" value={equipmentSummary.maintenance} status="maintenance" />
            <SummaryTile label="Unavailable" value={equipmentSummary.unavailable} status="unavailable" />
          </div>
          <ul className="mt-4 flex flex-col divide-y divide-border border-t border-border">
            {equipment
              .filter((e) => e.status !== 'available')
              .map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">{e.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{labById(e.labId)?.name}</span>
                  </div>
                  <EquipmentStatusBadge status={e.status} />
                </li>
              ))}
          </ul>
        </Panel>
      </div>
    </>
  )
}

function SummaryTile({
  label,
  value,
  status,
}: {
  label: string
  value: number
  status: 'available' | 'maintenance' | 'unavailable'
}) {
  const cls = {
    available: 'bg-success-soft text-success-strong',
    maintenance: 'bg-warning-soft text-warning-strong',
    unavailable: 'bg-danger-soft text-danger-strong',
  }[status]
  return (
    <div className={`flex flex-col items-center rounded-md px-2 py-3 ${cls}`}>
      <span className="text-2xl font-semibold tabular-nums">{value}</span>
      <span className="text-[11px] font-medium">{label}</span>
    </div>
  )
}
