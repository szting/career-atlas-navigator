import React, { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { RIASECAssessment } from './components/RIASECAssessment';
import { SkillsAssessment } from './components/SkillsAssessment';
import { WorkValuesAssessment } from './components/WorkValuesAssessment';
import { ResultsScreen } from './components/ResultsScreen';
import { AdminPanel } from './components/AdminPanel';
import { GameState, RIASECScore } from './types';
import { calculateCareerMatches } from './utils/careerMatcher';
import { Settings } from 'lucide-react';

function App() {
  const [gameState, setGameState] = useState<GameState>({
    currentStep: 'welcome',
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
    gameProgress: 0
  });

  const [showAdmin, setShowAdmin] = useState(false);

  const handleStart = () => {
    setGameState(prev => ({
      ...prev,
      currentStep: 'riasec',
      gameProgress: 25
    }));
  };

  const handleRIASECComplete = (scores: RIASECScore) => {
    setGameState(prev => ({
      ...prev,
      currentStep: 'skills',
      userProfile: {
        ...prev.userProfile,
        riasecScores: scores,
        completedAssessments: [...prev.userProfile.completedAssessments, 'riasec']
      },
      gameProgress: 50
    }));
  };

  const handleSkillsComplete = (skills: { [key: string]: number }) => {
    setGameState(prev => ({
      ...prev,
      currentStep: 'values',
      userProfile: {
        ...prev.userProfile,
        skillsConfidence: skills,
        completedAssessments: [...prev.userProfile.completedAssessments, 'skills']
      },
      gameProgress: 75
    }));
  };

  const handleValuesComplete = (values: string[]) => {
    const updatedProfile = {
      ...gameState.userProfile,
      workValues: values,
      completedAssessments: [...gameState.userProfile.completedAssessments, 'values']
    };

    const recommendedCareers = calculateCareerMatches(updatedProfile);

    setGameState(prev => ({
      ...prev,
      currentStep: 'results',
      userProfile: updatedProfile,
      recommendedCareers,
      gameProgress: 100
    }));
  };

  const handleRestart = () => {
    setGameState({
      currentStep: 'welcome',
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
      gameProgress: 0
    });
  };

  const handleBack = () => {
    switch (gameState.currentStep) {
      case 'riasec':
        setGameState(prev => ({ ...prev, currentStep: 'welcome', gameProgress: 0 }));
        break;
      case 'skills':
        setGameState(prev => ({ ...prev, currentStep: 'riasec', gameProgress: 25 }));
        break;
      case 'values':
        setGameState(prev => ({ ...prev, currentStep: 'skills', gameProgress: 50 }));
        break;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Admin Access Button */}
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed top-4 right-4 z-40 p-3 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors shadow-lg"
        title="Admin Panel"
      >
        <Settings className="w-5 h-5" />
      </button>

      {gameState.currentStep === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}
      
      {gameState.currentStep === 'riasec' && (
        <RIASECAssessment 
          onComplete={handleRIASECComplete}
          onBack={handleBack}
        />
      )}
      
      {gameState.currentStep === 'skills' && (
        <SkillsAssessment 
          onComplete={handleSkillsComplete}
          onBack={handleBack}
        />
      )}
      
      {gameState.currentStep === 'values' && (
        <WorkValuesAssessment 
          onComplete={handleValuesComplete}
          onBack={handleBack}
        />
      )}
      
      {gameState.currentStep === 'results' && (
        <ResultsScreen 
          userProfile={gameState.userProfile}
          recommendedCareers={gameState.recommendedCareers}
          onRestart={handleRestart}
        />
      )}

      {/* Admin Panel Modal */}
      {showAdmin && (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
}

export default App;
