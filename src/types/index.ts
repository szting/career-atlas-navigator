export interface RIASECScore {
  realistic: number;
  investigative: number;
  artistic: number;
  social: number;
  enterprising: number;
  conventional: number;
}

export interface UserProfile {
  name: string;
  riasecScores: RIASECScore;
  skillsConfidence: { [key: string]: number };
  workValues: string[];
  completedAssessments: string[];
}

export interface CareerPath {
  id: string;
  title: string;
  description: string;
  primaryType: keyof RIASECScore;
  secondaryType?: keyof RIASECScore;
  requiredSkills: string[];
  workEnvironment: string[];
  salaryRange: string;
  growthOutlook: string;
  education: string;
  matchScore?: number;
}

export interface CoachingQuestion {
  id: string;
  category: string;
  question: string;
  riasecFocus: keyof RIASECScore;
  purpose: string;
  followUp?: string[];
}

export interface ReflectionQuestion {
  id: string;
  category: string;
  question: string;
  riasecFocus: keyof RIASECScore;
  context: 'development' | 'performance' | 'career_planning';
  managerGuidance: string;
}

export type PersonaType = 'individual' | 'coach' | 'manager';

export interface GameState {
  currentStep: 'persona' | 'welcome' | 'riasec' | 'skills' | 'values' | 'results' | 'coaching' | 'reflection';
  selectedPersona?: PersonaType;
  userProfile: UserProfile;
  recommendedCareers: CareerPath[];
  coachingQuestions: CoachingQuestion[];
  reflectionQuestions: ReflectionQuestion[];
  gameProgress: number;
}
