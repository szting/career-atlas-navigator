import React from 'react';
import { BarChart3, Star, TrendingUp, MapPin, DollarSign, GraduationCap, ChevronLeft, ExternalLink } from 'lucide-react';
import { UserProfile, CareerPath, RIASECScore } from '../types';

interface ResultsScreenProps {
  userProfile: UserProfile;
  recommendedCareers: CareerPath[];
  onRestart: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ 
  userProfile, 
  recommendedCareers, 
  onRestart 
}) => {
  const getTopRIASECTypes = (scores: RIASECScore) => {
    return Object.entries(scores)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);
  };

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

  const getTypeDescription = (type: string) => {
    const descriptions = {
      realistic: 'Practical, hands-on, and prefer working with tools and machinery',
      investigative: 'Analytical, curious, and enjoy solving complex problems',
      artistic: 'Creative, expressive, and value aesthetic and innovative work',
      social: 'People-oriented, helpful, and enjoy working with and helping others',
      enterprising: 'Persuasive, ambitious, and enjoy leading and influencing others',
      conventional: 'Organized, detail-oriented, and prefer structured environments'
    };
    return descriptions[type as keyof typeof descriptions] || '';
  };

  const topTypes = getTopRIASECTypes(userProfile.riasecScores);
  const topSkills = Object.entries(userProfile.skillsConfidence)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your Career Pathway Results
            </h1>
            <p className="text-xl text-gray-600">
              Based on your RIASEC profile, skills, and work values
            </p>
          </div>

          {/* RIASEC Profile */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-blue-500" />
                Your Personality Profile
              </h2>
              <div className="space-y-4">
                {topTypes.map(([type, score], index) => (
                  <div key={type} className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getTypeColor(type)}`}></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium capitalize">{type}</span>
                        <span className="text-sm text-gray-600">{score}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getTypeColor(type)}`}
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {getTypeDescription(type)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-500" />
                Top Skills
              </h2>
              <div className="space-y-3">
                {topSkills.map(([skill, confidence]) => (
                  <div key={skill} className="flex justify-between items-center">
                    <span className="font-medium">{skill}</span>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= confidence ? 'text-yellow-500 fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Work Values</h3>
                <div className="flex flex-wrap gap-2">
                  {userProfile.workValues.map((value) => (
                    <span
                      key={value}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Recommended Career Paths
          </h2>
          {recommendedCareers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedCareers.map((career) => (
                <div key={career.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow duration-300">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{career.title}</h3>
                      {career.matchScore && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          {career.matchScore}% match
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{career.description}</p>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start space-x-2">
                      <DollarSign className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Salary Range</span>
                        <p className="text-sm text-gray-600">{career.salaryRange}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Growth Outlook</span>
                        <p className="text-sm text-gray-600">{career.growthOutlook}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <GraduationCap className="w-4 h-4 text-purple-500 mt-0.5" />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Education</span>
                        <p className="text-sm text-gray-600">{career.education}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm font-medium text-gray-900">Required Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {career.requiredSkills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {career.requiredSkills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{career.requiredSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center">
                    Learn More
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <p className="text-gray-600 mb-4">
                No career recommendations available at the moment. This might be due to:
              </p>
              <ul className="text-left text-gray-600 mb-6 max-w-md mx-auto">
                <li className="mb-2">• Incomplete assessment data</li>
                <li className="mb-2">• Error in career matching algorithm</li>
                <li className="mb-2">• No careers matching your profile</li>
              </ul>
              <p className="text-gray-600">
                Please try retaking the assessment or contact support if the issue persists.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What's Next?</h2>
          <p className="text-gray-600 mb-6">
            Use these insights to guide your career exploration and development planning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onRestart}
              className="flex items-center justify-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Take Assessment Again
            </button>
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-200">
              Download Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
