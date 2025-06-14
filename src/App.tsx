import React, { useState, useEffect } from 'react';
import { PersonaSelection } from './components/PersonaSelection';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RIASECAssessment } from './components/RIASECAssessment';
import { SkillsAssessment } from './components/SkillsAssessment';
import { WorkValuesAssessment } from './components/WorkValuesAssessment';
import { ResultsScreen } from './components/ResultsScreen';
import { CoachingDashboard } from './components/CoachingDashboard';
import { ManagerDashboard } from './components/ManagerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { GameState, PersonaType, UserProfile, CareerPath } from './types';
import { calculateCareerMatches } from './utils/careerMatcher';
import { Settings } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentStep: 'persona',
    userProfile: {
      name: '',
      riasecScores: {
        realistic: 0,
        investigative: 0,
        artistic: 0,
        social: 0,
        enterprising: 0,
        conventional: 0
      },
      skillsConfidence: {},
      workValues: [],
      completedAssessments: []
    },
    recommendedCareers: [],
    coachingQuestions: [],
    reflectionQuestions: [],
    gameProgress: 0
  });

  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Keyboard shortcut for admin panel
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setShowAdminPanel(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handlePersonaSelect = (persona: PersonaType) => {
    setGameState(prev => ({
      ...prev,
      selectedPersona: persona,
      currentStep: 'welcome'
    }));
  };

  const handleNameSubmit = (name: string) => {
    setGameState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, name },
      currentStep: 'riasec',
      gameProgress: 20
    }));
  };

  const handleRIASECComplete = (scores: any) => {
    setGameState(prev => ({
      ...prev,
      userProfile: { 
        ...prev.userProfile, 
        riasecScores: scores,
        completedAssessments: [...prev.userProfile.completedAssessments, 'riasec']
      },
      currentStep: 'skills',
      gameProgress: 40
    }));
  };

  const handleSkillsComplete = (skills: any) => {
    setGameState(prev => ({
      ...prev,
      userProfile: { 
        ...prev.userProfile, 
        skillsConfidence: skills,
        completedAssessments: [...prev.userProfile.completedAssessments, 'skills']
      },
      currentStep: 'values',
      gameProgress: 60
    }));
  };

  const handleValuesComplete = (values: string[]) => {
    const updatedProfile = {
      ...gameState.userProfile,
      workValues: values,
      completedAssessments: [...gameState.userProfile.completedAssessments, 'values']
    };

    // Calculate career matches
    const careers = calculateCareerMatches(updatedProfile);

    setGameState(prev => ({
      ...prev,
      userProfile: updatedProfile,
      recommendedCareers: careers,
      currentStep: prev.selectedPersona === 'individual' ? 'results' : 
                   prev.selectedPersona === 'coach' ? 'coaching' : 'reflection',
      gameProgress: 100
    }));
  };

  const handleRestart = () => {
    setGameState({
      currentStep: 'persona',
      userProfile: {
        name: '',
        riasecScores: {
          realistic: 0,
          investigative: 0,
          artistic: 0,
          social: 0,
          enterprising: 0,
          conventional: 0
        },
        skillsConfidence: {},
        workValues: [],
        completedAssessments: []
      },
      recommendedCareers: [],
      coachingQuestions: [],
      reflectionQuestions: [],
      gameProgress: 0
    });
  };

  const renderCurrentStep = () => {
    switch (gameState.currentStep) {
      case 'persona':
        return <PersonaSelection onSelectPersona={handlePersonaSelect} />;
      case 'welcome':
        return <WelcomeScreen onNameSubmit={handleNameSubmit} selectedPersona={gameState.selectedPersona!} />;
      case 'riasec':
        return <RIASECAssessment onComplete={handleRIASECComplete} />;
      case 'skills':
        return <SkillsAssessment onComplete={handleSkillsComplete} />;
      case 'values':
        return <WorkValuesAssessment onComplete={handleValuesComplete} />;
      case 'results':
        return (
          <ResultsScreen 
            userProfile={gameState.userProfile} 
            recommendedCareers={gameState.recommendedCareers}
            onRestart={handleRestart}
          />
        );
      case 'coaching':
        return (
          <CoachingDashboard 
            userProfile={gameState.userProfile}
            onRestart={handleRestart}
          />
        );
      case 'reflection':
        return (
          <ManagerDashboard 
            userProfile={gameState.userProfile}
            onRestart={handleRestart}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Admin Panel Access Button */}
      <button
        onClick={() => setShowAdminPanel(true)}
        className="fixed top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow z-50"
        title="Admin Panel (Ctrl+Shift+A)"
      >
        <Settings className="w-5 h-5 text-gray-600" />
      </button>

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel onClose={() => setShowAdminPanel(false)} />
      )}

      {/* Progress Bar */}
      {gameState.gameProgress > 0 && gameState.currentStep !== 'results' && 
       gameState.currentStep !== 'coaching' && gameState.currentStep !== 'reflection' && (
        <div className="fixed top-0 left-0 right-0 h-2 bg-gray-200 z-40">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
            style={{ width: `${gameState.gameProgress}%` }}
          />
        </div>
      )}

      {renderCurrentStep()}
    </div>
  );
}

export default App;
