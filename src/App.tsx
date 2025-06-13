import React, { useState } from 'react';
import { PersonaSelection } from './components/PersonaSelection';
import { AssessmentFlow } from './components/AssessmentFlow';
import { AIEnhancedCareerDashboard } from './components/AIEnhancedCareerDashboard';
import { AIEnhancedCoachingDashboard } from './components/AIEnhancedCoachingDashboard';
import { AIEnhancedManagerDashboard } from './components/AIEnhancedManagerDashboard';
import { AdminPanel } from './components/AdminPanel';
import { PersonaType, UserProfile } from './types';
import { Settings } from 'lucide-react';

function App() {
  const [selectedPersona, setSelectedPersona] = useState<PersonaType | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

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

  // Admin panel access (hidden button - press Ctrl+Shift+A or click the settings icon)
  React.useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setShowAdminPanel(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Show admin panel
  if (showAdminPanel) {
    return <AdminPanel onClose={() => setShowAdminPanel(false)} />;
  }

  // Show persona selection if no persona is selected
  if (!selectedPersona) {
    return (
      <div className="relative">
        <PersonaSelection onPersonaSelect={handlePersonaSelect} />
        {/* Admin access button */}
        <button
          onClick={() => setShowAdminPanel(true)}
          className="fixed top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors opacity-50 hover:opacity-100"
          title="Admin Panel (Ctrl+Shift+A)"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  // Show results dashboard based on persona
  if (showResults && userProfile) {
    const DashboardComponent = () => {
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
    };

    return (
      <div className="relative">
        <DashboardComponent />
        {/* Admin access button */}
        <button
          onClick={() => setShowAdminPanel(true)}
          className="fixed top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors opacity-50 hover:opacity-100"
          title="Admin Panel (Ctrl+Shift+A)"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  // Show assessment flow
  return (
    <div className="relative">
      <AssessmentFlow
        persona={selectedPersona}
        onComplete={handleAssessmentComplete}
        onBack={() => setSelectedPersona(null)}
      />
      {/* Admin access button */}
      <button
        onClick={() => setShowAdminPanel(true)}
        className="fixed top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors opacity-50 hover:opacity-100"
        title="Admin Panel (Ctrl+Shift+A)"
      >
        <Settings className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}

export default App;
