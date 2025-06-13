import { ReflectionQuestion } from '../types';

export const reflectionQuestions: ReflectionQuestion[] = [
  // Development Context - Realistic
  {
    id: 'rd1',
    category: 'skill-building',
    question: 'What hands-on experiences or practical projects have contributed most to your professional growth?',
    riasecFocus: 'realistic',
    context: 'development',
    managerGuidance: 'Listen for specific examples of practical learning. Discuss how to provide more hands-on development opportunities and skill-building experiences.'
  },
  {
    id: 'rd2',
    category: 'learning-style',
    question: 'How do you prefer to learn new technical skills or procedures?',
    riasecFocus: 'realistic',
    context: 'development',
    managerGuidance: 'Realistic types often prefer learning by doing. Consider providing mentoring, job shadowing, or practical training opportunities rather than theoretical workshops.'
  },

  // Development Context - Investigative
  {
    id: 'id1',
    category: 'knowledge-growth',
    question: 'What areas of expertise would you like to develop deeper knowledge in?',
    riasecFocus: 'investigative',
    context: 'development',
    managerGuidance: 'Support their desire for specialization. Provide access to research resources, conferences, or advanced training. Allow time for deep learning and analysis.'
  },
  {
    id: 'id2',
    category: 'problem-solving',
    question: 'What complex challenges would you like to take on to stretch your analytical abilities?',
    riasecFocus: 'investigative',
    context: 'development',
    managerGuidance: 'Investigative types thrive on intellectual challenges. Assign complex projects that require research and analysis. Encourage independent problem-solving.'
  },

  // Development Context - Artistic
  {
    id: 'ad1',
    category: 'creativity',
    question: 'How can we create more opportunities for you to express creativity in your role?',
    riasecFocus: 'artistic',
    context: 'development',
    managerGuidance: 'Artistic types need creative outlets. Discuss flexible approaches to tasks, innovation projects, or cross-functional creative collaborations.'
  },
  {
    id: 'ad2',
    category: 'innovation',
    question: 'What new ideas or approaches would you like to explore in your work?',
    riasecFocus: 'artistic',
    context: 'development',
    managerGuidance: 'Encourage experimentation and new approaches. Provide safe spaces for creative risk-taking and support innovative thinking.'
  },

  // Development Context - Social
  {
    id: 'sd1',
    category: 'interpersonal-skills',
    question: 'What interpersonal skills would you like to develop to better support your colleagues?',
    riasecFocus: 'social',
    context: 'development',
    managerGuidance: 'Social types value relationship-building. Provide opportunities for mentoring, team leadership, or communication skills training.'
  },
  {
    id: 'sd2',
    category: 'team-contribution',
    question: 'How would you like to contribute more to team dynamics and collaboration?',
    riasecFocus: 'social',
    context: 'development',
    managerGuidance: 'Leverage their people skills. Consider roles in team facilitation, conflict resolution, or cross-team collaboration projects.'
  },

  // Development Context - Enterprising
  {
    id: 'ed1',
    category: 'leadership',
    question: 'What leadership opportunities would help you grow and develop?',
    riasecFocus: 'enterprising',
    context: 'development',
    managerGuidance: 'Enterprising types seek leadership roles. Provide project leadership opportunities, delegation experiences, or business development challenges.'
  },
  {
    id: 'ed2',
    category: 'influence',
    question: 'How would you like to expand your influence and impact within the organization?',
    riasecFocus: 'enterprising',
    context: 'development',
    managerGuidance: 'Support their ambition with stretch assignments, cross-functional projects, or opportunities to present to senior leadership.'
  },

  // Development Context - Conventional
  {
    id: 'cd1',
    category: 'systems-improvement',
    question: 'What processes or systems would you like to help improve or optimize?',
    riasecFocus: 'conventional',
    context: 'development',
    managerGuidance: 'Conventional types excel at organization and efficiency. Involve them in process improvement initiatives and systematic problem-solving.'
  },
  {
    id: 'cd2',
    category: 'expertise',
    question: 'What specialized knowledge or certifications would enhance your effectiveness?',
    riasecFocus: 'conventional',
    context: 'development',
    managerGuidance: 'Support their desire for expertise and credentials. Provide training opportunities and recognize their attention to detail and accuracy.'
  },

  // Performance Context Questions
  {
    id: 'rp1',
    category: 'achievement',
    question: 'What practical accomplishments are you most proud of this period?',
    riasecFocus: 'realistic',
    context: 'performance',
    managerGuidance: 'Focus on tangible results and concrete achievements. Recognize their practical contributions and problem-solving abilities.'
  },
  {
    id: 'ip1',
    category: 'analysis',
    question: 'What complex problems have you successfully analyzed and solved?',
    riasecFocus: 'investigative',
    context: 'performance',
    managerGuidance: 'Acknowledge their analytical thinking and research capabilities. Discuss the depth and quality of their problem-solving approach.'
  },
  {
    id: 'ap1',
    category: 'innovation',
    question: 'What creative solutions or innovative approaches have you contributed?',
    riasecFocus: 'artistic',
    context: 'performance',
    managerGuidance: 'Celebrate their creativity and unique perspectives. Recognize innovative thinking and original contributions to projects.'
  },
  {
    id: 'sp1',
    category: 'collaboration',
    question: 'How have you supported and helped your colleagues succeed?',
    riasecFocus: 'social',
    context: 'performance',
    managerGuidance: 'Recognize their interpersonal contributions and team support. Acknowledge their role in building positive team dynamics.'
  },
  {
    id: 'ep1',
    category: 'leadership',
    question: 'What initiatives have you led or significantly influenced?',
    riasecFocus: 'enterprising',
    context: 'performance',
    managerGuidance: 'Acknowledge their leadership and initiative-taking. Discuss their impact on results and their ability to drive change.'
  },
  {
    id: 'cp1',
    category: 'quality',
    question: 'How have you maintained high standards and quality in your work?',
    riasecFocus: 'conventional',
    context: 'performance',
    managerGuidance: 'Recognize their attention to detail and systematic approach. Acknowledge their reliability and consistent quality output.'
  },

  // Career Planning Context Questions
  {
    id: 'rcp1',
    category: 'career-path',
    question: 'What hands-on roles or technical specializations interest you for your career future?',
    riasecFocus: 'realistic',
    context: 'career_planning',
    managerGuidance: 'Discuss practical career paths and technical advancement opportunities. Consider roles that involve hands-on work and tangible outcomes.'
  },
  {
    id: 'icp1',
    category: 'expertise',
    question: 'What areas of specialization or research would you like to pursue long-term?',
    riasecFocus: 'investigative',
    context: 'career_planning',
    managerGuidance: 'Support their desire for deep expertise. Discuss paths to becoming a subject matter expert or research-focused roles.'
  },
  {
    id: 'acp1',
    category: 'creative-growth',
    question: 'How do you envision incorporating more creativity into your career progression?',
    riasecFocus: 'artistic',
    context: 'career_planning',
    managerGuidance: 'Explore creative career paths and roles that allow for innovation and artistic expression. Consider design, strategy, or creative leadership roles.'
  },
  {
    id: 'scp1',
    category: 'people-impact',
    question: 'What roles would allow you to have greater impact on people and teams?',
    riasecFocus: 'social',
    context: 'career_planning',
    managerGuidance: 'Discuss people-focused career paths such as management, training, HR, or roles with significant interpersonal interaction.'
  },
  {
    id: 'ecp1',
    category: 'leadership-growth',
    question: 'What leadership positions or business opportunities align with your career aspirations?',
    riasecFocus: 'enterprising',
    context: 'career_planning',
    managerGuidance: 'Support their leadership ambitions. Discuss management tracks, business development roles, or entrepreneurial opportunities.'
  },
  {
    id: 'ccp1',
    category: 'systematic-growth',
    question: 'What specialized or administrative roles would utilize your organizational strengths?',
    riasecFocus: 'conventional',
    context: 'career_planning',
    managerGuidance: 'Explore roles that leverage their organizational skills such as operations, project management, or specialized administrative positions.'
  }
];
