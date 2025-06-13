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
