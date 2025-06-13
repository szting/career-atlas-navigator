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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw new Error('Failed to generate AI response');
    }
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

    return {
      shortTerm: shortTermMatch ? parseGoals(shortTermMatch[0]) : [],
      longTerm: longTermMatch ? parseGoals(longTermMatch[0]) : [],
      skillGaps: skillGapsMatch ? skillGapsMatch[1].split('|').map(s => s.trim()) : [],
      resources: resourcesMatch ? resourcesMatch[1].split('|').map(r => r.trim()) : []
    };
  }
}

export const openaiService = new OpenAIService();
