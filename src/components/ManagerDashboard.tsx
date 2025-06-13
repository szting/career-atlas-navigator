import React, { useState } from 'react';
import { Users, Target, MessageSquare, ChevronLeft, Copy, RefreshCw, FileText } from 'lucide-react';
import { UserProfile, ReflectionQuestion, RIASECScore } from '../types';

interface ManagerDashboardProps {
  userProfile: UserProfile;
  reflectionQuestions: ReflectionQuestion[];
  onBack: () => void;
  onRestart: () => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({
  userProfile,
  reflectionQuestions,
  onBack,
  onRestart
}) => {
  const [selectedContext, setSelectedContext] = useState<string>('all');
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);

  const contexts = ['all', 'development', 'performance', 'career_planning'];
  
  const getTopRIASECTypes = (scores: RIASECScore) => {
    return Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);
  };

  const filteredQuestions = selectedContext === 'all' 
    ? reflectionQuestions 
    : reflectionQuestions.filter(q => q.context === selectedContext);

  const copyToClipboard = async (text: string, questionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedQuestion(questionId);
      setTimeout(() => setCopiedQuestion(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const topTypes = getTopRIASECTypes(userProfile.riasecScores);

  const getContextIcon = (context: string) => {
    switch (context) {
      case 'development': return Target;
      case 'performance': return TrendingUp;
      case 'career_planning': return FileText;
      default: return MessageSquare;
    }
  };

  const getContextColor = (context: string) => {
    switch (context) {
      case 'development': return 'text-blue-500';
      case 'performance': return 'text-green-500';
      case 'career_planning': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Assessment
            </button>
            <button
              onClick={onRestart}
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              New Assessment
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Manager Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              Team development and reflection questions based on RIASEC profiles
            </p>
          </div>

          {/* Team Member Profile */}
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Team Member Profile</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Dominant RIASEC Types</h3>
                <div className="space-y-2">
                  {topTypes.map(([type, score]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="capitalize font-medium">{type}</span>
                      <span className="text-purple-600 font-semibold">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Key Work Values</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.workValues.slice(0, 3).map((value) => (
                    <span
                      key={value}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Top Skills</h3>
                <div className="space-y-1">
                  {Object.entries(userProfile.skillsConfidence)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([skill, confidence]) => (
                      <div key={skill} className="flex justify-between items-center text-sm">
                        <span>{skill}</span>
                        <span className="text-purple-600">{confidence}/5</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Context Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Conversation Context</h2>
          <div className="flex flex-wrap gap-3">
            {contexts.map((context) => (
              <button
                key={context}
                onClick={() => setSelectedContext(context)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedContext === context
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {context === 'all' ? 'All Contexts' : context.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Reflection Questions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {filteredQuestions.map((question) => {
            const IconComponent = getContextIcon(question.context);
            return (
              <div key={question.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-6 h-6 ${getContextColor(question.context)}`} />
                    <div>
                      <span className="text-sm font-medium text-purple-600 uppercase tracking-wide">
                        {question.context.replace('_', ' ')}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        Focus: <span className="capitalize">{question.riasecFocus}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(question.question, question.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy question"
                  >
                    {copiedQuestion === question.id ? (
                      <span className="text-purple-500 text-sm">Copied!</span>
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Reflection Question</h3>
                  <p className="text-gray-700 leading-relaxed">{question.question}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    Manager Guidance
                  </h4>
                  <p className="text-sm text-gray-600">{question.managerGuidance}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Management Tips */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3 text-purple-500" />
            Management Tips for RIASEC Types
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {topTypes.map(([type, score]) => (
              <div key={type} className="bg-purple-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                  Managing {type} Types ({score}%)
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {type === 'realistic' && (
                    <>
                      <p>• Provide clear, practical objectives and deadlines</p>
                      <p>• Offer hands-on training and skill development</p>
                      <p>• Recognize tangible achievements and results</p>
                      <p>• Allow autonomy in how tasks are completed</p>
                    </>
                  )}
                  {type === 'investigative' && (
                    <>
                      <p>• Give time for thorough analysis and research</p>
                      <p>• Provide access to data and information resources</p>
                      <p>• Encourage independent problem-solving</p>
                      <p>• Value their expertise and analytical insights</p>
                    </>
                  )}
                  {type === 'artistic' && (
                    <>
                      <p>• Allow creative freedom and flexible approaches</p>
                      <p>• Encourage innovation and new ideas</p>
                      <p>• Provide variety in tasks and projects</p>
                      <p>• Recognize creative contributions and originality</p>
                    </>
                  )}
                  {type === 'social' && (
                    <>
                      <p>• Emphasize team collaboration and relationships</p>
                      <p>• Provide opportunities to help and mentor others</p>
                      <p>• Give regular feedback and recognition</p>
                      <p>• Connect their work to organizational mission</p>
                    </>
                  )}
                  {type === 'enterprising' && (
                    <>
                      <p>• Set challenging goals and growth opportunities</p>
                      <p>• Provide leadership and decision-making roles</p>
                      <p>• Recognize achievements publicly</p>
                      <p>• Support networking and external relationships</p>
                    </>
                  )}
                  {type === 'conventional' && (
                    <>
                      <p>• Provide clear structure and organized processes</p>
                      <p>• Set specific deadlines and quality standards</p>
                      <p>• Recognize attention to detail and accuracy</p>
                      <p>• Offer stability and predictable workflows</p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
