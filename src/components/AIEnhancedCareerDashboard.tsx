import React, { useState, useEffect } from 'react';
import { Briefcase, TrendingUp, Target, ChevronLeft, RefreshCw, Sparkles, Loader, BookOpen, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';
import { openaiService } from '../services/openaiService';

interface AIEnhancedCareerDashboardProps {
  userProfile: UserProfile;
  onBack: () => void;
  onRestart: () => void;
}

interface CareerRecommendation {
  title: string;
  match: number;
  description: string;
  keyActivities: string[];
  developmentAreas: string[];
  nextSteps: string[];
}

interface DevelopmentPlan {
  shortTerm: Array<{ goal: string; actions: string[]; timeline: string }>;
  longTerm: Array<{ goal: string; actions: string[]; timeline: string }>;
  skillGaps: string[];
  resources: string[];
}

export const AIEnhancedCareerDashboard: React.FC<AIEnhancedCareerDashboardProps> = ({
  userProfile,
  onBack,
  onRestart
}) => {
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [developmentPlan, setDevelopmentPlan] = useState<DevelopmentPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'careers' | 'development'>('careers');

  useEffect(() => {
    generateInsights();
  }, [userProfile]);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const [careerRecs, devPlan] = await Promise.all([
        openaiService.generateCareerRecommendations(userProfile),
        openaiService.generateDevelopmentPlan(userProfile)
      ]);
      setRecommendations(careerRecs);
      setDevelopmentPlan(devPlan);
    } catch (err) {
      setError('Failed to generate career insights. Please try again.');
      console.error('Error generating insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTopRIASECTypes = () => {
    return Object.entries(userProfile.riasecScores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);
  };

  const topTypes = getTopRIASECTypes();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <Sparkles className="w-16 h-16 text-blue-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generating Career Insights</h2>
          <p className="text-gray-600 mb-6">AI is analyzing your profile to create personalized career recommendations...</p>
          <Loader className="w-8 h-8 text-blue-500 mx-auto animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-2xl">⚠</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Generation Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={generateInsights}
            className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
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
                onClick={generateInsights}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Regenerate Insights
              </button>
              <button
                onClick={onRestart}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                New Assessment
              </button>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-blue-500 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">
                AI Career Insights
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              Personalized career recommendations and development plans
            </p>
          </div>

          {/* Profile Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Career Profile</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Dominant RIASEC Types</h3>
                <div className="space-y-2">
                  {topTypes.map(([type, score]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="capitalize font-medium">{type}</span>
                      <span className="text-blue-600 font-semibold">{score}%</span>
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
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Strongest Skills</h3>
                <div className="space-y-1">
                  {Object.entries(userProfile.skillsConfidence)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3)
                    .map(([skill, confidence]) => (
                      <div key={skill} className="flex justify-between items-center text-sm">
                        <span>{skill}</span>
                        <span className="text-blue-600">{confidence}/5</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('careers')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                activeTab === 'careers'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Briefcase className="w-5 h-5 mr-2" />
              Career Recommendations
            </button>
            <button
              onClick={() => setActiveTab('development')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                activeTab === 'development'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Target className="w-5 h-5 mr-2" />
              Development Plan
            </button>
          </div>
        </div>

        {/* Career Recommendations Tab */}
        {activeTab === 'careers' && (
          <div className="grid md:grid-cols-2 gap-6">
            {recommendations.map((career, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-blue-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{career.title}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-600 mr-2">Match:</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${career.match}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-semibold text-blue-600">{career.match}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{career.description}</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Activities</h4>
                    <ul className="space-y-1">
                      {career.keyActivities.map((activity, actIndex) => (
                        <li key={actIndex} className="text-sm text-gray-600 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Development Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {career.developmentAreas.map((area, areaIndex) => (
                        <span
                          key={areaIndex}
                          className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
                    <ul className="space-y-1">
                      {career.nextSteps.slice(0, 3).map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm text-gray-600 flex items-start">
                          <ArrowRight className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Development Plan Tab */}
        {activeTab === 'development' && developmentPlan && (
          <div className="space-y-8">
            {/* Short-term Goals */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Target className="w-6 h-6 mr-3 text-green-500" />
                Short-term Goals (3-6 months)
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {developmentPlan.shortTerm.map((goal, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{goal.goal}</h3>
                    <p className="text-sm text-gray-600 mb-3">Timeline: {goal.timeline}</p>
                    <ul className="space-y-1">
                      {goal.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="text-sm text-gray-600 flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Long-term Goals */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-blue-500" />
                Long-term Goals (1-2 years)
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {developmentPlan.longTerm.map((goal, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{goal.goal}</h3>
                    <p className="text-sm text-gray-600 mb-3">Timeline: {goal.timeline}</p>
                    <ul className="space-y-1">
                      {goal.actions.map((action, actionIndex) => (
                        <li key={actionIndex} className="text-sm text-gray-600 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Gaps & Resources */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Key Skill Gaps</h2>
                <div className="space-y-2">
                  {developmentPlan.skillGaps.map((gap, index) => (
                    <div key={index} className="flex items-center p-3 bg-red-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{gap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Recommended Resources
                </h2>
                <div className="space-y-2">
                  {developmentPlan.resources.map((resource, index) => (
                    <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{resource}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
