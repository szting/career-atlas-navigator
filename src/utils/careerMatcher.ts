import { UserProfile, CareerPath, RIASECScore } from '../types';
import { careerPaths } from '../data/careers';

export const calculateCareerMatches = (userProfile: UserProfile): CareerPath[] => {
  const scoredCareers = careerPaths.map(career => {
    let matchScore = 0;
    
    // RIASEC type matching (40% weight)
    const primaryTypeScore = userProfile.riasecScores[career.primaryType] || 0;
    const secondaryTypeScore = career.secondaryType 
      ? userProfile.riasecScores[career.secondaryType] || 0 
      : 0;
    
    const riasecScore = (primaryTypeScore * 0.7 + secondaryTypeScore * 0.3);
    matchScore += riasecScore * 0.4;
    
    // Skills matching (35% weight)
    const userSkills = Object.keys(userProfile.skillsConfidence);
    const matchingSkills = career.requiredSkills.filter(skill => 
      userSkills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    const skillsScore = (matchingSkills.length / career.requiredSkills.length) * 100;
    matchScore += skillsScore * 0.35;
    
    // Work values alignment (25% weight)
    const valueKeywords = {
      'Work-Life Balance': ['flexible', 'balance', 'remote'],
      'High Salary': ['salary', 'compensation', 'financial'],
      'Job Security': ['stable', 'secure', 'established'],
      'Creative Freedom': ['creative', 'artistic', 'innovative'],
      'Helping Others': ['social', 'helping', 'service'],
      'Recognition': ['leadership', 'management', 'achievement'],
      'Autonomy': ['independent', 'self-directed', 'entrepreneurial'],
      'Intellectual Challenge': ['analytical', 'problem solving', 'research'],
      'Variety': ['diverse', 'varied', 'different'],
      'Advancement Opportunities': ['growth', 'career progression', 'leadership']
    };
    
    let valuesScore = 0;
    userProfile.workValues.forEach(value => {
      const keywords = valueKeywords[value as keyof typeof valueKeywords] || [];
      const careerText = `${career.description} ${career.workEnvironment.join(' ')}`.toLowerCase();
      
      if (keywords.some(keyword => careerText.includes(keyword))) {
        valuesScore += 20; // Each matching value adds 20 points
      }
    });
    
    valuesScore = Math.min(valuesScore, 100); // Cap at 100
    matchScore += valuesScore * 0.25;
    
    return {
      ...career,
      matchScore: Math.round(matchScore)
    };
  });
  
  // Sort by match score and return top matches
  return scoredCareers
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 6);
};
