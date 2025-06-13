import { CareerPath } from '../types';

export const careerPaths: CareerPath[] = [
  // Realistic careers
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Design, develop, and maintain software applications and systems',
    primaryType: 'investigative',
    secondaryType: 'realistic',
    requiredSkills: ['Programming', 'Problem Solving', 'Logic', 'Mathematics'],
    workEnvironment: ['Office', 'Remote Work', 'Collaborative Teams'],
    salaryRange: '$70,000 - $150,000',
    growthOutlook: 'Much faster than average (22%)',
    education: "Bachelor's degree in Computer Science or related field"
  },
  {
    id: 'mechanical-engineer',
    title: 'Mechanical Engineer',
    description: 'Design, develop, and test mechanical devices and systems',
    primaryType: 'realistic',
    secondaryType: 'investigative',
    requiredSkills: ['Engineering Design', 'Mathematics', 'Physics', 'CAD Software'],
    workEnvironment: ['Office', 'Manufacturing Plants', 'Laboratories'],
    salaryRange: '$60,000 - $120,000',
    growthOutlook: 'As fast as average (7%)',
    education: "Bachelor's degree in Mechanical Engineering"
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Analyze complex data to help organizations make informed decisions',
    primaryType: 'investigative',
    secondaryType: 'conventional',
    requiredSkills: ['Statistics', 'Programming', 'Machine Learning', 'Data Visualization'],
    workEnvironment: ['Office', 'Remote Work', 'Research Labs'],
    salaryRange: '$80,000 - $160,000',
    growthOutlook: 'Much faster than average (35%)',
    education: "Bachelor's or Master's degree in Data Science, Statistics, or related field"
  },
  // Artistic careers
  {
    id: 'ux-designer',
    title: 'UX/UI Designer',
    description: 'Create intuitive and engaging user experiences for digital products',
    primaryType: 'artistic',
    secondaryType: 'investigative',
    requiredSkills: ['Design Thinking', 'Prototyping', 'User Research', 'Visual Design'],
    workEnvironment: ['Office', 'Remote Work', 'Creative Studios'],
    salaryRange: '$55,000 - $120,000',
    growthOutlook: 'Faster than average (13%)',
    education: "Bachelor's degree in Design, HCI, or related field"
  },
  {
    id: 'marketing-creative',
    title: 'Creative Director',
    description: 'Lead creative teams to develop compelling marketing campaigns and brand experiences',
    primaryType: 'artistic',
    secondaryType: 'enterprising',
    requiredSkills: ['Creative Strategy', 'Team Leadership', 'Brand Development', 'Visual Communication'],
    workEnvironment: ['Advertising Agencies', 'Corporate Offices', 'Creative Studios'],
    salaryRange: '$70,000 - $150,000',
    growthOutlook: 'As fast as average (10%)',
    education: "Bachelor's degree in Marketing, Advertising, or Fine Arts"
  },
  // Social careers
  {
    id: 'counselor',
    title: 'Mental Health Counselor',
    description: 'Help individuals and groups overcome mental health challenges and improve wellbeing',
    primaryType: 'social',
    secondaryType: 'investigative',
    requiredSkills: ['Active Listening', 'Empathy', 'Communication', 'Psychology'],
    workEnvironment: ['Clinics', 'Hospitals', 'Private Practice', 'Community Centers'],
    salaryRange: '$45,000 - $80,000',
    growthOutlook: 'Much faster than average (25%)',
    education: "Master's degree in Counseling or Psychology"
  },
  {
    id: 'teacher',
    title: 'High School Teacher',
    description: 'Educate and inspire students in academic subjects and life skills',
    primaryType: 'social',
    secondaryType: 'artistic',
    requiredSkills: ['Communication', 'Patience', 'Subject Expertise', 'Classroom Management'],
    workEnvironment: ['Schools', 'Classrooms', 'Educational Institutions'],
    salaryRange: '$40,000 - $70,000',
    growthOutlook: 'As fast as average (8%)',
    education: "Bachelor's degree in Education or subject area plus teaching certification"
  },
  // Enterprising careers
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Guide product development from conception to launch and beyond',
    primaryType: 'enterprising',
    secondaryType: 'investigative',
    requiredSkills: ['Strategic Thinking', 'Leadership', 'Market Analysis', 'Project Management'],
    workEnvironment: ['Office', 'Remote Work', 'Cross-functional Teams'],
    salaryRange: '$80,000 - $160,000',
    growthOutlook: 'Faster than average (19%)',
    education: "Bachelor's degree in Business, Engineering, or related field"
  },
  {
    id: 'sales-manager',
    title: 'Sales Manager',
    description: 'Lead sales teams to achieve revenue goals and build client relationships',
    primaryType: 'enterprising',
    secondaryType: 'social',
    requiredSkills: ['Leadership', 'Negotiation', 'Communication', 'Strategic Planning'],
    workEnvironment: ['Office', 'Client Sites', 'Travel'],
    salaryRange: '$60,000 - $130,000',
    growthOutlook: 'As fast as average (7%)',
    education: "Bachelor's degree in Business, Marketing, or related field"
  },
  // Conventional careers
  {
    id: 'financial-analyst',
    title: 'Financial Analyst',
    description: 'Analyze financial data to guide investment and business decisions',
    primaryType: 'conventional',
    secondaryType: 'investigative',
    requiredSkills: ['Financial Modeling', 'Data Analysis', 'Attention to Detail', 'Excel'],
    workEnvironment: ['Office', 'Financial Institutions', 'Corporate Headquarters'],
    salaryRange: '$55,000 - $100,000',
    growthOutlook: 'Faster than average (11%)',
    education: "Bachelor's degree in Finance, Economics, or related field"
  },
  {
    id: 'project-coordinator',
    title: 'Project Coordinator',
    description: 'Organize and coordinate project activities to ensure successful completion',
    primaryType: 'conventional',
    secondaryType: 'social',
    requiredSkills: ['Organization', 'Communication', 'Time Management', 'Documentation'],
    workEnvironment: ['Office', 'Various Industries', 'Team Environments'],
    salaryRange: '$45,000 - $75,000',
    growthOutlook: 'Faster than average (11%)',
    education: "Bachelor's degree in Business Administration or related field"
  }
];
