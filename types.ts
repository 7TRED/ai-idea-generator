export interface Idea {
  id: string;
  title: string;
  shortDescription: string;
  tags: string[];
  emoji: string;
  impactScore: number; // 1-10
  feasibilityScore: number; // 1-10
  colorTheme: string; // hex code or tailwind class hint
}

export interface IdeaAnalysis {
  targetAudience: string[];
  revenueModels: string[];
  techStackRecommendation: string[];
  marketAnalysis: {
    competitorCount: string; // "Low", "Medium", "High"
    demandLevel: number; // 1-100
    growthPotential: number; // 1-100
    difficulty: number; // 1-100
  };
  nextSteps: string[];
  detailedDescription: string;
}

export interface HistoryItem {
  timestamp: number;
  topic: string;
}

export enum ViewState {
  LANDING,
  BROWSING,
  DETAIL
}
