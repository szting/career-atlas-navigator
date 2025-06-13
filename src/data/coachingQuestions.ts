import { CoachingQuestion } from '../types';

export const coachingQuestions: CoachingQuestion[] = [
  // Realistic Type Questions
  {
    id: 'r1',
    category: 'exploration',
    question: 'What hands-on activities or practical tasks energize you most in your current role?',
    riasecFocus: 'realistic',
    purpose: 'Identify practical strengths and preferences for realistic types',
    followUp: [
      'How could you incorporate more of these activities into your work?',
      'What tools or equipment do you most enjoy working with?'
    ]
  },
  {
    id: 'r2',
    category: 'development',
    question: 'What technical skills would you like to develop to become more effective in practical problem-solving?',
    riasecFocus: 'realistic',
    purpose: 'Focus on skill development for hands-on learners',
    followUp: [
      'What resources or training would help you develop these skills?',
      'How would these skills impact your daily work?'
    ]
  },
  {
    id: 'r3',
    category: 'goal-setting',
    question: 'What concrete, measurable outcomes would you like to achieve in the next 6 months?',
    riasecFocus: 'realistic',
    purpose: 'Help realistic types set tangible, achievable goals',
    followUp: [
      'What specific steps will you take to reach these outcomes?',
      'How will you measure your progress?'
    ]
  },

  // Investigative Type Questions
  {
    id: 'i1',
    category: 'exploration',
    question: 'What complex problems or research challenges excite you most?',
    riasecFocus: 'investigative',
    purpose: 'Identify analytical interests and intellectual curiosity',
    followUp: [
      'What methods do you use to approach these challenges?',
      'How do you stay current with developments in your field?'
    ]
  },
  {
    id: 'i2',
    category: 'development',
    question: 'What areas of knowledge or expertise would you like to deepen through independent study?',
    riasecFocus: 'investigative',
    purpose: 'Support continuous learning and specialization',
    followUp: [
      'What learning resources would be most valuable to you?',
      'How would this deeper knowledge benefit your work?'
    ]
  },
  {
    id: 'i3',
    category: 'reflection',
    question: 'How do you prefer to analyze information and make decisions?',
    riasecFocus: 'investigative',
    purpose: 'Understand analytical thinking processes',
    followUp: [
      'What data or evidence do you find most compelling?',
      'How do you handle uncertainty in your analysis?'
    ]
  },

  // Artistic Type Questions
  {
    id: 'a1',
    category: 'exploration',
    question: 'When do you feel most creative and innovative in your work?',
    riasecFocus: 'artistic',
    purpose: 'Identify creative strengths and optimal conditions',
    followUp: [
      'What environments or situations spark your creativity?',
      'How do you capture and develop your creative ideas?'
    ]
  },
  {
    id: 'a2',
    category: 'development',
    question: 'What creative skills or artistic abilities would you like to develop further?',
    riasecFocus: 'artistic',
    purpose: 'Support creative growth and expression',
    followUp: [
      'How could these skills enhance your professional work?',
      'What creative projects would you like to pursue?'
    ]
  },
  {
    id: 'a3',
    category: 'goal-setting',
    question: 'How can you bring more creativity and innovation to your current role?',
    riasecFocus: 'artistic',
    purpose: 'Integrate creativity into professional goals',
    followUp: [
      'What barriers might prevent creative expression?',
      'How can you advocate for more creative opportunities?'
    ]
  },

  // Social Type Questions
  {
    id: 's1',
    category: 'exploration',
    question: 'What aspects of helping or working with others bring you the most satisfaction?',
    riasecFocus: 'social',
    purpose: 'Identify interpersonal strengths and motivations',
    followUp: [
      'How do you prefer to support and help others?',
      'What impact do you want to have on people?'
    ]
  },
  {
    id: 's2',
    category: 'development',
    question: 'What interpersonal or communication skills would you like to strengthen?',
    riasecFocus: 'social',
    purpose: 'Develop people-focused capabilities',
    followUp: [
      'How would these skills improve your relationships?',
      'What opportunities do you have to practice these skills?'
    ]
  },
  {
    id: 's3',
    category: 'reflection',
    question: 'How do you build trust and rapport with different types of people?',
    riasecFocus: 'social',
    purpose: 'Explore relationship-building strategies',
    followUp: [
      'What challenges do you face in building relationships?',
      'How do you adapt your communication style?'
    ]
  },

  // Enterprising Type Questions
  {
    id: 'e1',
    category: 'exploration',
    question: 'What leadership opportunities or challenges energize you most?',
    riasecFocus: 'enterprising',
    purpose: 'Identify leadership interests and strengths',
    followUp: [
      'What leadership style feels most natural to you?',
      'How do you motivate and influence others?'
    ]
  },
  {
    id: 'e2',
    category: 'goal-setting',
    question: 'What ambitious goals would you like to pursue in your career?',
    riasecFocus: 'enterprising',
    purpose: 'Support goal-oriented and achievement-focused planning',
    followUp: [
      'What resources or support do you need to achieve these goals?',
      'How will you measure success?'
    ]
  },
  {
    id: 'e3',
    category: 'development',
    question: 'What business or entrepreneurial skills would enhance your effectiveness?',
    riasecFocus: 'enterprising',
    purpose: 'Develop business acumen and leadership capabilities',
    followUp: [
      'How could you gain experience in these areas?',
      'What mentors or role models inspire you?'
    ]
  },

  // Conventional Type Questions
  {
    id: 'c1',
    category: 'exploration',
    question: 'What organized, systematic work gives you the greatest sense of accomplishment?',
    riasecFocus: 'conventional',
    purpose: 'Identify preferences for structure and organization',
    followUp: [
      'What systems or processes do you find most effective?',
      'How do you maintain quality and accuracy in your work?'
    ]
  },
  {
    id: 'c2',
    category: 'development',
    question: 'What organizational or administrative skills would you like to improve?',
    riasecFocus: 'conventional',
    purpose: 'Support systematic skill development',
    followUp: [
      'What training or resources would help you develop these skills?',
      'How would these improvements benefit your work?'
    ]
  },
  {
    id: 'c3',
    category: 'reflection',
    question: 'How do you prefer to plan and organize your work for maximum efficiency?',
    riasecFocus: 'conventional',
    purpose: 'Explore organizational preferences and methods',
    followUp: [
      'What tools or systems support your organization?',
      'How do you handle competing priorities?'
    ]
  }
];
