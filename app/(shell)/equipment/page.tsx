import { PageHeader } from '@/components/kit/page'
import { EquipmentManager } from '@/components/screens/equipment-manager'

export default function EquipmentPage() {
  return (
    <>
      <PageHeader title="Equipment" subtitle="Inventory of laboratory equipment, quantities and condition" />
      <EquipmentManager />
    </>
  )
}
