import { PageHeader } from '@/components/kit/page'
import { UsersManager } from '@/components/screens/users-manager'

export default function UsersPage() {
  return (
    <>
      <PageHeader title="Users" subtitle="Manage students and lecturers who can reserve laboratories" />
      <UsersManager />
    </>
  )
}
