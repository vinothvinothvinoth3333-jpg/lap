import Image from 'next/image'
import { FlaskConical, CalendarCheck2, ShieldCheck, Microscope } from 'lucide-react'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-background">
      {/* Left panel: illustration + project introduction */}
      <section className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex xl:w-[55%]">
        <Image
          src="/images/login-lab.png"
          alt=""
          fill
          priority
          className="object-cover opacity-30 mix-blend-luminosity"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/85 to-primary/60" />

        <div className="relative flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary-foreground/10 ring-1 ring-primary-foreground/20">
            <FlaskConical className="size-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wide">UNIVERSITY LAB MANAGEMENT</span>
            <span className="text-xs text-primary-foreground/70">Staff Console</span>
          </div>
        </div>

        <div className="relative flex max-w-lg flex-col gap-6">
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-balance">
            Laboratory Booking &amp; Management System
          </h1>
          <p className="text-base leading-relaxed text-primary-foreground/80 text-pretty">
            A single place for laboratory staff to manage laboratories, check availability,
            approve reservations and track equipment across the university.
          </p>
          <ul className="flex flex-col gap-3 text-sm">
            <li className="flex items-center gap-3">
              <CalendarCheck2 className="size-4 text-teal" />
              Conflict-free reservations with automatic double-booking prevention
            </li>
            <li className="flex items-center gap-3">
              <Microscope className="size-4 text-teal" />
              Laboratory and equipment inventory in one view
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="size-4 text-teal" />
              Offline desktop application for authorised staff only
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-primary-foreground/60">
          Version 1.0 · Qt 6 Widgets · SQLite · For internal university use
        </p>
      </section>

      {/* Right panel: login form */}
      <section className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <LoginForm />
      </section>
    </main>
  )
}
