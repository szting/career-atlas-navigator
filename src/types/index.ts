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

export interface GameState {
  currentStep: 'welcome' | 'riasec' | 'skills' | 'values' | 'results';
  userProfile: UserProfile;
  recommendedCareers: CareerPath[];
  gameProgress: number;
}
