import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';

@ApiTags('AI Health Analysis (Saúde & Diagnóstico)')
@Controller('starters/:starterId')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze')
  @ApiOperation({
    summary: 'Gerar nova análise de saúde e recomendações com o Google Gemini',
  })
  @ApiResponse({
    status: 201,
    description: 'Diagnóstico estruturado gerado e persistido.',
  })
  analyze(@Param('starterId') starterId: string) {
    return this.aiService.analyzeStarterHealth(starterId);
  }

  @Get('latest-analysis')
  @ApiOperation({
    summary: 'Recuperar o diagnóstico mais recente salvo para este fermento',
  })
  @ApiResponse({ status: 200, description: 'Última análise retornada.' })
  getLatest(@Param('starterId') starterId: string) {
    return this.aiService.getLatestAnalysis(starterId);
  }

  @Get('analyses')
  @ApiOperation({
    summary:
      'Recuperar histórico completo de análises de IA para este fermento',
  })
  @ApiResponse({
    status: 200,
    description: 'Histórico de diagnósticos retornado com sucesso.',
  })
  getHistory(@Param('starterId') starterId: string) {
    return this.aiService.getAnalysisHistory(starterId);
  }
}
