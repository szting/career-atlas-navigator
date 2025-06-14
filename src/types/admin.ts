export interface SkillsFramework {
  id: string;
  name: string;
  description: string;
  categories: SkillCategory[];
  version: string;
  lastUpdated: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
  riasecAlignment: string[];
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  prerequisites?: string[];
  relatedCareers: string[];
}

export interface CoachingExercise {
  id: string;
  title: string;
  description: string;
  category: 'self-reflection' | 'goal-setting' | 'skill-assessment' | 'career-exploration';
  riasecFocus: string[];
  duration: number; // in minutes
  instructions: string[];
  questions: CoachingQuestion[];
  followUpActivities?: string[];
}

export interface CoachingQuestion {
  id: string;
  question: string;
  type: 'open-ended' | 'scale' | 'multiple-choice' | 'ranking';
  options?: string[];
  purpose: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: 'skills-framework' | 'coaching-exercises' | 'career-data';
  size: number;
  uploadDate: string;
  status: 'processing' | 'completed' | 'error';
  recordCount?: number;
  errorMessage?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recordCount: number;
  preview: any[];
}

// Analytics types
export interface IncongruenceData {
  userId: string;
  userName: string;
  assessmentDate: string;
  riasecScores: {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
  };
  skillsConfidence: {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
  };
  incongruenceScore: number;
  topMismatches: Array<{
    dimension: string;
    interestScore: number;
    skillScore: number;
    gap: number;
  }>;
}

export interface AnalyticsMetrics {
  totalAssessments: number;
  averageIncongruence: number;
  highIncongruenceCount: number;
  commonMismatches: Array<{
    dimension: string;
    frequency: number;
    averageGap: number;
  }>;
}

// API Configuration types
export interface LLMProvider {
  id: string;
  name: string;
  endpoint: string;
  modelOptions: string[];
  authType: 'bearer' | 'api-key' | 'custom';
  headers?: Record<string, string>;
}

export interface APIConfiguration {
  provider: string;
  apiKey: string;
  model?: string;
  endpoint?: string;
  customHeaders?: Record<string, string>;
  maxTokens?: number;
  temperature?: number;
}
