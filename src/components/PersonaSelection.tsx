import React from 'react';
import { User, Users, UserCheck, ArrowRight } from 'lucide-react';
import { PersonaType } from '../types';

interface PersonaSelectionProps {
  onPersonaSelect: (persona: PersonaType) => void;
}

export const PersonaSelection: React.FC<PersonaSelectionProps> = ({ onPersonaSelect }) => {
  const personas = [
    {
      id: 'individual' as PersonaType,
      title: 'Individual Career Explorer',
      description: 'Discover your ideal career pathways based on your RIASEC personality profile, skills, and values.',
      icon: User,
      color: 'from-blue-500 to-indigo-600',
      features: [
        'Personalized career recommendations',
        'Detailed pathway exploration',
        'Skills development insights',
        'Industry trend analysis'
      ]
    },
    {
      id: 'coach' as PersonaType,
      title: 'Career Coach/Adviser',
      description: 'Generate targeted coaching questions and conversation starters based on RIASEC assessments.',
      icon: Users,
      color: 'from-green-500 to-emerald-600',
      features: [
        'RIASEC-based coaching questions',
        'Conversation frameworks',
        'Development planning tools',
        'Progress tracking insights'
      ]
    },
    {
      id: 'manager' as PersonaType,
      title: 'Supervisor/Line Manager',
      description: 'Create meaningful reflection questions for team development and performance conversations.',
      icon: UserCheck,
      color: 'from-purple-500 to-violet-600',
      features: [
        'Team development questions',
        'Performance reflection tools',
        'Career planning frameworks',
        'Management conversation guides'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select your role to access tailored features and insights based on RIASEC career assessment framework.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {personas.map((persona) => {
            const IconComponent = persona.icon;
            return (
              <div
                key={persona.id}
                className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
                onClick={() => onPersonaSelect(persona.id)}
              >
                <div className="text-center mb-6">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${persona.color} rounded-full mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    {persona.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {persona.description}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {persona.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button className={`w-full bg-gradient-to-r ${persona.color} text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center group-hover:scale-105`}>
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              About RIASEC Framework
            </h3>
            <p className="text-gray-600 text-sm">
              The RIASEC model identifies six personality types: <strong>Realistic</strong>, <strong>Investigative</strong>, 
              <strong>Artistic</strong>, <strong>Social</strong>, <strong>Enterprising</strong>, and <strong>Conventional</strong>. 
              This assessment helps match individuals with suitable career environments and development opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
