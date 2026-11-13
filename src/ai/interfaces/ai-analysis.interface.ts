export interface AiRecommendation {
  title: string;
  description: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface AiHealthAnalysisResponse {
  healthScore: number;
  status: 'EXCELLENT' | 'GOOD' | 'NEEDS_ATTENTION' | 'CRITICAL';
  summary: string;
  vigorObservation: string;
  acidityObservation: string;
  temperatureImpact: string;
  readyToBake: boolean;
  bakingReason: string;
  recommendedRatio: string;
  flourTypeHint: string;
  targetAmbientTemp: string;
  recommendations: AiRecommendation[];
}
