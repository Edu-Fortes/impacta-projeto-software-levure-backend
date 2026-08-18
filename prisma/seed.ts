import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient, StarterStatus } from 'src/generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Limpando dados anteriores...');
  await prisma.starter.deleteMany();

  console.log('Criando fermentos (Starters)...');

  // 1. Vó Amália (Saudável)
  const voAmalia = await prisma.starter.create({
    data: {
      name: 'Vó Amália',
      flourType: 'Trigo branco',
      location: 'Bancada da cozinha',
      notes:
        'Fermento de família, mantido há quase um ano. Dobra de volume com facilidade.',
      status: StarterStatus.HEALTHY,
      createdAt: new Date('2025-11-30T10:00:00Z'),
    },
  });

  // 2. Centeio Selvagem (Atenção)
  const centeioSelvagem = await prisma.starter.create({
    data: {
      name: 'Centeio Selvagem',
      flourType: 'Centeio integral',
      location: 'Armário superior',
      notes: 'Fermento de centeio 100%, acidificação rápida.',
      status: StarterStatus.ATTENTION,
      createdAt: new Date('2026-01-15T14:00:00Z'),
    },
  });

  // 3. Levain Integral (Novo)
  const levainIntegral = await prisma.starter.create({
    data: {
      name: 'Levain Integral',
      flourType: 'Trigo integral',
      location: 'Bancada da cozinha',
      notes: 'Iniciado recentemente com farinha integral orgânica.',
      status: StarterStatus.NEW,
      createdAt: new Date('2026-08-10T09:00:00Z'),
    },
  });

  console.log('Seed executado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
