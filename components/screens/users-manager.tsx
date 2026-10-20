'use client'

import { useMemo, useState } from 'react'
import { Search, Plus, Eye, Pencil, Trash2, Users as UsersIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Panel, EmptyState } from '@/components/kit/page'
import { Field, Input, Select, SegmentedControl } from '@/components/kit/field'
import { Table, THead, TH, TBody, TR, TD, TableFooter } from '@/components/kit/table'
import { StatusBadge } from '@/components/kit/status-badge'
import { Dialog, ConfirmDialog } from '@/components/kit/dialog'
import { useToast } from '@/components/kit/toast'
import { users as seed, type AppUser, type UserType } from '@/lib/data'

type Filter = 'all' | UserType
type FormState = Omit<AppUser, 'type'> & { type: UserType | '' }
const emptyForm: FormState = { eid: '', name: '', faculty: '', department: '', contact: '', type: '' }

export function UsersManager() {
  const toast = useToast()
  const [users, setUsers] = useState<AppUser[]>(seed)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<AppUser | null | 'new'>(null)
  const [viewing, setViewing] = useState<AppUser | null>(null)
  const [deleting, setDeleting] = useState<AppUser | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter(
      (u) =>
        (filter === 'all' || u.type === filter) &&
        (!q || u.eid.toLowerCase().includes(q) || u.name.toLowerCase().includes(q)),
    )
  }, [users, filter, query])

  const counts = {
    all: users.length,
    student: users.filter((u) => u.type === 'student').length,
    lecturer: users.filter((u) => u.type === 'lecturer').length,
  }

  function save(u: AppUser) {
    setUsers((prev) => {
      const exists = prev.some((p) => p.eid === u.eid)
      return exists ? prev.map((p) => (p.eid === u.eid ? u : p)) : [u, ...prev]
    })
    toast({ tone: 'success', title: editing === 'new' ? 'User added' : 'User updated', body: `${u.name} (${u.eid}) saved successfully.` })
    setEditing(null)
  }

  function remove() {
    if (!deleting) return
    setUsers((prev) => prev.filter((p) => p.eid !== deleting.eid))
    toast({ tone: 'info', title: 'User deleted', body: `${deleting.name} was removed.` })
    setDeleting(null)
  }

  return (
    <>
      <Panel flush>
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SegmentedControl
              ariaLabel="Filter users by type"
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'all', label: 'All Users', count: counts.all },
                { value: 'student', label: 'Students', count: counts.student },
                { value: 'lecturer', label: 'Lecturers', count: counts.lecturer },
              ]}
            />
            <div className="w-full sm:w-80">
              <Input
                aria-label="Search users"
                placeholder="Search by University E-ID or Name"
                leading={<Search />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={() => setEditing('new')}>
            <Plus />
            Add User
          </Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<UsersIcon />}
            title="No users found"
            description="Try changing your search or filter, or add a new user."
            action={
              <Button variant="outline" onClick={() => setEditing('new')}>
                <Plus /> Add User
              </Button>
            }
          />
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <TH sortable>E-ID</TH>
                  <TH sortable>Name</TH>
                  <TH>User Type</TH>
                  <TH>Faculty</TH>
                  <TH>Department</TH>
                  <TH>Contact</TH>
                  <TH align="right">Actions</TH>
                </tr>
              </THead>
              <TBody>
                {filtered.map((u) => (
                  <TR key={u.eid}>
                    <TD className="font-mono text-xs">{u.eid}</TD>
                    <TD className="font-medium">{u.name}</TD>
                    <TD>
                      <StatusBadge tone={u.type === 'lecturer' ? 'violet' : 'info'}>
                        {u.type === 'lecturer' ? 'Lecturer' : 'Student'}
                      </StatusBadge>
                    </TD>
                    <TD muted>{u.faculty}</TD>
                    <TD muted>{u.department}</TD>
                    <TD muted className="tabular-nums">
                      {u.contact}
                    </TD>
                    <TD align="right">
                      <RowActions
                        onView={() => setViewing(u)}
                        onEdit={() => setEditing(u)}
                        onDelete={() => setDeleting(u)}
                      />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <TableFooter shown={filtered.length} total={users.length} label="users" />
          </>
        )}
      </Panel>

      <UserFormDialog
        open={editing !== null}
        initial={editing === 'new' || editing === null ? null : editing}
        existingIds={users.map((u) => u.eid)}
        onClose={() => setEditing(null)}
        onSave={save}
      />

      <Dialog
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing?.name ?? ''}
        description={viewing ? `${viewing.type === 'lecturer' ? 'Lecturer' : 'Student'} · ${viewing.eid}` : ''}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setViewing(null)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setEditing(viewing)
                setViewing(null)
              }}
            >
              <Pencil /> Edit
            </Button>
          </>
        }
      >
        {viewing && (
          <dl className="grid grid-cols-[130px_1fr] gap-y-3 text-sm">
            <dt className="text-muted-foreground">Faculty</dt>
            <dd>{viewing.faculty}</dd>
            <dt className="text-muted-foreground">Department</dt>
            <dd>{viewing.department}</dd>
            <dt className="text-muted-foreground">Contact Number</dt>
            <dd className="tabular-nums">{viewing.contact}</dd>
          </dl>
        )}
      </Dialog>

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={remove}
        title="Delete user?"
        description={`Are you sure you want to delete ${deleting?.name ?? ''} (${deleting?.eid ?? ''})? Existing reservations will keep a record of this user.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        tone="danger"
      />
    </>
  )
}

export function RowActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView?: () => void
  onEdit?: () => void
  onDelete?: () => void
}) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {onView && (
        <Button variant="ghost" size="icon-sm" aria-label="View" onClick={onView}>
          <Eye />
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="icon-sm" aria-label="Edit" onClick={onEdit}>
          <Pencil />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="icon-sm" aria-label="Delete" className="text-danger hover:bg-danger-soft hover:text-danger-strong" onClick={onDelete}>
          <Trash2 />
        </Button>
      )}
    </div>
  )
}

function UserFormDialog({
  open,
  initial,
  existingIds,
  onClose,
  onSave,
}: {
  open: boolean
  initial: AppUser | null
  existingIds: string[]
  onClose: () => void
  onSave: (u: AppUser) => void
}) {
  const [form, setForm] = useState<FormState>(initial ?? emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})
  const [key, setKey] = useState<string | null>(null)

  // Reset the form whenever the dialog is opened for a different record.
  const currentKey = open ? (initial?.eid ?? 'new') : null
  if (currentKey !== key) {
    setKey(currentKey)
    setForm(initial ?? emptyForm)
    setErrors({})
  }

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const next: typeof errors = {}
    if (!form.eid.trim()) next.eid = 'University E-ID is required'
    else if (!initial && existingIds.includes(form.eid.trim())) next.eid = 'A user with this E-ID already exists'
    if (!form.name.trim()) next.name = 'Full name is required'
    if (!form.faculty.trim()) next.faculty = 'Faculty is required'
    if (!form.department.trim()) next.department = 'Department is required'
    if (!form.type) next.type = 'Please select a user type'
    if (form.contact && !/^[+\d][\d\s-]{6,}$/.test(form.contact)) next.contact = 'Enter a valid contact number'
    setErrors(next)
    if (Object.keys(next).length) return
    onSave({ ...form, eid: form.eid.trim(), type: form.type as UserType })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={initial ? 'Edit User' : 'Add User'}
      description={initial ? `Update the details for ${initial.name}.` : 'Register a student or lecturer who can reserve laboratories.'}
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="user-form">
            {initial ? 'Save Changes' : 'Add User'}
          </Button>
        </>
      }
    >
      <form id="user-form" onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
        <Field label="University E-ID" htmlFor="u-eid" required error={errors.eid} hint={initial ? 'E-ID cannot be changed.' : undefined}>
          <Input id="u-eid" value={form.eid} onChange={set('eid')} disabled={!!initial} placeholder="E20210451" invalid={!!errors.eid} />
        </Field>
        <Field label="User Type" htmlFor="u-type" required error={errors.type}>
          <Select id="u-type" value={form.type} onChange={set('type')} invalid={!!errors.type}>
            <option value="">Select type</option>
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
          </Select>
        </Field>
        <Field label="Full Name" htmlFor="u-name" required error={errors.name} className="sm:col-span-2">
          <Input id="u-name" value={form.name} onChange={set('name')} placeholder="e.g. Amara Perera" invalid={!!errors.name} />
        </Field>
        <Field label="Faculty" htmlFor="u-faculty" required error={errors.faculty}>
          <Select id="u-faculty" value={form.faculty} onChange={set('faculty')} invalid={!!errors.faculty}>
            <option value="">Select faculty</option>
            <option>Faculty of Science</option>
            <option>Faculty of Engineering</option>
            <option>Faculty of Computing</option>
            <option>Faculty of Medicine</option>
          </Select>
        </Field>
        <Field label="Department" htmlFor="u-dept" required error={errors.department}>
          <Input id="u-dept" value={form.department} onChange={set('department')} placeholder="e.g. Chemistry" invalid={!!errors.department} />
        </Field>
        <Field label="Contact Number" htmlFor="u-contact" error={errors.contact} hint="Optional" className="sm:col-span-2">
          <Input id="u-contact" value={form.contact} onChange={set('contact')} placeholder="+94 7X XXX XXXX" invalid={!!errors.contact} />
        </Field>
      </form>
    </Dialog>
  )
}
