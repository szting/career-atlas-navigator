import React, { useState } from 'react';
import { PersonaSelection } from './components/PersonaSelection';
import { AssessmentFlow } from './components/AssessmentFlow';
import { AIEnhancedCareerDashboard } from './components/AIEnhancedCareerDashboard';
import { AIEnhancedCoachingDashboard } from './components/AIEnhancedCoachingDashboard';
import { AIEnhancedManagerDashboard } from './components/AIEnhancedManagerDashboard';
import { PersonaType, UserProfile } from './types';

function App() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handlePersonaSelect = (persona: PersonaType) => {
    setSelectedPersona(persona);
  };

  const handleAssessmentComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowResults(true);
  };

  const handleBack = () => {
    setShowResults(false);
  };

  const handleRestart = () => {
    setSelectedPersona(null);
    setUserProfile(null);
    setShowResults(false);
  };

  // Show persona selection if no persona is selected
  if (!selectedPersona) {
    return <PersonaSelection onPersonaSelect={handlePersonaSelect} />;
  }

  // Show results dashboard based on persona
  if (showResults && userProfile) {
    switch (selectedPersona) {
      case 'individual':
        return (
          <AIEnhancedCareerDashboard
            userProfile={userProfile}
            onBack={handleBack}
            onRestart={handleRestart}
          />
        );
      case 'coach':
        return (
          <AIEnhancedCoachingDashboard
            userProfile={userProfile}
            onBack={handleBack}
            onRestart={handleRestart}
          />
        );
      case 'manager':
        return (
          <AIEnhancedManagerDashboard
            userProfile={userProfile}
            onBack={handleBack}
            onRestart={handleRestart}
          />
        );
      default:
        return <PersonaSelection onPersonaSelect={handlePersonaSelect} />;
    }
  }

  // Show assessment flow
  return (
    <AssessmentFlow
      persona={selectedPersona}
      onComplete={handleAssessmentComplete}
      onBack={() => setSelectedPersona(null)}
    />
  );
}

export default App;
