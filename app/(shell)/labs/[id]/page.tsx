import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import { labById, labs } from '@/lib/data'
import { LabDetails } from '@/components/screens/lab-details'

export function generateStaticParams() {
  return labs.map((l) => ({ id: l.id }))
}

export default async function LabDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lab = labById(id)
  if (!lab) notFound()

  return (
    <LabDetails
      lab={lab}
      breadcrumb={
        <span className="flex items-center gap-1">
          <Link href="/labs" className="hover:underline">
            Laboratories
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{lab.id}</span>
        </span>
      }
    />
  )
}
