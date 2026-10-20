import { Suspense } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { PageHeader } from '@/components/kit/page'
import { ReservationForm } from '@/components/screens/reservation-form'

export default function NewReservationPage() {
  return (
    <>
      <PageHeader
        breadcrumb={
          <span className="flex items-center gap-1">
            <Link href="/reservations" className="hover:underline">
              Reservations
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-foreground">New</span>
          </span>
        }
        title="Create Reservation"
        subtitle="Reserve a laboratory on behalf of a student or lecturer"
      />
      <Suspense>
        <ReservationForm />
      </Suspense>
    </>
  )
}
