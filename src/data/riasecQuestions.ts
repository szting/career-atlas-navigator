export interface RIASECQuestion {
  id: string;
  question: string;
  type: 'realistic' | 'investigative' | 'artistic' | 'social' | 'enterprising' | 'conventional';
}

export const riasecQuestions: RIASECQuestion[] = [
  // Realistic
  { id: 'r1', question: 'I enjoy working with tools and machinery', type: 'realistic' },
  { id: 'r2', question: 'I like to build things with my hands', type: 'realistic' },
  { id: 'r3', question: 'I prefer practical, hands-on activities', type: 'realistic' },
  { id: 'r4', question: 'I enjoy outdoor work and physical activities', type: 'realistic' },
  
  // Investigative
  { id: 'i1', question: 'I enjoy solving complex problems and puzzles', type: 'investigative' },
  { id: 'i2', question: 'I like to analyze data and conduct research', type: 'investigative' },
  { id: 'i3', question: 'I am curious about how things work', type: 'investigative' },
  { id: 'i4', question: 'I enjoy learning about science and technology', type: 'investigative' },
  
  // Artistic
  { id: 'a1', question: 'I enjoy creative activities like drawing or writing', type: 'artistic' },
  { id: 'a2', question: 'I like to express myself through art or music', type: 'artistic' },
  { id: 'a3', question: 'I prefer unstructured, flexible work environments', type: 'artistic' },
  { id: 'a4', question: 'I enjoy designing and creating new things', type: 'artistic' },
  
  // Social
  { id: 's1', question: 'I enjoy helping and teaching others', type: 'social' },
  { id: 's2', question: 'I like working in teams and collaborating', type: 'social' },
  { id: 's3', question: 'I am good at understanding people\'s feelings', type: 'social' },
  { id: 's4', question: 'I enjoy volunteering and community service', type: 'social' },
  
  // Enterprising
  { id: 'e1', question: 'I enjoy leading and managing others', type: 'enterprising' },
  { id: 'e2', question: 'I like to persuade and influence people', type: 'enterprising' },
  { id: 'e3', question: 'I am comfortable taking risks for potential rewards', type: 'enterprising' },
  { id: 'e4', question: 'I enjoy competitive environments', type: 'enterprising' },
  
  // Conventional
  { id: 'c1', question: 'I prefer organized, structured work environments', type: 'conventional' },
  { id: 'c2', question: 'I enjoy working with numbers and data', type: 'conventional' },
  { id: 'c3', question: 'I like following established procedures and rules', type: 'conventional' },
  { id: 'c4', question: 'I am detail-oriented and accurate in my work', type: 'conventional' }
];

export const skillsAssessment = [
  'Communication',
  'Leadership',
  'Problem Solving',
  'Creativity',
  'Technical Skills',
  'Analytical Thinking',
  'Teamwork',
  'Time Management',
  'Adaptability',
  'Critical Thinking',
  'Project Management',
  'Public Speaking'
];

export const workValues = [
  'Work-Life Balance',
  'High Salary',
  'Job Security',
  'Creative Freedom',
  'Helping Others',
  'Recognition',
  'Autonomy',
  'Intellectual Challenge',
  'Variety',
  'Advancement Opportunities',
  'Flexible Schedule',
  'Making a Difference'
];
