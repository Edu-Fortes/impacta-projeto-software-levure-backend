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
  console.log('Limpando registros anteriores...');
  await prisma.healthAnalysis.deleteMany();
  await prisma.feeding.deleteMany();
  await prisma.starter.deleteMany();

  const now = new Date();

  // Helper para criar datas relativas em dias e horas
  const daysAgo = (days: number, hoursOffset = 0) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    d.setHours(d.getHours() - hoursOffset);
    return d;
  };

  console.log('Criando fermentos...');

  const voAmalia = await prisma.starter.create({
    data: {
      name: 'Vó Amália',
      flourType: 'Trigo branco',
      location: 'Bancada da cozinha',
      notes:
        'Cultivo familiar mantido com alimentação regular. Ótimo vigor e alvéolos estruturados.',
      status: StarterStatus.HEALTHY,
      createdAt: daysAgo(120),
    },
  });

  const centeioSelvagem = await prisma.starter.create({
    data: {
      name: 'Centeio Selvagem',
      flourType: 'Centeio integral',
      location: 'Armário superior',
      notes:
        'Cultura 100% centeio integral. Fermentação vigorosa, porém com acidez muito acentuada recentemente.',
      status: StarterStatus.ATTENTION,
      createdAt: daysAgo(60),
    },
  });

  const levainIntegral = await prisma.starter.create({
    data: {
      name: 'Levain Integral',
      flourType: 'Trigo integral',
      location: 'Bancada da cozinha',
      notes: 'Cultivo jovem iniciado recentemente para testes.',
      status: StarterStatus.NEW,
      createdAt: daysAgo(5),
    },
  });

  console.log('Populando histórico calibrado da Vó Amália...');

  // 6 registros na proporção 1:2:2 nos últimos dias (atinge o critério de calibração e análise robusta)
  const amaliaFeedings = [
    {
      days: 0,
      hours: 4,
      temp: 24,
      dur: 460,
      vol: 2.8,
      aroma: AromaProfile.BALANCED,
      notes:
        'Alimentação feita hoje pela manhã. Fermento no ápice com aroma doce e levedurado.',
    },
    {
      days: 1,
      hours: 10,
      temp: 24,
      dur: 470,
      vol: 2.7,
      aroma: AromaProfile.BALANCED,
      notes: 'Ótima resposta na bancada.',
    },
    {
      days: 2,
      hours: 12,
      temp: 26,
      dur: 430,
      vol: 3.0,
      aroma: AromaProfile.FRUITY,
      notes: 'Dia mais quente, triplicou o volume e antecipou o pico.',
    },
    {
      days: 3,
      hours: 14,
      temp: 24,
      dur: 480,
      vol: 2.6,
      aroma: AromaProfile.BALANCED,
      notes: 'Alimentação de manutenção.',
    },
    {
      days: 4,
      hours: 14,
      temp: 23,
      dur: 500,
      vol: 2.5,
      aroma: AromaProfile.BALANCED,
      notes: 'Temperatura amena, demorou 8h20min para o ápice.',
    },
    {
      days: 6,
      hours: 15,
      temp: 24,
      dur: 480,
      vol: 2.7,
      aroma: AromaProfile.FRUITY,
      notes: 'Refresco semanal habitual.',
    },
  ];

  for (const f of amaliaFeedings) {
    const fedTime = daysAgo(f.days, f.hours);
    const peakTime = new Date(fedTime.getTime() + f.dur * 60 * 1000);

    await prisma.feeding.create({
      data: {
        starterId: voAmalia.id,
        ratio: '1:2:2',
        starterWeightG: 40,
        waterWeightG: 80,
        flourWeightG: 80,
        totalWeightG: 200,
        ambientTempC: f.temp,
        estimatedPeakMinutes: f.dur,
        estimatedPeakTime: peakTime,
        actualPeakTime: peakTime,
        actualDurationMin: f.dur,
        growthMultiplier: f.vol,
        aromaProfile: f.aroma,
        notes: f.notes,
        fedAt: fedTime,
      },
    });
  }

  console.log(
    'Populando dados para Centeio Selvagem (com acúmulo de acidez)...',
  );

  const centeioFeedings = [
    {
      days: 1,
      hours: 6,
      temp: 26,
      dur: 340,
      vol: 1.8,
      aroma: AromaProfile.ACIDIC,
      notes: 'Cheiro pungente e perda rápida de sustentação.',
    },
    {
      days: 3,
      hours: 8,
      temp: 25,
      dur: 360,
      vol: 1.9,
      aroma: AromaProfile.ACIDIC,
      notes: 'Glúten degradando rápido.',
    },
  ];

  for (const f of centeioFeedings) {
    const fedTime = daysAgo(f.days, f.hours);
    const peakTime = new Date(fedTime.getTime() + f.dur * 60 * 1000);

    await prisma.feeding.create({
      data: {
        starterId: centeioSelvagem.id,
        ratio: '1:2:2',
        starterWeightG: 40,
        waterWeightG: 80,
        flourWeightG: 80,
        totalWeightG: 200,
        ambientTempC: f.temp,
        estimatedPeakMinutes: 420,
        estimatedPeakTime: peakTime,
        actualPeakTime: peakTime,
        actualDurationMin: f.dur,
        growthMultiplier: f.vol,
        aromaProfile: f.aroma,
        notes: f.notes,
        fedAt: fedTime,
      },
    });
  }

  console.log('Populando alimentação única para Levain Integral...');

  const integralFedTime = daysAgo(1, 4);
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
      estimatedPeakTime: new Date(integralFedTime.getTime() + 270 * 60 * 1000),
      fedAt: integralFedTime,
    },
  });

  console.log('Seed executado com sucesso e datas atualizadas!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
