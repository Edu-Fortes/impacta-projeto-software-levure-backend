import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AromaProfile } from 'src/generated/prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RecordPeakDto {
  @ApiProperty({
    example: '2026-09-01T19:30:00.000Z',
    description: 'Horário em que o pico foi observado',
  })
  @IsDateString()
  @IsNotEmpty()
  actualPeakTime!: string;

  @ApiProperty({
    example: 2.5,
    description:
      'Multiplicador de volume alcançado (ex: 2.0 = dobrou, 3.0 = triplicou)',
  })
  @IsNumber()
  @Min(1)
  growthMultiplier!: number;

  @ApiPropertyOptional({
    enum: AromaProfile,
    example: AromaProfile.FRUITY,
    description: 'Aroma observado no pico',
  })
  @IsOptional()
  @IsEnum(AromaProfile)
  aromaProfile?: AromaProfile;

  @ApiPropertyOptional({
    example: 'Cresceu rápido e apresentou aroma suave',
    description: 'Notas da observação',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
