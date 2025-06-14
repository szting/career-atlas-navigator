import { UserProfile, PersonaType } from '../types';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class OpenAIService {
  private apiKey: string;
  private proxyUrl: string = 'undefined';
  private accessToken: string = 'undefined';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.accessToken = import.meta.env.VITE_PROXY_SERVER_ACCESS_TOKEN || 'undefined';
  }

  private async makeRequest(messages: Array<{ role: string; content: string }>, maxTokens: number = 1000): Promise<string> {
    try {
      // Check if API key exists
      if (!this.apiKey) {
        console.warn('OpenAI API key not configured');
        // Return a fallback response instead of throwing error
        return this.generateFallbackResponse(messages);
      }

      const requestBody = {
        url: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: {
          model: 'gpt-4o-mini',
          messages,
          max_tokens: maxTokens,
          temperature: 0.7
        }
      };

      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.error(`API request failed with status: ${response.status}`);
        return this.generateFallbackResponse(messages);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || this.generateFallbackResponse(messages);
    } catch (error) {
      console.error('OpenAI API Error:', error);
      // Return fallback response instead of throwing
      return this.generateFallbackResponse(messages);
    }
  }

  private generateFallbackResponse(messages: Array<{ role: string; content: string }>): string {
    // Generate appropriate fallback responses based on the request type
    const userMessage = messages[messages.length - 1]?.content || '';
    
    if (userMessage.includes('coaching questions')) {
      return this.generateFallbackCoachingQuestions();
    } else if (userMessage.includes('reflection questions')) {
      return this.generateFallbackReflectionQuestions();
    } else if (userMessage.includes('career recommendations')) {
      return this.generateFallbackCareerRecommendations();
    } else if (userMessage.includes('development plan')) {
      return this.generateFallbackDevelopmentPlan();
    }
    
    return 'Unable to generate AI response. Please check your API configuration.';
  }

  private generateFallbackCoachingQuestions(): string {
    return `QUESTION: What aspects of your current role align most closely with your top RIASEC types?
CATEGORY: exploration
PURPOSE: Help identify areas where natural interests and current work intersect
FOLLOW-UP: How could you incorporate more of these elements? | What barriers prevent fuller alignment? | Which aligned activities energize you most?

QUESTION: Looking at your skill confidence levels, which areas would you like to develop further?
CATEGORY: development
PURPOSE: Identify skill gaps and growth opportunities based on self-assessment
FOLLOW-UP: What resources would help you build these skills? | How might these skills benefit your career? | What's your timeline for development?

QUESTION: What are your top three career goals for the next 2-3 years?
CATEGORY: goal-setting
PURPOSE: Establish clear career objectives aligned with RIASEC profile
FOLLOW-UP: How do these goals align with your interests? | What steps are needed to achieve them? | Who could support you in reaching these goals?

QUESTION: When do you feel most engaged and fulfilled in your work?
CATEGORY: reflection
PURPOSE: Identify intrinsic motivators and optimal work conditions
FOLLOW-UP: How often do you experience this state? | What conditions enable it? | How could you create more of these moments?`;
  }

  private generateFallbackReflectionQuestions(): string {
    return `QUESTION: How well does your team member's current role align with their RIASEC profile strengths?
CONTEXT: development
GUIDANCE: Use this to explore role crafting opportunities and identify tasks that could be delegated or expanded to better match their interests.

QUESTION: What projects or initiatives have brought out the best in this team member's performance?
CONTEXT: performance
GUIDANCE: Look for patterns that connect to their RIASEC types and use these insights to assign future projects that leverage their natural interests.

QUESTION: Where do you see the greatest potential for this person's career growth based on their profile?
CONTEXT: career_planning
GUIDANCE: Consider both vertical and lateral moves that would align with their dominant RIASEC types while building on existing skills.`;
  }

  private generateFallbackCareerRecommendations(): string {
    return `TITLE: Data Analyst
MATCH: 85
DESCRIPTION: Analyze complex datasets to help organizations make data-driven decisions. Combines investigative thinking with practical problem-solving.
ACTIVITIES: Analyzing data patterns | Creating visualizations | Writing reports | Presenting findings
DEVELOPMENT: Statistical analysis | Data visualization tools | Business acumen
NEXT_STEPS: Learn SQL and Python | Take statistics course | Build portfolio projects | Network with data professionals

TITLE: UX Researcher
MATCH: 80
DESCRIPTION: Study user behavior and preferences to improve product design. Blends investigative research with creative problem-solving.
ACTIVITIES: Conducting user interviews | Analyzing usage data | Creating personas | Testing prototypes
DEVELOPMENT: Research methodologies | Data analysis | Communication skills
NEXT_STEPS: Learn UX research methods | Practice user interviews | Study human-computer interaction | Join UX communities

TITLE: Technical Writer
MATCH: 75
DESCRIPTION: Create clear documentation and guides for technical products. Combines analytical thinking with communication skills.
ACTIVITIES: Writing documentation | Researching technical topics | Collaborating with developers | Editing content
DEVELOPMENT: Technical knowledge | Writing skills | Documentation tools
NEXT_STEPS: Improve technical writing | Learn documentation tools | Build writing portfolio | Connect with tech writers`;
  }

  private generateFallbackDevelopmentPlan(): string {
    return `SHORT_TERM_GOALS (3-6 months):
GOAL: Build foundational skills in your top RIASEC area | ACTIONS: Take online course|Practice daily|Join relevant community | TIMELINE: 3 months
GOAL: Expand professional network in target field | ACTIONS: Attend 2 events monthly|Connect on LinkedIn|Schedule informational interviews | TIMELINE: Ongoing
GOAL: Create portfolio showcasing relevant skills | ACTIONS: Complete 3 projects|Document process|Gather feedback | TIMELINE: 4 months

LONG_TERM_GOALS (1-2 years):
GOAL: Transition to role aligned with RIASEC profile | ACTIONS: Update resume|Apply strategically|Leverage network | TIMELINE: 12-18 months
GOAL: Become recognized expert in chosen area | ACTIONS: Share knowledge|Speak at events|Publish articles | TIMELINE: 18-24 months

SKILL_GAPS:
Technical skills in primary interest area | Leadership and communication | Industry-specific knowledge | Project management | Data analysis

RESOURCES:
Coursera or edX courses | Professional associations | Industry publications | Mentorship programs | LinkedIn Learning | Relevant certifications`;
  }

  async generateCoachingQuestions(userProfile: UserProfile): Promise<Array<{
    question: string;
    category: string;
    purpose: string;
    followUp: string[];
  }>> {
    const topTypes = this.getTopRIASECTypes(userProfile.riasecScores);
    const prompt = this.buildCoachingPrompt(userProfile, topTypes);

    const messages = [
      {
        role: 'system',
        content: 'You are an expert career coach specializing in RIASEC personality assessments. Generate thoughtful, personalized coaching questions that help individuals explore their career paths based on their RIASEC profile, skills, and work values.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.makeRequest(messages, 1500);
    return this.parseCoachingQuestions(response);
  }

  async generateReflectionQuestions(userProfile: UserProfile): Promise<Array<{
    question: string;
    context: string;
    managerGuidance: string;
  }>> {
    const topTypes = this.getTopRIASECTypes(userProfile.riasecScores);
    const prompt = this.buildReflectionPrompt(userProfile, topTypes);

    const messages = [
      {
        role: 'system',
        content: 'You are an expert in organizational psychology and team management. Generate meaningful reflection questions that managers can use to support their team members\' development based on RIASEC personality profiles.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.makeRequest(messages, 1500);
    return this.parseReflectionQuestions(response);
  }

  async generateCareerRecommendations(userProfile: UserProfile): Promise<Array<{
    title: string;
    match: number;
    description: string;
    keyActivities: string[];
    developmentAreas: string[];
    nextSteps: string[];
  }>> {
    const topTypes = this.getTopRIASECTypes(userProfile.riasecScores);
    const prompt = this.buildCareerRecommendationPrompt(userProfile, topTypes);

    const messages = [
      {
        role: 'system',
        content: 'You are a career counselor with expertise in RIASEC theory and career development. Provide detailed, personalized career recommendations based on the individual\'s RIASEC profile, skills, and work values.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.makeRequest(messages, 2000);
    return this.parseCareerRecommendations(response);
  }

  async generateDevelopmentPlan(userProfile: UserProfile): Promise<{
    shortTerm: Array<{ goal: string; actions: string[]; timeline: string }>;
    longTerm: Array<{ goal: string; actions: string[]; timeline: string }>;
    skillGaps: string[];
    resources: string[];
  }> {
    const topTypes = this.getTopRIASECTypes(userProfile.riasecScores);
    const prompt = this.buildDevelopmentPlanPrompt(userProfile, topTypes);

    const messages = [
      {
        role: 'system',
        content: 'You are a career development specialist. Create comprehensive, actionable development plans that help individuals grow their careers based on their RIASEC profile and current skill levels.'
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const response = await this.makeRequest(messages, 2000);
    return this.parseDevelopmentPlan(response);
  }

  private getTopRIASECTypes(scores: any): Array<[string, number]> {
    return Object.entries(scores)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 3) as Array<[string, number]>;
  }

  private buildCoachingPrompt(userProfile: UserProfile, topTypes: Array<[string, number]>): string {
    return `
Generate 8-10 personalized coaching questions for an individual with the following profile:

RIASEC Scores:
${topTypes.map(([type, score]) => `- ${type.charAt(0).toUpperCase() + type.slice(1)}: ${score}%`).join('\n')}

Top Skills (confidence level 1-5):
${Object.entries(userProfile.skillsConfidence)
  .sort(([,a], [,b]) => (b as number) - (a as number))
  .slice(0, 5)
  .map(([skill, confidence]) => `- ${skill}: ${confidence}/5`)
  .join('\n')}

Work Values:
${userProfile.workValues.slice(0, 5).map(value => `- ${value}`).join('\n')}

Please generate questions in the following categories:
1. Career Exploration (2-3 questions)
2. Skill Development (2-3 questions)  
3. Goal Setting (2-3 questions)
4. Self Reflection (2-3 questions)

Format each question as:
QUESTION: [The coaching question]
CATEGORY: [exploration/development/goal-setting/reflection]
PURPOSE: [Why this question is valuable for this person]
FOLLOW-UP: [2-3 follow-up questions separated by |]

Focus on their dominant RIASEC types and work values. Make questions specific and actionable.
    `;
  }

  private buildReflectionPrompt(userProfile: UserProfile, topTypes: Array<[string, number]>): string {
    return `
Generate 8-10 reflection questions that a manager can use with a team member who has this profile:

RIASEC Scores:
${topTypes.map(([type, score]) => `- ${type.charAt(0).toUpperCase() + type.slice(1)}: ${score}%`).join('\n')}

Top Skills:
${Object.entries(userProfile.skillsConfidence)
  .sort(([,a], [,b]) => (b as number) - (a as number))
  .slice(0, 5)
  .map(([skill, confidence]) => `- ${skill}: ${confidence}/5`)
  .join('\n')}

Work Values:
${userProfile.workValues.slice(0, 5).map(value => `- ${value}`).join('\n')}

Generate questions for these contexts:
1. Development Conversations (3-4 questions)
2. Performance Reviews (3-4 questions)
3. Career Planning (2-3 questions)

Format each question as:
QUESTION: [The reflection question]
CONTEXT: [development/performance/career_planning]
GUIDANCE: [Specific guidance for the manager on how to use this question effectively]

Focus on helping the manager understand how to leverage this person's RIASEC strengths.
    `;
  }

  private buildCareerRecommendationPrompt(userProfile: UserProfile, topTypes: Array<[string, number]>): string {
    return `
Recommend 5-6 specific career paths for someone with this profile:

RIASEC Scores:
${topTypes.map(([type, score]) => `- ${type.charAt(0).toUpperCase() + type.slice(1)}: ${score}%`).join('\n')}

Skills & Confidence:
${Object.entries(userProfile.skillsConfidence)
  .map(([skill, confidence]) => `- ${skill}: ${confidence}/5`)
  .join('\n')}

Work Values:
${userProfile.workValues.map(value => `- ${value}`).join('\n')}

For each career recommendation, provide:
TITLE: [Specific job title/career path]
MATCH: [Match percentage 1-100]
DESCRIPTION: [2-3 sentence description of the role]
ACTIVITIES: [3-4 key daily activities separated by |]
DEVELOPMENT: [2-3 areas for skill development separated by |]
NEXT_STEPS: [3-4 concrete next steps separated by |]

Focus on careers that align with their dominant RIASEC types and work values.
    `;
  }

  private buildDevelopmentPlanPrompt(userProfile: UserProfile, topTypes: Array<[string, number]>): string {
    return `
Create a comprehensive development plan for someone with this profile:

RIASEC Profile:
${topTypes.map(([type, score]) => `- ${type.charAt(0).toUpperCase() + type.slice(1)}: ${score}%`).join('\n')}

Current Skills:
${Object.entries(userProfile.skillsConfidence)
  .map(([skill, confidence]) => `- ${skill}: ${confidence}/5`)
  .join('\n')}

Work Values:
${userProfile.workValues.map(value => `- ${value}`).join('\n')}

Provide:

SHORT_TERM_GOALS (3-6 months):
[Format: GOAL: [goal] | ACTIONS: [action1|action2|action3] | TIMELINE: [timeline]]

LONG_TERM_GOALS (1-2 years):
[Format: GOAL: [goal] | ACTIONS: [action1|action2|action3] | TIMELINE: [timeline]]

SKILL_GAPS:
[List 4-5 key skill gaps to address, separated by |]

RESOURCES:
[List 5-6 specific resources (courses, books, certifications) separated by |]

Focus on leveraging their RIASEC strengths while addressing development areas.
    `;
  }

  private parseCoachingQuestions(response: string): Array<{
    question: string;
    category: string;
    purpose: string;
    followUp: string[];
  }> {
    const questions = [];
    const sections = response.split('QUESTION:').filter(section => section.trim());

    for (const section of sections) {
      const lines = section.trim().split('\n');
      const question = lines[0]?.trim();
      
      const categoryMatch = section.match(/CATEGORY:\s*(.+)/);
      const purposeMatch = section.match(/PURPOSE:\s*(.+)/);
      const followUpMatch = section.match(/FOLLOW-UP:\s*(.+)/);

      if (question && categoryMatch && purposeMatch) {
        questions.push({
          question,
          category: categoryMatch[1].trim(),
          purpose: purposeMatch[1].trim(),
          followUp: followUpMatch ? followUpMatch[1].split('|').map(q => q.trim()) : []
        });
      }
    }

    // Return at least some questions even if parsing fails
    if (questions.length === 0) {
      return [
        {
          question: "What aspects of your work bring you the most satisfaction?",
          category: "reflection",
          purpose: "Identify intrinsic motivators aligned with RIASEC profile",
          followUp: ["How could you incorporate more of these elements?", "What barriers exist?"]
        },
        {
          question: "Which skills would you like to develop further in the next year?",
          category: "development",
          purpose: "Focus skill development on areas aligned with career interests",
          followUp: ["What resources would help?", "How will these skills benefit your career?"]
        }
      ];
    }

    return questions;
  }

  private parseReflectionQuestions(response: string): Array<{
    question: string;
    context: string;
    managerGuidance: string;
  }> {
    const questions = [];
    const sections = response.split('QUESTION:').filter(section => section.trim());

    for (const section of sections) {
      const lines = section.trim().split('\n');
      const question = lines[0]?.trim();
      
      const contextMatch = section.match(/CONTEXT:\s*(.+)/);
      const guidanceMatch = section.match(/GUIDANCE:\s*(.+)/);

      if (question && contextMatch && guidanceMatch) {
        questions.push({
          question,
          context: contextMatch[1].trim(),
          managerGuidance: guidanceMatch[1].trim()
        });
      }
    }

    // Return at least some questions even if parsing fails
    if (questions.length === 0) {
      return [
        {
          question: "How well does your current role align with your team member's interests?",
          context: "development",
          managerGuidance: "Use this to explore role crafting opportunities"
        },
        {
          question: "What projects have brought out the best in their performance?",
          context: "performance",
          managerGuidance: "Look for patterns that connect to their RIASEC profile"
        }
      ];
    }

    return questions;
  }

  private parseCareerRecommendations(response: string): Array<{
    title: string;
    match: number;
    description: string;
    keyActivities: string[];
    developmentAreas: string[];
    nextSteps: string[];
  }> {
    const recommendations = [];
    const sections = response.split('TITLE:').filter(section => section.trim());

    for (const section of sections) {
      const titleMatch = section.match(/^(.+)/);
      const matchMatch = section.match(/MATCH:\s*(\d+)/);
      const descriptionMatch = section.match(/DESCRIPTION:\s*(.+)/);
      const activitiesMatch = section.match(/ACTIVITIES:\s*(.+)/);
      const developmentMatch = section.match(/DEVELOPMENT:\s*(.+)/);
      const stepsMatch = section.match(/NEXT_STEPS:\s*(.+)/);

      if (titleMatch && matchMatch && descriptionMatch) {
        recommendations.push({
          title: titleMatch[1].trim(),
          match: parseInt(matchMatch[1]),
          description: descriptionMatch[1].trim(),
          keyActivities: activitiesMatch ? activitiesMatch[1].split('|').map(a => a.trim()) : [],
          developmentAreas: developmentMatch ? developmentMatch[1].split('|').map(d => d.trim()) : [],
          nextSteps: stepsMatch ? stepsMatch[1].split('|').map(s => s.trim()) : []
        });
      }
    }

    // Return at least some recommendations even if parsing fails
    if (recommendations.length === 0) {
      return [
        {
          title: "Career Counselor",
          match: 85,
          description: "Help individuals explore career options and make informed decisions about their professional development.",
          keyActivities: ["Conducting assessments", "Providing guidance", "Developing career plans"],
          developmentAreas: ["Counseling techniques", "Assessment tools", "Career development theories"],
          nextSteps: ["Get counseling certification", "Gain experience in career services", "Build network"]
        }
      ];
    }

    return recommendations;
  }

  private parseDevelopmentPlan(response: string): {
    shortTerm: Array<{ goal: string; actions: string[]; timeline: string }>;
    longTerm: Array<{ goal: string; actions: string[]; timeline: string }>;
    skillGaps: string[];
    resources: string[];
  } {
    const shortTermMatch = response.match(/SHORT_TERM_GOALS[\s\S]*?(?=LONG_TERM_GOALS|$)/);
    const longTermMatch = response.match(/LONG_TERM_GOALS[\s\S]*?(?=SKILL_GAPS|$)/);
    const skillGapsMatch = response.match(/SKILL_GAPS:\s*(.+)/);
    const resourcesMatch = response.match(/RESOURCES:\s*(.+)/);

    const parseGoals = (text: string) => {
      const goals = [];
      const goalMatches = text.match(/GOAL:\s*(.+?)\s*\|\s*ACTIONS:\s*(.+?)\s*\|\s*TIMELINE:\s*(.+)/g);
      
      if (goalMatches) {
        for (const match of goalMatches) {
          const parts = match.split('|');
          if (parts.length >= 3) {
            goals.push({
              goal: parts[0].replace('GOAL:', '').trim(),
              actions: parts[1].replace('ACTIONS:', '').split('|').map(a => a.trim()),
              timeline: parts[2].replace('TIMELINE:', '').trim()
            });
          }
        }
      }
      
      return goals;
    };

    // Provide default plan if parsing fails
    const defaultPlan = {
      shortTerm: [
        {
          goal: "Assess current skills and interests",
          actions: ["Complete self-assessment", "Gather feedback", "Identify gaps"],
          timeline: "1-2 months"
        }
      ],
      longTerm: [
        {
          goal: "Align career with RIASEC profile",
          actions: ["Explore opportunities", "Build relevant skills", "Network strategically"],
          timeline: "12-18 months"
        }
      ],
      skillGaps: ["Technical skills", "Leadership abilities", "Industry knowledge"],
      resources: ["Online courses", "Professional associations", "Mentorship programs"]
    };

    try {
      return {
        shortTerm: shortTermMatch ? parseGoals(shortTermMatch[0]) : defaultPlan.shortTerm,
        longTerm: longTermMatch ? parseGoals(longTermMatch[0]) : defaultPlan.longTerm,
        skillGaps: skillGapsMatch ? skillGapsMatch[1].split('|').map(s => s.trim()) : defaultPlan.skillGaps,
        resources: resourcesMatch ? resourcesMatch[1].split('|').map(r => r.trim()) : defaultPlan.resources
      };
    } catch (error) {
      console.error('Error parsing development plan:', error);
      return defaultPlan;
    }
  }
}

export const openaiService = new OpenAIService();
