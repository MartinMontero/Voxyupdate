import { Persona } from '../types';

export const DEFAULT_PERSONAS: Persona[] = [
  {
    id: 'professor',
    name: 'Dr. Sarah Chen',
    role: 'Subject Matter Expert',
    voiceId: 'voice_1',
    personality: 'Thoughtful, precise, occasionally excited by complex ideas',
    speakingStyle: 'Academic but accessible, defines jargon clearly',
    avatar: '👩‍🏫'
  },
  {
    id: 'journalist',
    name: 'Marcus Rivera',
    role: 'Investigative Journalist',
    voiceId: 'voice_2',
    personality: 'Curious, skeptical, asks probing questions',
    speakingStyle: 'Clear, direct, challenges assumptions',
    avatar: '📰'
  },
  {
    id: 'student',
    name: 'Alex Kim',
    role: 'Curious Student',
    voiceId: 'voice_3',
    personality: 'Enthusiastic, asks clarifying questions, relates to everyday life',
    speakingStyle: 'Conversational, uses analogies, seeks practical applications',
    avatar: '🎓'
  },
  {
    id: 'analyst',
    name: 'Dr. James Wright',
    role: 'Critical Analyst',
    voiceId: 'voice_4',
    personality: 'Analytical, methodical, focuses on evidence and logic',
    speakingStyle: 'Structured, references data, identifies patterns',
    avatar: '📊'
  },
  {
    id: 'storyteller',
    name: 'Maya Patel',
    role: 'Creative Storyteller',
    voiceId: 'voice_5',
    personality: 'Imaginative, finds narrative threads, makes content engaging',
    speakingStyle: 'Vivid descriptions, uses metaphors, creates compelling narratives',
    avatar: '📚'
  }
];

export function getPersonaById(id: string): Persona | undefined {
  return DEFAULT_PERSONAS.find(persona => persona.id === id);
}

export function getRandomPersonas(count: number = 2): Persona[] {
  const shuffled = [...DEFAULT_PERSONAS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}