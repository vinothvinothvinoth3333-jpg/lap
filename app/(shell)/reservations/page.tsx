import Link from 'next/link'
import { CalendarPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/kit/page'
import { ReservationsManager } from '@/components/screens/reservations-manager'

export default function ReservationsPage() {
  return (
    <>
      <PageHeader
        title="Reservations"
        subtitle="All laboratory bookings across every status"
        actions={
          <Button render={<Link href="/reservations/new" />}>
            <CalendarPlus /> New Reservation
          </Button>
        }
      />
      <ReservationsManager />
    </>
  )
}
