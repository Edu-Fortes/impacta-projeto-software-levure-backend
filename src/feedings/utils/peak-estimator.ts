interface HistoricalFeeding {
  ratio: string;
  ambientTempC: number;
  actualDurationMin: number | null;
}

export function calculateAdaptivePeak(
  ratio: string,
  ambientTempC: number,
  history: HistoricalFeeding[] = [],
  fedAt: Date = new Date(),
): {
  estimatedMinutes: number;
  estimatedPeakTime: Date;
  confidence: 'default' | 'calibrated';
  samplesUsed: number;
} {
  const defaultMinutesByRatio: Record<string, number> = {
    '1:1:1': 270, // 4h30min
    '1:2:2': 450, // 7h30min
    '1:3:3': 570, // 9h30min
    '1:4:4': 690, // 11h30min
    '1:5:5': 810, // 13h30min
  };

  // Filtra histórico do mesmo starter com a mesma proporção e com pico registrado
  const validHistory = history.filter(
    (h) => h.ratio === ratio && h.actualDurationMin && h.actualDurationMin > 0,
  );

  let baseMinutesAt24C = defaultMinutesByRatio[ratio] || 450;
  let confidence: 'default' | 'calibrated' = 'default';

  // Se houver 5 ou mais registros, calibrar com a média real do usuário
  if (validHistory.length >= 5) {
    const normalizedTimes = validHistory.map((entry) => {
      const deltaTemp = entry.ambientTempC - 24;
      const factor = Math.pow(0.96, deltaTemp);
      // Desfaz a influência da temperatura daquele dia para achar a base a 24°C
      return entry.actualDurationMin! / factor;
    });

    const sum = normalizedTimes.reduce((acc, curr) => acc + curr, 0);
    baseMinutesAt24C = Math.round(sum / normalizedTimes.length);
    confidence = 'calibrated';
  }

  // Aplica o fator térmico atual sobre a base (seja padrão ou calibrada)
  const currentTempDelta = ambientTempC - 24;
  const currentTempFactor = Math.pow(0.96, currentTempDelta);

  const estimatedMinutes = Math.round(baseMinutesAt24C * currentTempFactor);
  const estimatedPeakTime = new Date(
    fedAt.getTime() + estimatedMinutes * 60 * 1000,
  );

  return {
    estimatedMinutes,
    estimatedPeakTime,
    confidence,
    samplesUsed: validHistory.length,
  };
}
