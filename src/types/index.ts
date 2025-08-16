export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  content?: string;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  uploadProgress?: number;
  preview?: string;
  createdAt: Date;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  voiceId: string;
  personality: string;
  speakingStyle: string;
  avatar: string;
  isCustom?: boolean;
}

export interface GenerationSettings {
  duration: '5-10' | '10-15' | '15-20';
  personas: Persona[];
  tone: 'educational' | 'entertaining' | 'balanced' | 'debate';
  focusAreas: string[];
  includeIntro: boolean;
  includeOutro: boolean;
  backgroundMusic: boolean;
  citationStyle: 'inline' | 'endnotes' | 'timestamps';
}

export interface AudioGeneration {
  id: string;
  projectId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  estimatedTime?: number;
  audioUrl?: string;
  transcriptUrl?: string;
  duration?: number;
  settings: GenerationSettings;
  createdAt: Date;
  completedAt?: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  documents: Document[];
  generations: AudioGeneration[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Citation {
  id: string;
  audioId: string;
  documentId: string;
  timestamp: number;
  text: string;
  sourceText: string;
  pageNumber?: number;
}