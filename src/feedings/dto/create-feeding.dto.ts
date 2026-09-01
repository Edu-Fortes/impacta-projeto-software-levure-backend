import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateFeedingDto {
  @ApiProperty({
    example: '1:2:2',
    description: 'Proporção fermento:água:farinha',
  })
  @IsString()
  @IsNotEmpty()
  ratio!: string;

  @ApiProperty({
    example: 50,
    description: 'Peso do fermento (isca) em gramas',
  })
  @IsNumber()
  @Min(1)
  starterWeightG!: number;

  @ApiProperty({ example: 100, description: 'Peso da água em gramas' })
  @IsNumber()
  @Min(1)
  waterWeightG!: number;

  @ApiProperty({ example: 100, description: 'Peso da farinha em gramas' })
  @IsNumber()
  @Min(1)
  flourWeightG!: number;

  @ApiProperty({ example: 24, description: 'Temperatura ambiente em °C' })
  @IsNumber()
  ambientTempC!: number;

  @ApiPropertyOptional({
    example: '2026-09-01T12:00:00.000Z',
    description: 'Momento da alimentação',
  })
  @IsOptional()
  fedAt?: string;
}
