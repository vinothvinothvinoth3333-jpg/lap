'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Pencil, Plus, MapPin, Users, Hash, CalendarPlus, Microscope, CalendarCheck2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageHeader, Panel, EmptyState } from '@/components/kit/page'
import { Table, THead, TH, TBody, TR, TD } from '@/components/kit/table'
import { LabStatusBadge, EquipmentStatusBadge, BookingStatusBadge } from '@/components/kit/status-badge'
import { useToast } from '@/components/kit/toast'
import { equipment as allEquipment, bookings, formatDate, formatTime, userByEid, TODAY, type Laboratory, type Equipment } from '@/lib/data'
import { LabFormDialog } from '@/components/screens/labs-manager'
import { EquipmentFormDialog } from '@/components/screens/equipment-manager'

export function LabDetails({ lab: initialLab, breadcrumb }: { lab: Laboratory; breadcrumb: React.ReactNode }) {
  const toast = useToast()
  const [lab, setLab] = useState(initialLab)
  const [editOpen, setEditOpen] = useState(false)
  const [addEqOpen, setAddEqOpen] = useState(false)
  const [equipment, setEquipment] = useState<Equipment[]>(allEquipment.filter((e) => e.labId === lab.id))

  const upcoming = bookings
    .filter((b) => b.labId === lab.id && b.date >= TODAY && (b.status === 'approved' || b.status === 'pending'))
    .sort((a, b) => (a.date + a.start).localeCompare(b.date + b.start))

  return (
    <>
      <PageHeader
        breadcrumb={breadcrumb}
        title={lab.name}
        subtitle={`${lab.id} · Room ${lab.number}`}
        actions={
          <>
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Pencil /> Edit Laboratory
            </Button>
            <Button render={<Link href={`/availability?lab=${lab.id}`} />}>
              <CalendarCheck2 /> Check Availability
            </Button>
          </>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Laboratory Information" className="xl:col-span-1">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current status</span>
              <LabStatusBadge status={lab.status} />
            </div>
            <dl className="grid grid-cols-[24px_1fr] gap-x-3 gap-y-4 text-sm">
              <Hash className="size-4 text-muted-foreground" />
              <div className="flex flex-col">
                <dt className="text-xs text-muted-foreground">Laboratory Number</dt>
                <dd className="font-medium">{lab.number}</dd>
              </div>
              <MapPin className="size-4 text-muted-foreground" />
              <div className="flex flex-col">
                <dt className="text-xs text-muted-foreground">Location</dt>
                <dd className="font-medium">{lab.location}</dd>
              </div>
              <Users className="size-4 text-muted-foreground" />
              <div className="flex flex-col">
                <dt className="text-xs text-muted-foreground">Capacity</dt>
                <dd className="font-medium tabular-nums">{lab.capacity} persons</dd>
              </div>
            </dl>
            <div className="flex flex-col gap-1 border-t border-border pt-4">
              <span className="text-xs text-muted-foreground">Description</span>
              <p className="text-sm leading-relaxed text-pretty">{lab.description}</p>
            </div>
          </div>
        </Panel>

        <Panel
          title="Equipment"
          description={`${equipment.length} equipment types assigned to this laboratory`}
          className="xl:col-span-2"
          flush
          actions={
            <Button size="sm" onClick={() => setAddEqOpen(true)}>
              <Plus /> Add Equipment
            </Button>
          }
        >
          {equipment.length === 0 ? (
            <EmptyState icon={<Microscope />} title="No equipment records found" description="Add equipment to make it selectable when creating a reservation." />
          ) : (
            <Table>
              <THead>
                <tr>
                  <TH>Equipment</TH>
                  <TH align="right">Total</TH>
                  <TH align="right">Available</TH>
                  <TH>Condition</TH>
                  <TH>Status</TH>
                </tr>
              </THead>
              <TBody>
                {equipment.map((e) => (
                  <TR key={e.id}>
                    <TD>
                      <div className="flex flex-col">
                        <span className="font-medium">{e.name}</span>
                        <span className="font-mono text-[11px] text-muted-foreground">{e.id}</span>
                      </div>
                    </TD>
                    <TD align="right" className="tabular-nums">
                      {e.total}
                    </TD>
                    <TD align="right" className="tabular-nums">
                      <span className={e.available === 0 ? 'text-danger-strong' : 'text-success-strong'}>{e.available}</span>
                      <span className="text-muted-foreground"> / {e.total}</span>
                    </TD>
                    <TD muted>{e.condition}</TD>
                    <TD>
                      <EquipmentStatusBadge status={e.status} />
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </Panel>
      </div>

      <Panel
        title="Upcoming Reservations"
        description="Approved and pending bookings for this laboratory"
        flush
        actions={
          <Button size="sm" variant="outline" render={<Link href={`/reservations/new?lab=${lab.id}`} />}>
            <CalendarPlus /> New Reservation
          </Button>
        }
      >
        {upcoming.length === 0 ? (
          <EmptyState icon={<CalendarPlus />} title="No upcoming bookings" description="This laboratory has no approved or pending reservations." />
        ) : (
          <Table>
            <THead>
              <tr>
                <TH>Booking ID</TH>
                <TH>Date</TH>
                <TH>Time</TH>
                <TH>User</TH>
                <TH>Purpose</TH>
                <TH>Status</TH>
              </tr>
            </THead>
            <TBody>
              {upcoming.map((b) => (
                <TR key={b.id}>
                  <TD className="font-mono text-xs">
                    <Link href={`/reservations/${b.id}`} className="hover:underline">
                      {b.id}
                    </Link>
                  </TD>
                  <TD>{formatDate(b.date)}</TD>
                  <TD className="tabular-nums">
                    {formatTime(b.start)} – {formatTime(b.end)}
                  </TD>
                  <TD>{userByEid(b.userEid)?.name}</TD>
                  <TD muted className="max-w-[280px] truncate">
                    {b.purpose}
                  </TD>
                  <TD>
                    <BookingStatusBadge status={b.status} />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </Panel>

      <LabFormDialog
        open={editOpen}
        initial={lab}
        nextId={lab.id}
        onClose={() => setEditOpen(false)}
        onSave={(l) => {
          setLab(l)
          setEditOpen(false)
          toast({ tone: 'success', title: 'Laboratory updated', body: `${l.name} saved successfully.` })
        }}
      />
      <EquipmentFormDialog
        open={addEqOpen}
        initial={null}
        fixedLabId={lab.id}
        nextId={`EQ-${String(allEquipment.length + 1).padStart(3, '0')}`}
        onClose={() => setAddEqOpen(false)}
        onSave={(e) => {
          setEquipment((prev) => [...prev, e])
          setAddEqOpen(false)
          toast({ tone: 'success', title: 'Equipment added', body: `${e.name} added to ${lab.name}.` })
        }}
      />
    </>
  )
}
