import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import {
  AromaProfile,
  PrismaClient,
  StarterStatus,
} from '../src/generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Limpando dados anteriores...');
  await prisma.feeding.deleteMany();
  await prisma.starter.deleteMany();

  console.log('Criando fermentos (Starters)...');

  const voAmalia = await prisma.starter.create({
    data: {
      name: 'Vó Amália',
      flourType: 'Trigo branco',
      location: 'Bancada da cozinha',
      notes:
        'Fermento de família, mantido há quase um ano. Dobra de volume com facilidade.',
      status: StarterStatus.ACTIVE,
      createdAt: new Date('2025-11-30T10:00:00Z'),
    },
  });

  const centeioSelvagem = await prisma.starter.create({
    data: {
      name: 'Centeio Selvagem',
      flourType: 'Centeio integral',
      location: 'Armário superior',
      notes: 'Fermento de centeio 100%, acidificação rápida.',
      status: StarterStatus.FRIDGE,
      createdAt: new Date('2026-01-15T14:00:00Z'),
    },
  });

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

  console.log(
    'Populando histórico calibrado para Vó Amália (6 registros 1:2:2)...',
  );

  // Histórico com 6 medições reais de pico na proporção 1:2:2
  // Média real calibrada a 24°C: aprox. 480 min (8h)
  await prisma.feeding.createMany({
    data: [
      {
        starterId: voAmalia.id,
        ratio: '1:2:2',
        starterWeightG: 50,
        waterWeightG: 100,
        flourWeightG: 100,
        totalWeightG: 250,
        ambientTempC: 24,
        estimatedPeakMinutes: 480,
        estimatedPeakTime: new Date('2026-08-17T16:00:00Z'),
        actualPeakTime: new Date('2026-08-17T16:00:00Z'),
        actualDurationMin: 480, // 8h
        growthMultiplier: 2.8,
        aromaProfile: AromaProfile.BALANCED,
        notes: 'Pico vigoroso e cheiro frutado suave.',
        fedAt: new Date('2026-08-17T08:00:00Z'),
      },
      {
        starterId: voAmalia.id,
        ratio: '1:2:2',
        starterWeightG: 50,
        waterWeightG: 100,
        flourWeightG: 100,
        totalWeightG: 250,
        ambientTempC: 24,
        estimatedPeakMinutes: 480,
        estimatedPeakTime: new Date('2026-08-16T16:00:00Z'),
        actualPeakTime: new Date('2026-08-16T15:50:00Z'),
        actualDurationMin: 470, // 7h50min
        growthMultiplier: 2.6,
        aromaProfile: AromaProfile.BALANCED,
        notes: 'Mantido na bancada durante todo o ciclo.',
        fedAt: new Date('2026-08-16T08:00:00Z'),
      },
      {
        starterId: voAmalia.id,
        ratio: '1:2:2',
        starterWeightG: 60,
        waterWeightG: 120,
        flourWeightG: 120,
        totalWeightG: 300,
        ambientTempC: 26,
        estimatedPeakMinutes: 442,
        estimatedPeakTime: new Date('2026-08-12T15:22:00Z'),
        actualPeakTime: new Date('2026-08-12T15:15:00Z'),
        actualDurationMin: 435, // 7h15min (acelerou devido ao calor de 26°C)
        growthMultiplier: 3.0,
        aromaProfile: AromaProfile.FRUITY,
        notes: 'Dia mais quente, atingiu quase o triplo do volume.',
        fedAt: new Date('2026-08-12T08:00:00Z'),
      },
      {
        starterId: voAmalia.id,
        ratio: '1:2:2',
        starterWeightG: 50,
        waterWeightG: 100,
        flourWeightG: 100,
        totalWeightG: 250,
        ambientTempC: 24,
        estimatedPeakMinutes: 480,
        estimatedPeakTime: new Date('2026-08-10T16:00:00Z'),
        actualPeakTime: new Date('2026-08-10T16:05:00Z'),
        actualDurationMin: 485, // 8h05min
        growthMultiplier: 2.7,
        aromaProfile: AromaProfile.BALANCED,
        notes: 'Estrutura de alvéolos muito consistente.',
        fedAt: new Date('2026-08-10T08:00:00Z'),
      },
      {
        starterId: voAmalia.id,
        ratio: '1:2:2',
        starterWeightG: 50,
        waterWeightG: 100,
        flourWeightG: 100,
        totalWeightG: 250,
        ambientTempC: 23,
        estimatedPeakMinutes: 500,
        estimatedPeakTime: new Date('2026-08-08T16:20:00Z'),
        actualPeakTime: new Date('2026-08-08T16:24:00Z'),
        actualDurationMin: 504, // 8h24min (mais lento por estar 23°C)
        growthMultiplier: 2.5,
        aromaProfile: AromaProfile.BALANCED,
        notes: 'Temperatura ambiente um pouco mais amena.',
        fedAt: new Date('2026-08-08T08:00:00Z'),
      },
      {
        starterId: voAmalia.id,
        ratio: '1:2:2',
        starterWeightG: 50,
        waterWeightG: 100,
        flourWeightG: 100,
        totalWeightG: 250,
        ambientTempC: 24,
        estimatedPeakMinutes: 480,
        estimatedPeakTime: new Date('2026-08-05T16:00:00Z'),
        actualPeakTime: new Date('2026-08-05T16:00:00Z'),
        actualDurationMin: 480, // 8h
        growthMultiplier: 2.7,
        aromaProfile: AromaProfile.BALANCED,
        notes: 'Alimentação de rotina semanal.',
        fedAt: new Date('2026-08-05T08:00:00Z'),
      },
    ],
  });

  console.log('Populando dados iniciais para Centeio e Levain Integral...');

  // Centeio com 1 alimentação (proporção 1:2:2)
  await prisma.feeding.create({
    data: {
      starterId: centeioSelvagem.id,
      ratio: '1:2:2',
      starterWeightG: 40,
      waterWeightG: 80,
      flourWeightG: 80,
      totalWeightG: 200,
      ambientTempC: 25,
      estimatedPeakMinutes: 432,
      estimatedPeakTime: new Date('2026-08-16T15:12:00Z'),
      actualPeakTime: new Date('2026-08-16T14:40:00Z'),
      actualDurationMin: 400,
      growthMultiplier: 2.2,
      aromaProfile: AromaProfile.ACIDIC,
      fedAt: new Date('2026-08-16T08:00:00Z'),
    },
  });

  // Levain Integral com 1 alimentação (sem pico registrado ainda - Cold Start)
  await prisma.feeding.create({
    data: {
      starterId: levainIntegral.id,
      ratio: '1:1:1',
      starterWeightG: 50,
      waterWeightG: 50,
      flourWeightG: 50,
      totalWeightG: 150,
      ambientTempC: 24,
      estimatedPeakMinutes: 270,
      estimatedPeakTime: new Date('2026-08-16T12:30:00Z'),
      fedAt: new Date('2026-08-16T08:00:00Z'),
    },
  });

  console.log('Seed da Sprint 2 executado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
