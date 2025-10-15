import { PrismaClient, type Prisma } from '@prisma/client'
import crypto from 'node:crypto'

const prisma = new PrismaClient()
const hash = (s: string) => crypto.createHash('sha256').update(s).digest('hex')

async function main() {
  // Utenti: Owner e Assistant
  await prisma.user.upsert({
    where: { email: 'owner@liotti.hair' },
    update: {},
    create: {
      email: 'owner@liotti.hair',
      name: 'Owner Liotti',
      role: 'OWNER',
      passwordHash: hash('OwnerPass123'),
      locale: 'it',
      Owner: { create: {} },
    },
  })

  await prisma.user.upsert({
    where: { email: 'assistant@liotti.hair' },
    update: {},
    create: {
      email: 'assistant@liotti.hair',
      name: 'Assistant',
      role: 'ASSISTANT',
      passwordHash: hash('AssistantPass123'),
      locale: 'it',
      Assistant: { create: {} },
    },
  })

  // Servizi
  await prisma.service.createMany({
    data: [
      { name: 'Cut',   durationM: 30, priceCents: 2000 },
      { name: 'Beard', durationM: 15, priceCents: 1000 },
    ],
    skipDuplicates: true,
  })

  // Orari di apertura (0=Dom ... 6=Sab) — Dom/Lun chiuso; Mar–Sab 09–19, pausa 13–14
  const hours: Prisma.OpeningHoursCreateInput[] = [
    { weekday: 0, closed: true },
    { weekday: 1, closed: true },
    { weekday: 2, openMin: 540, closeMin: 1140, breakStartMin: 780, breakEndMin: 840, closed: false },
    { weekday: 3, openMin: 540, closeMin: 1140, breakStartMin: 780, breakEndMin: 840, closed: false },
    { weekday: 4, openMin: 540, closeMin: 1140, breakStartMin: 780, breakEndMin: 840, closed: false },
    { weekday: 5, openMin: 540, closeMin: 1140, breakStartMin: 780, breakEndMin: 840, closed: false },
    { weekday: 6, openMin: 540, closeMin: 1140, breakStartMin: 780, breakEndMin: 840, closed: false },
  ]

  for (const entry of hours) {
    const { weekday, ...schedule } = entry
    await prisma.openingHours.upsert({
      where: { weekday },
      update: {
        openMin: schedule.openMin ?? null,
        closeMin: schedule.closeMin ?? null,
        breakStartMin: schedule.breakStartMin ?? null,
        breakEndMin: schedule.breakEndMin ?? null,
        closed: schedule.closed ?? false,
      },
      create: entry,
    })
  }

  console.log('Seed OK: owner/assistant, servizi, orari creati.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
