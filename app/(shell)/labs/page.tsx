import { PageHeader } from '@/components/kit/page'
import { LabsManager } from '@/components/screens/labs-manager'

export default function LabsPage() {
  return (
    <>
      <PageHeader title="Laboratories" subtitle="Manage university laboratories, their locations, capacity and status" />
      <LabsManager />
    </>
  )
}
