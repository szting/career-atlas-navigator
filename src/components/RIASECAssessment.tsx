import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { riasecQuestions } from '../data/riasecQuestions';
import { RIASECScore } from '../types';

interface RIASECAssessmentProps {
  onComplete: (scores: RIASECScore) => void;
  onBack: () => void;
}

export const RIASECAssessment: React.FC<RIASECAssessmentProps> = ({ onComplete, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});

  const handleResponse = (value: number) => {
    const questionId = riasecQuestions[currentQuestion].id;
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < riasecQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      calculateScores();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const calculateScores = () => {
    const scores: RIASECScore = {
      realistic: 0,
      investigative: 0,
      artistic: 0,
      social: 0,
      enterprising: 0,
      conventional: 0
    };

    riasecQuestions.forEach(question => {
      const response = responses[question.id] || 0;
      scores[question.type] += response;
    });

    // Normalize scores to percentage
    Object.keys(scores).forEach(key => {
      scores[key as keyof RIASECScore] = Math.round((scores[key as keyof RIASECScore] / 20) * 100);
    });

    onComplete(scores);
  };

  const currentQuestionData = riasecQuestions[currentQuestion];
  const currentResponse = responses[currentQuestionData.id];
  const progress = ((currentQuestion + 1) / riasecQuestions.length) * 100;

  const getTypeColor = (type: string) => {
    const colors = {
      realistic: 'bg-green-500',
      investigative: 'bg-blue-500',
      artistic: 'bg-purple-500',
      social: 'bg-pink-500',
      enterprising: 'bg-orange-500',
      conventional: 'bg-gray-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      realistic: 'Realistic',
      investigative: 'Investigative',
      artistic: 'Artistic',
      social: 'Social',
      enterprising: 'Enterprising',
      conventional: 'Conventional'
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1} of {riasecQuestions.length}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Type Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getTypeColor(currentQuestionData.type)}`}>
              {getTypeLabel(currentQuestionData.type)}
            </span>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {currentQuestionData.question}
            </h2>
            <p className="text-gray-600">
              Rate how much this statement describes you on a scale of 1-5
            </p>
          </div>

          {/* Response Options */}
          <div className="mb-8">
            <div className="grid grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleResponse(value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    currentResponse === value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-2xl font-bold mb-1">{value}</div>
                  <div className="text-xs">
                    {value === 1 && 'Strongly Disagree'}
                    {value === 2 && 'Disagree'}
                    {value === 3 && 'Neutral'}
                    {value === 4 && 'Agree'}
                    {value === 5 && 'Strongly Agree'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={currentQuestion === 0 ? onBack : handlePrevious}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              {currentQuestion === 0 ? 'Back to Welcome' : 'Previous'}
            </button>

            <button
              onClick={handleNext}
              disabled={!currentResponse}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                currentResponse
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {currentQuestion === riasecQuestions.length - 1 ? 'Complete Assessment' : 'Next'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
