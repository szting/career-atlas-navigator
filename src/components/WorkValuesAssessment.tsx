import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { workValues } from '../data/riasecQuestions';

interface WorkValuesAssessmentProps {
  onComplete: (values: string[]) => void;
  onBack: () => void;
}

export const WorkValuesAssessment: React.FC<WorkValuesAssessmentProps> = ({ onComplete, onBack }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const handleValueToggle = (value: string) => {
    setSelectedValues(prev => 
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleComplete = () => {
    onComplete(selectedValues);
  };

  const hasMinimumValues = selectedValues.length >= 3;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Work Values Assessment</h1>
            <p className="text-gray-600 mb-4">
              Select the work values that are most important to you in your ideal career. 
              Choose at least 3 values that resonate with your priorities.
            </p>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-purple-800 font-medium">
                Selected: {selectedValues.length} values
                {selectedValues.length < 3 && ` (minimum 3 required)`}
              </p>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {workValues.map((value) => (
              <button
                key={value}
                onClick={() => handleValueToggle(value)}
                className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  selectedValues.includes(value)
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{value}</span>
                  {selectedValues.includes(value) && (
                    <Check className="w-5 h-5 text-purple-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Selected Values Summary */}
          {selectedValues.length > 0 && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Selected Values:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedValues.map((value) => (
                  <span
                    key={value}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}

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
              disabled={!hasMinimumValues}
              className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                hasMinimumValues
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Get My Career Recommendations
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
