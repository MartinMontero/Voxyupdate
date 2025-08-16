import { create } from 'zustand';
import { Document, Project, AudioGeneration, Persona } from '../types';
import { generateId } from '../lib/utils';
import { getRandomPersonas } from '../lib/personas';

interface AppState {
  // Projects
  projects: Project[];
  currentProject: Project | null;
  
  // UI State
  isGenerating: boolean;
  uploadProgress: Record<string, number>;
  
  // Actions
  createProject: (name: string, description?: string) => Project;
  setCurrentProject: (project: Project | null) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Documents
  addDocument: (projectId: string, file: File) => Document;
  updateDocument: (projectId: string, documentId: string, updates: Partial<Document>) => void;
  removeDocument: (projectId: string, documentId: string) => void;
  
  // Audio Generation
  startGeneration: (projectId: string, settings: any) => AudioGeneration;
  updateGeneration: (projectId: string, generationId: string, updates: Partial<AudioGeneration>) => void;
  
  // Upload Progress
  setUploadProgress: (documentId: string, progress: number) => void;
  clearUploadProgress: (documentId: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  projects: [],
  currentProject: null,
  isGenerating: false,
  uploadProgress: {},

  createProject: (name: string, description?: string) => {
    const project: Project = {
      id: generateId(),
      name,
      description,
      documents: [],
      generations: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    set(state => ({
      projects: [...state.projects, project],
      currentProject: project
    }));

    return project;
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },

  updateProject: (id: string, updates: Partial<Project>) => {
    set(state => ({
      projects: state.projects.map(p => 
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
      currentProject: state.currentProject?.id === id 
        ? { ...state.currentProject, ...updates, updatedAt: new Date() }
        : state.currentProject
    }));
  },

  deleteProject: (id: string) => {
    set(state => ({
      projects: state.projects.filter(p => p.id !== id),
      currentProject: state.currentProject?.id === id ? null : state.currentProject
    }));
  },

  addDocument: (projectId: string, file: File) => {
    const document: Document = {
      id: generateId(),
      name: file.name,
      type: file.type,
      size: file.size,
      status: 'uploading',
      uploadProgress: 0,
      createdAt: new Date()
    };

    set(state => ({
      projects: state.projects.map(p => 
        p.id === projectId 
          ? { ...p, documents: [...p.documents, document], updatedAt: new Date() }
          : p
      ),
      currentProject: state.currentProject?.id === projectId
        ? { 
            ...state.currentProject, 
            documents: [...state.currentProject.documents, document],
            updatedAt: new Date()
          }
        : state.currentProject
    }));

    return document;
  },

  updateDocument: (projectId: string, documentId: string, updates: Partial<Document>) => {
    set(state => ({
      projects: state.projects.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              documents: p.documents.map(d => d.id === documentId ? { ...d, ...updates } : d),
              updatedAt: new Date()
            }
          : p
      ),
      currentProject: state.currentProject?.id === projectId
        ? {
            ...state.currentProject,
            documents: state.currentProject.documents.map(d => 
              d.id === documentId ? { ...d, ...updates } : d
            ),
            updatedAt: new Date()
          }
        : state.currentProject
    }));
  },

  removeDocument: (projectId: string, documentId: string) => {
    set(state => ({
      projects: state.projects.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              documents: p.documents.filter(d => d.id !== documentId),
              updatedAt: new Date()
            }
          : p
      ),
      currentProject: state.currentProject?.id === projectId
        ? {
            ...state.currentProject,
            documents: state.currentProject.documents.filter(d => d.id !== documentId),
            updatedAt: new Date()
          }
        : state.currentProject
    }));
  },

  startGeneration: (projectId: string, settings: any) => {
    const generation: AudioGeneration = {
      id: generateId(),
      projectId,
      status: 'queued',
      progress: 0,
      currentStep: 'Initializing...',
      settings: {
        ...settings,
        personas: settings.personas || getRandomPersonas(2)
      },
      createdAt: new Date()
    };

    set(state => ({
      projects: state.projects.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              generations: [...p.generations, generation],
              updatedAt: new Date()
            }
          : p
      ),
      currentProject: state.currentProject?.id === projectId
        ? {
            ...state.currentProject,
            generations: [...state.currentProject.generations, generation],
            updatedAt: new Date()
          }
        : state.currentProject,
      isGenerating: true
    }));

    return generation;
  },

  updateGeneration: (projectId: string, generationId: string, updates: Partial<AudioGeneration>) => {
    set(state => ({
      projects: state.projects.map(p => 
        p.id === projectId 
          ? { 
              ...p, 
              generations: p.generations.map(g => 
                g.id === generationId ? { ...g, ...updates } : g
              ),
              updatedAt: new Date()
            }
          : p
      ),
      currentProject: state.currentProject?.id === projectId
        ? {
            ...state.currentProject,
            generations: state.currentProject.generations.map(g => 
              g.id === generationId ? { ...g, ...updates } : g
            ),
            updatedAt: new Date()
          }
        : state.currentProject,
      isGenerating: updates.status === 'completed' || updates.status === 'failed' 
        ? false 
        : state.isGenerating
    }));
  },

  setUploadProgress: (documentId: string, progress: number) => {
    set(state => ({
      uploadProgress: { ...state.uploadProgress, [documentId]: progress }
    }));
  },

  clearUploadProgress: (documentId: string) => {
    set(state => {
      const { [documentId]: _, ...rest } = state.uploadProgress;
      return { uploadProgress: rest };
    });
  }
}));