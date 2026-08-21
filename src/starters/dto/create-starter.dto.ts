import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { StarterStatus } from 'src/generated/prisma/client';

export class CreateStarterDto {
  @ApiProperty({
    example: 'Vó Amália',
    description: 'Nome de identificação do fermento',
  })
  @IsString({ message: 'O nome deve ser um texto' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @MaxLength(80, { message: 'O nome não pode exceder 80 caracteres' })
  name!: string;

  @ApiProperty({
    example: 'Trigo branco',
    description: 'Tipo de farinha base utilizada no cultivo',
  })
  @IsString({ message: 'O tipo de farinha deve ser um texto' })
  @IsNotEmpty({ message: 'O tipo de farinha é obrigatório' })
  flourType!: string;

  @ApiProperty({
    example: 'Bancada da cozinha',
    description: 'Local onde o pote fica armazenado',
  })
  @IsString({ message: 'O local do pote deve ser um texto' })
  @IsNotEmpty({ message: 'O local do pote é obrigatório' })
  location!: string;

  @ApiPropertyOptional({
    example: 'Fermento de família, mantido há quase um ano.',
    description: 'Observações e características sobre o fermento',
  })
  @IsOptional()
  @IsString({ message: 'As notas devem ser um texto' })
  notes?: string;

  @ApiPropertyOptional({
    enum: StarterStatus,
    default: StarterStatus.NEW,
    description: 'Status de atividade/saúde do fermento',
  })
  @IsOptional()
  @IsEnum(StarterStatus, {
    message: 'Status inválido. Use HEALTHY, ATTENTION ou NEW',
  })
  status?: StarterStatus;
}
