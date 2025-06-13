import React, { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { RIASECAssessment } from './RIASECAssessment';
import { SkillsAssessment } from './SkillsAssessment';
import { WorkValuesAssessment } from './WorkValuesAssessment';
import { PersonaType, UserProfile, RIASECScore } from '../types';

interface AssessmentFlowProps {
  persona: PersonaType;
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
}

type AssessmentStep = 'welcome' | 'riasec' | 'skills' | 'values';

export const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ 
  persona, 
  onComplete, 
  onBack 
}) => {
  const [currentStep, setCurrentStep] = useState<AssessmentStep>('welcome');
  const [riasecScores, setRiasecScores] = useState<RIASECScore | null>(null);
  const [skillsData, setSkillsData] = useState<{ [key: string]: number } | null>(null);

  const handleWelcomeComplete = () => {
    setCurrentStep('riasec');
  };

  const handleRIASECComplete = (scores: RIASECScore) => {
    setRiasecScores(scores);
    setCurrentStep('skills');
  };

  const handleSkillsComplete = (skills: { [key: string]: number }) => {
    setSkillsData(skills);
    setCurrentStep('values');
  };

  const handleValuesComplete = (values: string[]) => {
    if (riasecScores && skillsData) {
      const userProfile: UserProfile = {
        persona,
        riasecScores,
        skills: skillsData,
        workValues: values,
        completedAt: new Date().toISOString()
      };
      onComplete(userProfile);
    }
  };

  const handleStepBack = () => {
    switch (currentStep) {
      case 'welcome':
        onBack();
        break;
      case 'riasec':
        setCurrentStep('welcome');
        break;
      case 'skills':
        setCurrentStep('riasec');
        break;
      case 'values':
        setCurrentStep('skills');
        break;
    }
  };

  switch (currentStep) {
    case 'welcome':
      return <WelcomeScreen onStart={handleWelcomeComplete} />;
    case 'riasec':
      return <RIASECAssessment onComplete={handleRIASECComplete} onBack={handleStepBack} />;
    case 'skills':
      return <SkillsAssessment onComplete={handleSkillsComplete} onBack={handleStepBack} />;
    case 'values':
      return <WorkValuesAssessment onComplete={handleValuesComplete} onBack={handleStepBack} />;
    default:
      return <WelcomeScreen onStart={handleWelcomeComplete} />;
  }
};
