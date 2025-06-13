import React from 'react';
import { Play, Target, TrendingUp } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6">
              <Target className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Career Pathway Clarity Game
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover your ideal career path through an interactive assessment based on your interests, 
              skills confidence, and work values using the RIASEC framework.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">RIASEC Assessment</h3>
              <p className="text-gray-600 text-sm">
                Explore your personality type across six key dimensions: Realistic, Investigative, 
                Artistic, Social, Enterprising, and Conventional.
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills Confidence</h3>
              <p className="text-gray-600 text-sm">
                Rate your confidence in key professional skills to understand your strengths 
                and areas for development.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Play className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Work Values</h3>
              <p className="text-gray-600 text-sm">
                Identify what matters most to you in a career, from work-life balance 
                to intellectual challenges.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What You'll Get:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span className="text-gray-700">Personalized career recommendations</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span className="text-gray-700">Detailed career path information</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span className="text-gray-700">Skills development insights</span>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <span className="text-gray-700">Work environment preferences</span>
              </div>
            </div>
          </div>

          <button
            onClick={onStart}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Start Your Career Journey
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Takes approximately 10-15 minutes to complete
          </p>
        </div>
      </div>
    </div>
  );
};
