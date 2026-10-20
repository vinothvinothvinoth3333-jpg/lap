import { CalendarRange } from 'lucide-react'
import { PageHeader, Panel } from '@/components/kit/page'
import { StatusBadge } from '@/components/kit/status-badge'
import { bookings, formatDate, formatTime, labById, userByEid } from '@/lib/data'

export default function SchedulePage() {
  const scheduled = bookings
    .filter((booking) => booking.status === 'approved' || booking.status === 'pending')
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`))

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Schedule" subtitle="Upcoming laboratory bookings and pending requests" />
      <Panel title="Upcoming bookings" description={`${scheduled.length} bookings in the current schedule`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Date and time</th>
                <th className="pb-3 pr-4 font-medium">Laboratory</th>
                <th className="pb-3 pr-4 font-medium">Requester</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduled.map((booking) => (
                <tr key={booking.id} className="border-b border-border last:border-0">
                  <td className="py-3 pr-4">
                    <div className="font-medium">{formatDate(booking.date)}</div>
                    <div className="text-xs text-muted-foreground">{formatTime(booking.start)} - {formatTime(booking.end)}</div>
                  </td>
                  <td className="py-3 pr-4">{labById(booking.labId)?.name ?? booking.labId}</td>
                  <td className="py-3 pr-4">{userByEid(booking.userEid)?.name ?? booking.userEid}</td>
                  <td className="py-3"><StatusBadge tone={booking.status === 'approved' ? 'success' : 'warning'}>{booking.status}</StatusBadge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      {scheduled.length === 0 && <Panel><div className="flex items-center gap-3 text-sm text-muted-foreground"><CalendarRange className="size-5" />No upcoming bookings.</div></Panel>}
    </div>
  )
}
