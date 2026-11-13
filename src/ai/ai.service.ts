import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GoogleGenAI, Type } from '@google/genai';
import { PrismaService } from '../prisma/prisma.service';
import { AiHealthAnalysisResponse } from './interfaces/ai-analysis.interface';
import { StarterStatus } from '../generated/prisma/client';

@Injectable()
export class AiService {
  private readonly ai: GoogleGenAI;

  constructor(private readonly prisma: PrismaService) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('AVISO: GEMINI_API_KEY não encontrada no ambiente.');
    }
    this.ai = new GoogleGenAI({ apiKey: apiKey || '' });
  }

  async analyzeStarterHealth(starterId: string): Promise<any> {
    const starter = await this.prisma.starter.findUnique({
      where: { id: starterId },
      include: {
        feedings: {
          take: 10,
          orderBy: { fedAt: 'desc' },
        },
      },
    });

    if (!starter) {
      throw new NotFoundException(
        `Fermento com ID '${starterId}' não encontrado.`,
      );
    }

    if (starter.feedings.length === 0) {
      throw new NotFoundException(
        'É necessário registrar ao menos uma alimentação antes de gerar a análise de IA.',
      );
    }

    const payloadContext = {
      starterName: starter.name,
      flourType: starter.flourType,
      location: starter.location,
      notes: starter.notes,
      totalFeedings: starter.feedings.length,
      history: starter.feedings.map((f) => ({
        ratio: f.ratio,
        totalWeightG: f.totalWeightG,
        ambientTempC: f.ambientTempC,
        estimatedPeakMinutes: f.estimatedPeakMinutes,
        actualDurationMin: f.actualDurationMin,
        growthMultiplier: f.growthMultiplier,
        aromaProfile: f.aromaProfile,
        notes: f.notes,
        fedAt: f.fedAt,
      })),
    };

    const prompt = `Você é um mestre padeiro especialista em microbiologia de fermentação natural (Sourdough/Levain).
Analise o histórico de alimentações do fermento a seguir e forneça um diagnóstico técnico, porém claro e acionável para um padeiro caseiro:

${JSON.stringify(payloadContext, null, 2)}`;

    try {
      const response = await this.ai.interactions.create({
        model: 'gemini-3.5-flash-lite',
        input: prompt,
        // config: {
        system_instruction:
          'Você é o assistente biológico do Levure. Avalie o vigor biológico com base no volume alcançado (>2.5x é excelente), tempo até o pico e aromas informados (aromas acéticos ou alcoólicos recorrentes indicam subnutrição e pedem proporções maiores como 1:3:3 ou 1:4:4). Responda sempre em português do Brasil estritamente no esquema JSON exigido.',
        response_format: {
          type: 'text',
          mime_type: 'application/json',
          schema: {
            type: Type.OBJECT,
            properties: {
              healthScore: {
                type: Type.INTEGER,
                description: 'Pontuação de vitalidade de 0 a 100',
              },
              status: {
                type: Type.STRING,
                enum: ['EXCELLENT', 'GOOD', 'NEEDS_ATTENTION', 'CRITICAL'],
              },
              summary: {
                type: Type.STRING,
                description:
                  'Resumo conciso da saúde da cultura em 2 a 3 frases',
              },
              vigorObservation: {
                type: Type.STRING,
                description:
                  'Análise detalhada do crescimento e tempo de resposta',
              },
              acidityObservation: {
                type: Type.STRING,
                description: 'Análise da acidez e aromas relatados',
              },
              temperatureImpact: {
                type: Type.STRING,
                description:
                  'Como a temperatura ambiente recente afetou a velocidade',
              },
              readyToBake: {
                type: Type.BOOLEAN,
                description: 'Se o fermento está apto para produzir pão hoje',
              },
              bakingReason: {
                type: Type.STRING,
                description: 'Justificativa da prontidão para panificação',
              },
              recommendedRatio: {
                type: Type.STRING,
                description:
                  'Sugestão de proporção para a próxima alimentação (ex: 1:2:2, 1:3:3)',
              },
              flourTypeHint: {
                type: Type.STRING,
                description: 'Recomendação sobre a farinha a ser usada',
              },
              targetAmbientTemp: {
                type: Type.STRING,
                description: 'Faixa de temperatura ideal sugerida em °C',
              },
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    priority: {
                      type: Type.STRING,
                      enum: ['HIGH', 'MEDIUM', 'LOW'],
                    },
                  },
                  required: ['title', 'description', 'priority'],
                },
              },
            },
            required: [
              'healthScore',
              'status',
              'summary',
              'vigorObservation',
              'acidityObservation',
              'temperatureImpact',
              'readyToBake',
              'bakingReason',
              'recommendedRatio',
              'flourTypeHint',
              'targetAmbientTemp',
              'recommendations',
            ],
          },
        },
        // },
      });

      const parsed: AiHealthAnalysisResponse = JSON.parse(
        response.output_text || '{}',
      );

      // Persistir o diagnóstico no banco
      const saved = await this.prisma.healthAnalysis.create({
        data: {
          starterId,
          healthScore: parsed.healthScore,
          status: parsed.status,
          summary: parsed.summary,
          vigorObservation: parsed.vigorObservation,
          acidityObservation: parsed.acidityObservation,
          temperatureImpact: parsed.temperatureImpact,
          readyToBake: parsed.readyToBake,
          bakingReason: parsed.bakingReason,
          recommendedRatio: parsed.recommendedRatio,
          flourTypeHint: parsed.flourTypeHint,
          targetAmbientTemp: parsed.targetAmbientTemp,
          recommendationsJson: parsed.recommendations as any,
          analyzedFeedingsCount: starter.feedings.length,
        },
      });

      // Atualizar status do starter se necessário
      let newStarterStatus: StarterStatus = starter.status;
      if (parsed.status === 'EXCELLENT' || parsed.status === 'GOOD') {
        newStarterStatus = StarterStatus.HEALTHY;
      } else if (
        parsed.status === 'NEEDS_ATTENTION' ||
        parsed.status === 'CRITICAL'
      ) {
        newStarterStatus = StarterStatus.ATTENTION;
      }

      await this.prisma.starter.update({
        where: { id: starterId },
        data: { status: newStarterStatus },
      });

      return saved;
    } catch (err: any) {
      console.error('Erro na chamada da API Gemini:', err);
      throw new InternalServerErrorException(
        `Falha ao processar diagnóstico inteligente: ${err.message || 'Erro desconhecido'}`,
      );
    }
  }

  async getLatestAnalysis(starterId: string) {
    return this.prisma.healthAnalysis.findFirst({
      where: { starterId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
