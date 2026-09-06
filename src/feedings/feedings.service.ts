import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedingDto } from './dto/create-feeding.dto';
import { RecordPeakDto } from './dto/record-peak.dto';
import { calculateAdaptivePeak } from './utils/peak-estimator';

@Injectable()
export class FeedingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(starterId: string, dto: CreateFeedingDto) {
    const starter = await this.prisma.starter.findUnique({
      where: { id: starterId },
    });

    if (!starter) {
      throw new NotFoundException(
        `Fermento com ID '${starterId}' não encontrado.`,
      );
    }

    const fedAt = dto.fedAt ? new Date(dto.fedAt) : new Date();
    const totalWeightG =
      dto.starterWeightG + dto.waterWeightG + dto.flourWeightG;

    // Busca histórico de alimentações com pico real registrado
    const pastFeedings = await this.prisma.feeding.findMany({
      where: {
        starterId,
        actualDurationMin: { not: null },
      },
      select: {
        ratio: true,
        ambientTempC: true,
        actualDurationMin: true,
      },
    });

    // Calcula com base nos dados adaptativos
    const { estimatedMinutes, estimatedPeakTime } = calculateAdaptivePeak(
      dto.ratio,
      dto.ambientTempC,
      pastFeedings,
      fedAt,
    );

    const [feeding] = await this.prisma.$transaction([
      this.prisma.feeding.create({
        data: {
          starterId,
          ratio: dto.ratio,
          starterWeightG: dto.starterWeightG,
          waterWeightG: dto.waterWeightG,
          flourWeightG: dto.flourWeightG,
          totalWeightG,
          ambientTempC: dto.ambientTempC,
          estimatedPeakMinutes: estimatedMinutes,
          estimatedPeakTime,
          fedAt,
        },
      }),
      this.prisma.starter.update({
        where: { id: starterId },
        data: { updatedAt: new Date() },
      }),
    ]);

    return feeding;
  }

  async findByStarter(starterId: string) {
    return this.prisma.feeding.findMany({
      where: { starterId },
      orderBy: { fedAt: 'desc' },
    });
  }

  async recordPeak(feedingId: string, dto: RecordPeakDto) {
    const feeding = await this.prisma.feeding.findUnique({
      where: { id: feedingId },
    });

    if (!feeding) {
      throw new NotFoundException(
        `Registro de alimentação com ID '${feedingId}' não encontrado.`,
      );
    }

    const actualPeakTime = new Date(dto.actualPeakTime);
    const actualDurationMin = Math.round(
      (actualPeakTime.getTime() - new Date(feeding.fedAt).getTime()) /
        (1000 * 60),
    );

    return this.prisma.feeding.update({
      where: { id: feedingId },
      data: {
        actualPeakTime,
        actualDurationMin: Math.max(0, actualDurationMin),
        growthMultiplier: dto.growthMultiplier,
        aromaProfile: dto.aromaProfile,
        notes: dto.notes,
      },
    });
  }

  async remove(id: string) {
    const feeding = await this.prisma.feeding.findUnique({ where: { id } });
    if (!feeding) {
      throw new NotFoundException(`Alimentação não encontrada.`);
    }
    return this.prisma.feeding.delete({ where: { id } });
  }
}
