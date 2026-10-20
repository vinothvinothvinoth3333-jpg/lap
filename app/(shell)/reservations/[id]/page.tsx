import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { bookings } from '@/lib/data'
import { ReservationDetails } from '@/components/screens/reservation-details'

export function generateStaticParams() {
  return bookings.map((b) => ({ id: b.id }))
}

export default async function ReservationDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const booking = bookings.find((b) => b.id === id)
  if (!booking) notFound()

  return (
    <ReservationDetails
      booking={booking}
      breadcrumb={
        <span className="flex items-center gap-1">
          <Link href="/reservations" className="hover:underline">
            Reservations
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{booking.id}</span>
        </span>
      }
    />
  )
}
