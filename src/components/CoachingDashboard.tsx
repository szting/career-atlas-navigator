import React, { useState } from 'react';
import { MessageCircle, Target, TrendingUp, ChevronLeft, Copy, RefreshCw } from 'lucide-react';
import { UserProfile, CoachingQuestion, RIASECScore } from '../types';

interface CoachingDashboardProps {
  userProfile: UserProfile;
  coachingQuestions: CoachingQuestion[];
  onBack: () => void;
  onRestart: () => void;
}

export const CoachingDashboard: React.FC<CoachingDashboardProps> = ({
  userProfile,
  coachingQuestions,
  onBack,
  onRestart
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);

  const categories = ['all', 'exploration', 'development', 'goal-setting', 'reflection'];
  
  const getTopRIASECTypes = (scores: RIASECScore) => {
    return Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);
  };

  const filteredQuestions = selectedCategory === 'all' 
    ? coachingQuestions 
    : coachingQuestions.filter(q => q.category === selectedCategory);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
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
              className="flex items-center text-green-600 hover:text-green-800 transition-colors"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              New Assessment
            </button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Coaching Dashboard
            </h1>
            <p className="text-xl text-gray-600">
              RIASEC-based coaching questions and conversation frameworks
            </p>
          </div>

          {/* RIASEC Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Client Profile Summary</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Dominant RIASEC Types</h3>
                <div className="space-y-2">
                  {topTypes.map(([type, score]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="capitalize font-medium">{type}</span>
                      <span className="text-green-600 font-semibold">{score}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Key Work Values</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.workValues.slice(0, 4).map((value) => (
                    <span
                      key={value}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Question Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Coaching Questions */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-6 h-6 text-green-500" />
                  <div>
                    <span className="text-sm font-medium text-green-600 uppercase tracking-wide">
                      {question.category.replace('-', ' ')}
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
                    <span className="text-green-500 text-sm">Copied!</span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">Coaching Question</h3>
                <p className="text-gray-700 leading-relaxed">{question.question}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Purpose</h4>
                <p className="text-sm text-gray-600">{question.purpose}</p>
              </div>

              {question.followUp && question.followUp.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Follow-up Questions</h4>
                  <ul className="space-y-1">
                    {question.followUp.map((followUp, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">•</span>
                        {followUp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Coaching Tips */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3 text-green-500" />
            Coaching Tips for RIASEC Types
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {topTypes.map(([type, score]) => (
              <div key={type} className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                  {type} Type ({score}%)
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {type === 'realistic' && (
                    <>
                      <p>• Focus on practical applications and hands-on experiences</p>
                      <p>• Use concrete examples and real-world scenarios</p>
                      <p>• Encourage skill-building through practice</p>
                    </>
                  )}
                  {type === 'investigative' && (
                    <>
                      <p>• Encourage analytical thinking and problem-solving</p>
                      <p>• Provide research opportunities and data-driven insights</p>
                      <p>• Support independent learning and exploration</p>
                    </>
                  )}
                  {type === 'artistic' && (
                    <>
                      <p>• Foster creative expression and innovation</p>
                      <p>• Encourage unique approaches to challenges</p>
                      <p>• Support aesthetic and design-oriented thinking</p>
                    </>
                  )}
                  {type === 'social' && (
                    <>
                      <p>• Focus on interpersonal relationships and teamwork</p>
                      <p>• Encourage helping and mentoring others</p>
                      <p>• Support community-oriented goals</p>
                    </>
                  )}
                  {type === 'enterprising' && (
                    <>
                      <p>• Encourage leadership and initiative-taking</p>
                      <p>• Focus on goal achievement and results</p>
                      <p>• Support networking and influence-building</p>
                    </>
                  )}
                  {type === 'conventional' && (
                    <>
                      <p>• Provide structure and clear expectations</p>
                      <p>• Focus on organization and systematic approaches</p>
                      <p>• Support detail-oriented and methodical work</p>
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
