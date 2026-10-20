'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, CalendarDays, Eye, Check, X, Ban, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Panel, EmptyState } from '@/components/kit/page'
import { Input, Select, SegmentedControl } from '@/components/kit/field'
import { Table, THead, TH, TBody, TR, TD, TableFooter } from '@/components/kit/table'
import { BookingStatusBadge } from '@/components/kit/status-badge'
import { ConfirmDialog } from '@/components/kit/dialog'
import { useToast } from '@/components/kit/toast'
import { bookings as seed, labs, labById, userByEid, formatDate, formatTime, type Booking, type BookingStatus } from '@/lib/data'

type Filter = 'all' | BookingStatus

export function ReservationsManager() {
  const toast = useToast()
  const [items, setItems] = useState<Booking[]>(seed)
  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')
  const [date, setDate] = useState('')
  const [lab, setLab] = useState('all')
  const [action, setAction] = useState<{ type: 'approve' | 'reject' | 'cancel'; booking: Booking } | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items
      .filter(
        (b) =>
          (filter === 'all' || b.status === filter) &&
          (!date || b.date === date) &&
          (lab === 'all' || b.labId === lab) &&
          (!q ||
            b.id.toLowerCase().includes(q) ||
            userByEid(b.userEid)?.name.toLowerCase().includes(q) ||
            b.purpose.toLowerCase().includes(q)),
      )
      .sort((a, b) => (b.date + b.start).localeCompare(a.date + a.start))
  }, [items, filter, query, date, lab])

  const count = (s: BookingStatus) => items.filter((b) => b.status === s).length

  function apply() {
    if (!action) return
    const status: BookingStatus = action.type === 'approve' ? 'approved' : action.type === 'reject' ? 'rejected' : 'cancelled'
    setItems((prev) => prev.map((b) => (b.id === action.booking.id ? { ...b, status } : b)))
    toast({
      tone: action.type === 'approve' ? 'success' : action.type === 'reject' ? 'danger' : 'info',
      title: `Booking ${status}`,
      body: `${action.booking.id} has been ${status}.`,
    })
    setAction(null)
  }

  return (
    <>
      <Panel flush>
        <div className="flex flex-col gap-3 border-b border-border p-4">
          <SegmentedControl
            ariaLabel="Filter by status"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All', count: items.length },
              { value: 'pending', label: 'Pending', count: count('pending') },
              { value: 'approved', label: 'Approved', count: count('approved') },
              { value: 'rejected', label: 'Rejected', count: count('rejected') },
              { value: 'cancelled', label: 'Cancelled', count: count('cancelled') },
              { value: 'completed', label: 'Completed', count: count('completed') },
            ]}
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="w-full sm:w-72">
              <Input aria-label="Search reservations" placeholder="Search by booking ID, user or purpose" leading={<Search />} value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <div className="w-full sm:w-48">
              <Input aria-label="Filter by date" type="date" value={date} onChange={(e) => setDate(e.target.value)} leading={<Calendar />} />
            </div>
            <div className="w-full sm:w-64">
              <Select aria-label="Filter by laboratory" value={lab} onChange={(e) => setLab(e.target.value)}>
                <option value="all">All laboratories</option>
                {labs.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </div>
            {(query || date || lab !== 'all' || filter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery('')
                  setDate('')
                  setLab('all')
                  setFilter('all')
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={<CalendarDays />} title="No bookings found" description="Try changing your search or date filter." />
        ) : (
          <>
            <Table>
              <THead>
                <tr>
                  <TH sortable>Booking ID</TH>
                  <TH>User</TH>
                  <TH>Laboratory</TH>
                  <TH sortable>Date</TH>
                  <TH>Start</TH>
                  <TH>End</TH>
                  <TH>Purpose</TH>
                  <TH>Status</TH>
                  <TH align="right">Actions</TH>
                </tr>
              </THead>
              <TBody>
                {filtered.map((b) => (
                  <TR key={b.id}>
                    <TD className="font-mono text-xs">
                      <Link href={`/reservations/${b.id}`} className="hover:underline">
                        {b.id}
                      </Link>
                    </TD>
                    <TD className="font-medium">{userByEid(b.userEid)?.name}</TD>
                    <TD muted>{labById(b.labId)?.name}</TD>
                    <TD className="tabular-nums">{formatDate(b.date)}</TD>
                    <TD className="tabular-nums">{formatTime(b.start)}</TD>
                    <TD className="tabular-nums">{formatTime(b.end)}</TD>
                    <TD muted className="max-w-[220px] truncate">
                      {b.purpose}
                    </TD>
                    <TD>
                      <BookingStatusBadge status={b.status} />
                    </TD>
                    <TD align="right">
                      <div className="inline-flex items-center gap-0.5">
                        <Button variant="ghost" size="icon-sm" aria-label="View details" render={<Link href={`/reservations/${b.id}`} />}>
                          <Eye />
                        </Button>
                        {b.status === 'pending' && (
                          <>
                            <Button variant="ghost" size="icon-sm" aria-label="Approve" className="text-success-strong hover:bg-success-soft" onClick={() => setAction({ type: 'approve', booking: b })}>
                              <Check />
                            </Button>
                            <Button variant="ghost" size="icon-sm" aria-label="Reject" className="text-danger hover:bg-danger-soft hover:text-danger-strong" onClick={() => setAction({ type: 'reject', booking: b })}>
                              <X />
                            </Button>
                          </>
                        )}
                        {b.status === 'approved' && (
                          <Button variant="ghost" size="icon-sm" aria-label="Cancel booking" className="text-muted-foreground hover:text-foreground" onClick={() => setAction({ type: 'cancel', booking: b })}>
                            <Ban />
                          </Button>
                        )}
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
            <TableFooter shown={filtered.length} total={items.length} label="bookings" />
          </>
        )}
      </Panel>

      <ConfirmDialog
        open={action?.type === 'approve'}
        onClose={() => setAction(null)}
        onConfirm={apply}
        title="Approve Booking?"
        description={`Approve booking ${action?.booking.id ?? ''} for ${action ? labById(action.booking.labId)?.name : ''} on ${action ? formatDate(action.booking.date) : ''}?`}
        confirmLabel="Approve"
        confirmVariant="success"
        tone="success"
      />
      <ConfirmDialog
        open={action?.type === 'reject'}
        onClose={() => setAction(null)}
        onConfirm={apply}
        title="Reject Booking?"
        description={`Are you sure you want to reject booking ${action?.booking.id ?? ''}? The requester will be notified.`}
        confirmLabel="Reject"
        confirmVariant="danger"
        tone="danger"
      />
      <ConfirmDialog
        open={action?.type === 'cancel'}
        onClose={() => setAction(null)}
        onConfirm={apply}
        title="Cancel Booking?"
        description={`Cancel approved booking ${action?.booking.id ?? ''}? The time slot will become available again.`}
        confirmLabel="Cancel Booking"
        confirmVariant="danger"
        tone="warning"
      />
    </>
  )
}
