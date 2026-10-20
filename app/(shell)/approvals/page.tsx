import { PageHeader } from '@/components/kit/page'
import { ApprovalsQueue } from '@/components/screens/approvals-queue'

export default function ApprovalsPage() {
  return (
    <>
      <PageHeader title="Pending Booking Requests" subtitle="Review each request and approve or reject it" />
      <ApprovalsQueue />
    </>
  )
}
