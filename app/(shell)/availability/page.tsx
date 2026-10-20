import { Suspense } from 'react'
import { PageHeader } from '@/components/kit/page'
import { AvailabilityChecker } from '@/components/screens/availability-checker'

export default function AvailabilityPage() {
  return (
    <>
      <PageHeader
        title="Laboratory Availability"
        subtitle="Check whether a laboratory is free for a specific date and time before creating a reservation"
      />
      <Suspense>
        <AvailabilityChecker />
      </Suspense>
    </>
  )
}
