import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStarterDto } from './dto/create-starter.dto';
import { UpdateStarterDto } from './dto/update-starter.dto';

@Injectable()
export class StartersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createStarterDto: CreateStarterDto) {
    return this.prisma.starter.create({
      data: createStarterDto,
    });
  }

  async findAll(search?: string) {
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { flourType: { contains: search, mode: 'insensitive' as const } },
            { location: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    return this.prisma.starter.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      include: {
        feedings: {
          take: 1,
          orderBy: { fedAt: 'desc' },
        },
      },
    });
  }

  async findOne(id: string) {
    const starter = await this.prisma.starter.findUnique({
      where: { id },
      include: {
        feedings: {
          orderBy: { fedAt: 'desc' },
        },
      },
    });

    if (!starter) {
      throw new NotFoundException(
        `Fermento com ID '${id}' não foi encontrado.`,
      );
    }

    return starter;
  }

  async update(id: string, updateStarterDto: UpdateStarterDto) {
    await this.findOne(id);

    return this.prisma.starter.update({
      where: { id },
      data: updateStarterDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.starter.delete({
      where: { id },
    });
  }

  async getDashboardSummary() {
    const [totalStarters, healthyCount, attentionCount, newCount] =
      await Promise.all([
        this.prisma.starter.count(),
        this.prisma.starter.count({ where: { status: 'ACTIVE' } }),
        this.prisma.starter.count({ where: { status: 'FRIDGE' } }),
        this.prisma.starter.count({ where: { status: 'NEW' } }),
      ]);

    return {
      activeStartersCount: totalStarters,
      healthyCount,
      attentionCount,
      newCount,
    };
  }
}
