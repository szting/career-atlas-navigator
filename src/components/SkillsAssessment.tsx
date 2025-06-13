import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { skillsAssessment } from '../data/riasecQuestions';

interface SkillsAssessmentProps {
  onComplete: (skills: { [key: string]: number }) => void;
  onBack: () => void;
}

export const SkillsAssessment: React.FC<SkillsAssessmentProps> = ({ onComplete, onBack }) => {
  const [skillRatings, setSkillRatings] = useState<{ [key: string]: number }>({});

  const handleSkillRating = (skill: string, rating: number) => {
    setSkillRatings(prev => ({ ...prev, [skill]: rating }));
  };

  const handleComplete = () => {
    onComplete(skillRatings);
  };

  const allSkillsRated = skillsAssessment.every(skill => skillRatings[skill] > 0);
  const completedSkills = Object.keys(skillRatings).length;
  const progress = (completedSkills / skillsAssessment.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Skills Confidence Assessment</h1>
            <p className="text-gray-600 mb-6">
              Rate your confidence level in each skill area from 1 (beginner) to 5 (expert)
            </p>
            
            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">
                  {completedSkills} of {skillsAssessment.length} skills rated
                </span>
                <span className="text-sm font-medium text-gray-600">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {skillsAssessment.map((skill) => (
              <div key={skill} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{skill}</h3>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleSkillRating(skill, rating)}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        skillRatings[skill] >= rating
                          ? 'text-yellow-500'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  {skillRatings[skill] === 1 && 'Beginner'}
                  {skillRatings[skill] === 2 && 'Basic'}
                  {skillRatings[skill] === 3 && 'Intermediate'}
                  {skillRatings[skill] === 4 && 'Advanced'}
                  {skillRatings[skill] === 5 && 'Expert'}
                  {!skillRatings[skill] && 'Not rated'}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </button>

            <button
              onClick={handleComplete}
              disabled={!allSkillsRated}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                allSkillsRated
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Continue to Work Values
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
