import React from 'react';
import { User, Users, UserCheck } from 'lucide-react';
import { PersonaType } from '../types';

interface PersonaSelectionProps {
  onPersonaSelect: (persona: PersonaType) => void;
}

export const PersonaSelection: React.FC<PersonaSelectionProps> = ({ onPersonaSelect }) => {
  const personas = [
    {
      type: 'individual' as PersonaType,
      title: 'Individual Professional',
      description: 'Discover your ideal career path and get personalized recommendations',
      icon: User,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'bg-blue-50',
      features: [
        'Personal career assessment',
        'Skill development roadmap',
        'Career path recommendations',
        'Work-life balance insights'
      ]
    },
    {
      type: 'coach' as PersonaType,
      title: 'Career Coach',
      description: 'Access coaching tools and frameworks to guide your clients',
      icon: UserCheck,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      features: [
        'Client assessment tools',
        'Coaching conversation starters',
        'Development planning templates',
        'Progress tracking insights'
      ]
    },
    {
      type: 'manager' as PersonaType,
      title: 'People Manager',
      description: 'Support your team members\' career development and growth',
      icon: Users,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      features: [
        'Team development insights',
        'One-on-one conversation guides',
        'Career progression planning',
        'Skills gap analysis'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Role
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the option that best describes your current role to get a personalized experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {personas.map((persona) => {
            const IconComponent = persona.icon;
            return (
              <div
                key={persona.type}
                className="bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => onPersonaSelect(persona.type)}
              >
                <div className={`w-16 h-16 ${persona.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                  <IconComponent className="w-8 h-8 text-gray-700" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {persona.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {persona.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {persona.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full bg-gradient-to-r ${persona.color} text-white py-3 px-6 rounded-xl font-semibold hover:opacity-90 transition-opacity`}>
                  Get Started
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
