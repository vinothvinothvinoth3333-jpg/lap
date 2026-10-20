import { BarChart3, CalendarDays, FlaskConical, Users } from 'lucide-react'
import { PageHeader, Panel, StatCard } from '@/components/kit/page'
import { bookings, labs, users } from '@/lib/data'

export default function ReportsPage() {
  const approved = bookings.filter((booking) => booking.status === 'approved').length
  const pending = bookings.filter((booking) => booking.status === 'pending').length
  const completed = bookings.filter((booking) => booking.status === 'completed').length

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Reports" subtitle="Summary of laboratory operations and reservations" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total reservations" value={bookings.length} icon={<CalendarDays />} />
        <StatCard label="Approved" value={approved} hint="Active reservations" icon={<BarChart3 />} tone="success" />
        <StatCard label="Pending requests" value={pending} icon={<CalendarDays />} tone="warning" />
        <StatCard label="Completed" value={completed} icon={<BarChart3 />} tone="info" />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Resource overview" description="Current catalogue totals">
          <div className="grid gap-4 sm:grid-cols-2">
            <StatCard label="Laboratories" value={labs.length} icon={<FlaskConical />} tone="info" />
            <StatCard label="Registered users" value={users.length} icon={<Users />} tone="primary" />
          </div>
        </Panel>
        <Panel title="Booking status" description="Reservations grouped by current status">
          <div className="flex flex-col gap-3 text-sm">
            {(['approved', 'pending', 'completed', 'rejected', 'cancelled'] as const).map((status) => {
              const count = bookings.filter((booking) => booking.status === status).length
              const width = bookings.length ? `${Math.max((count / bookings.length) * 100, count ? 4 : 0)}%` : '0%'
              return <div key={status} className="flex items-center gap-3"><span className="w-20 capitalize text-muted-foreground">{status}</span><div className="h-2 flex-1 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width }} /></div><span className="w-6 text-right tabular-nums">{count}</span></div>
            })}
          </div>
        </Panel>
      </div>
    </div>
  )
}
