import React, { useState, useEffect } from 'react';
import { MessageCircle, Target, TrendingUp, ChevronLeft, Copy, RefreshCw, Sparkles, Loader } from 'lucide-react';
import { UserProfile } from '../types';
import { openaiService } from '../services/openaiService';

interface AIEnhancedCoachingDashboardProps {
  userProfile: UserProfile;
  onBack: () => void;
  onRestart: () => void;
}

interface AICoachingQuestion {
  question: string;
  category: string;
  purpose: string;
  followUp: string[];
}

export const AIEnhancedCoachingDashboard: React.FC<AIEnhancedCoachingDashboardProps> = ({
  userProfile,
  onBack,
  onRestart
}) => {
  const [questions, setQuestions] = useState<AICoachingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedQuestion, setCopiedQuestion] = useState<string | null>(null);

  const categories = ['all', 'exploration', 'development', 'goal-setting', 'reflection'];

  useEffect(() => {
    generateQuestions();
  }, [userProfile]);

  const generateQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const aiQuestions = await openaiService.generateCoachingQuestions(userProfile);
      setQuestions(aiQuestions);
    } catch (err) {
      setError('Failed to generate personalized questions. Please try again.');
      console.error('Error generating questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTopRIASECTypes = () => {
    return Object.entries(userProfile.riasecScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);
  };

  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  const copyToClipboard = async (text: string, questionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedQuestion(questionId);
      setTimeout(() => setCopiedQuestion(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const topTypes = getTopRIASECTypes();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <Sparkles className="w-16 h-16 text-green-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generating Personalized Questions</h2>
          <p className="text-gray-600 mb-6">AI is analyzing your RIASEC profile to create tailored coaching questions...</p>
          <Loader className="w-8 h-8 text-green-500 mx-auto animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-2xl">⚠</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generation Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={generateQuestions}
            className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            <div className="flex space-x-4">
              <button
                onClick={generateQuestions}
                className="flex items-center text-green-600 hover:text-green-800 transition-colors"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Regenerate Questions
              </button>
              <button
                onClick={onRestart}
                className="flex items-center text-green-600 hover:text-green-800 transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                New Assessment
              </button>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-green-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">
                AI-Powered Coaching Dashboard
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              Personalized coaching questions generated based on your unique RIASEC profile
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

        {/* AI-Generated Questions */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredQuestions.map((question, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-green-500">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-green-600 uppercase tracking-wide">
                      {question.category.replace('-', ' ')}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      AI-Generated Question
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(question.question, `ai-${index}`)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Copy question"
                >
                  {copiedQuestion === `ai-${index}` ? (
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
                    {question.followUp.map((followUp, followUpIndex) => (
                      <li key={followUpIndex} className="text-sm text-gray-600 flex items-start">
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

        {/* AI Coaching Tips */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Target className="w-6 h-6 mr-3 text-green-500" />
            Personalized Coaching Insights
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {topTypes.map(([type, score]) => (
              <div key={type} className="bg-green-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 capitalize">
                  {type} Type ({score}%) - Coaching Focus
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {type === 'realistic' && (
                    <>
                      <p>• Focus on practical applications and hands-on experiences</p>
                      <p>• Use concrete examples and real-world scenarios</p>
                      <p>• Encourage skill-building through practice</p>
                      <p>• Connect learning to tangible outcomes</p>
                    </>
                  )}
                  {type === 'investigative' && (
                    <>
                      <p>• Encourage analytical thinking and problem-solving</p>
                      <p>• Provide research opportunities and data-driven insights</p>
                      <p>• Support independent learning and exploration</p>
                      <p>• Value their expertise and analytical insights</p>
                    </>
                  )}
                  {type === 'artistic' && (
                    <>
                      <p>• Foster creative expression and innovation</p>
                      <p>• Encourage unique approaches to challenges</p>
                      <p>• Support aesthetic and design-oriented thinking</p>
                      <p>• Provide flexibility in problem-solving methods</p>
                    </>
                  )}
                  {type === 'social' && (
                    <>
                      <p>• Focus on interpersonal relationships and teamwork</p>
                      <p>• Encourage helping and mentoring others</p>
                      <p>• Support community-oriented goals</p>
                      <p>• Connect work to social impact and meaning</p>
                    </>
                  )}
                  {type === 'enterprising' && (
                    <>
                      <p>• Encourage leadership and initiative-taking</p>
                      <p>• Focus on goal achievement and results</p>
                      <p>• Support networking and influence-building</p>
                      <p>• Provide opportunities for advancement</p>
                    </>
                  )}
                  {type === 'conventional' && (
                    <>
                      <p>• Provide structure and clear expectations</p>
                      <p>• Focus on organization and systematic approaches</p>
                      <p>• Support detail-oriented and methodical work</p>
                      <p>• Recognize accuracy and consistency</p>
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
