import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FeedingsService } from './feedings.service';
import { CreateFeedingDto } from './dto/create-feeding.dto';
import { RecordPeakDto } from './dto/record-peak.dto';

@ApiTags('Feedings (Alimentações)')
@Controller()
export class FeedingsController {
  constructor(private readonly feedingsService: FeedingsService) {}

  @Post('starters/:starterId/feedings')
  @ApiOperation({ summary: 'Registrar uma nova alimentação para um fermento' })
  @ApiResponse({
    status: 201,
    description: 'Alimentação registrada e pico estimado.',
  })
  create(
    @Param('starterId') starterId: string,
    @Body() createFeedingDto: CreateFeedingDto,
  ) {
    return this.feedingsService.create(starterId, createFeedingDto);
  }

  @Get('starters/:starterId/feedings')
  @ApiOperation({ summary: 'Listar histórico de alimentações de um fermento' })
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso.' })
  findByStarter(@Param('starterId') starterId: string) {
    return this.feedingsService.findByStarter(starterId);
  }

  @Patch('feedings/:id/peak')
  @ApiOperation({
    summary: 'Registrar o momento e volume do pico real atingido',
  })
  @ApiResponse({
    status: 200,
    description: 'Pico real registrado com sucesso.',
  })
  recordPeak(@Param('id') id: string, @Body() recordPeakDto: RecordPeakDto) {
    return this.feedingsService.recordPeak(id, recordPeakDto);
  }

  @Delete('feedings/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover um registro de alimentação' })
  @ApiResponse({ status: 204, description: 'Alimentação removida.' })
  remove(@Param('id') id: string) {
    return this.feedingsService.remove(id);
  }
}
