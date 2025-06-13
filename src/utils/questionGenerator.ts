import { UserProfile, CoachingQuestion, ReflectionQuestion, RIASECScore } from '../types';
import { coachingQuestions } from '../data/coachingQuestions';
import { reflectionQuestions } from '../data/reflectionQuestions';

export const generateCoachingQuestions = (userProfile: UserProfile): CoachingQuestion[] => {
  const topTypes = getTopRIASECTypes(userProfile.riasecScores);
  const selectedQuestions: CoachingQuestion[] = [];

  // Get questions for top 2 RIASEC types
  topTypes.forEach(([type, score]) => {
    const typeQuestions = coachingQuestions.filter(q => q.riasecFocus === type);
    
    // Select 2-3 questions per top type, prioritizing different categories
    const categories = ['exploration', 'development', 'goal-setting', 'reflection'];
    categories.forEach(category => {
      const categoryQuestions = typeQuestions.filter(q => q.category === category);
      if (categoryQuestions.length > 0) {
        selectedQuestions.push(categoryQuestions[0]);
      }
    });
  });

  // Add some general questions that work for all types
  const generalQuestions = coachingQuestions.filter(q => 
    !selectedQuestions.some(sq => sq.id === q.id)
  ).slice(0, 3);

  return [...selectedQuestions, ...generalQuestions].slice(0, 12);
};

export const generateReflectionQuestions = (userProfile: UserProfile): ReflectionQuestion[] => {
  const topTypes = getTopRIASECTypes(userProfile.riasecScores);
  const selectedQuestions: ReflectionQuestion[] = [];

  // Get questions for top 2 RIASEC types across all contexts
  topTypes.forEach(([type, score]) => {
    const typeQuestions = reflectionQuestions.filter(q => q.riasecFocus === type);
    
    // Select questions from each context
    const contexts = ['development', 'performance', 'career_planning'];
    contexts
