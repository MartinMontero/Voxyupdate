import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Settings, Clock, Volume2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { GenerationSettings, Persona } from '../types';
import { getRandomPersonas } from '../lib/personas';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader } from './ui/Card';
import { PersonaSelector } from './PersonaSelector';

interface AudioGeneratorProps {
  projectId: string;
}

export function AudioGenerator({ projectId }: AudioGeneratorProps) {
  const { currentProject, startGeneration, isGenerating } = useStore();
  const [settings, setSettings] = useState<GenerationSettings>({
    duration: '10-15',
    personas: getRandomPersonas(2),
    tone: 'balanced',
    focusAreas: [],
    includeIntro: true,
    includeOutro: true,
    backgroundMusic: false,
    citationStyle: 'inline'
  });

  const handleGenerate = () => {
    if (!currentProject || currentProject.documents.length === 0) return;
    
    startGeneration(projectId, settings);
    
    // Simulate generation progress
    const generation = currentProject.generations[currentProject.generations.length - 1];
    if (generation) {
      simulateProgress(generation.id);
    }
  };

  const simulateProgress = (generationId: string) => {
    const { updateGeneration } = useStore.getState();
    const steps = [
      { progress: 10, step: 'Analyzing documents...' },
      { progress: 25, step: 'Extracting key concepts...' },
      { progress: 40, step: 'Generating conversation outline...' },
      { progress: 60, step: 'Creating dialogue...' },
      { progress: 80, step: 'Synthesizing audio...' },
      { progress: 95, step: 'Finalizing podcast...' },
      { progress: 100, step: 'Complete!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        const step = steps[currentStep];
        updateGeneration(projectId, generationId, {
          progress: step.progress,
          currentStep: step.step,
          status: step.progress === 100 ? 'completed' : 'processing',
          ...(step.progress === 100 && {
            audioUrl: '/demo-audio.mp3',
            transcriptUrl: '/demo-transcript.txt',
            duration: 847, // 14:07
            completedAt: new Date()
          })
        });
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 1500);
  };

  const canGenerate = currentProject && 
    currentProject.documents.length > 0 && 
    currentProject.documents.some(d => d.status === 'ready') &&
    settings.personas.length >= 2 &&
    !isGenerating;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <h3 className="font-medium text-gray-900">Generation Settings</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Clock className="inline h-4 w-4 mr-1" />
              Podcast Duration
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: '5-10', label: '5-10 min', desc: 'Quick overview' },
                { value: '10-15', label: '10-15 min', desc: 'Balanced discussion' },
                { value: '15-20', label: '15-20 min', desc: 'Deep dive' }
              ].map(option => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    p-3 rounded-xl border-2 text-left transition-all duration-200
                    ${settings.duration === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setSettings(prev => ({ ...prev, duration: option.value as any }))}
                >
                  <div className="font-medium text-gray-900">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Volume2 className="inline h-4 w-4 mr-1" />
              Conversation Tone
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { value: 'educational', label: 'Educational', emoji: '🎓' },
                { value: 'entertaining', label: 'Entertaining', emoji: '🎭' },
                { value: 'balanced', label: 'Balanced', emoji: '⚖️' },
                { value: 'debate', label: 'Debate', emoji: '🗣️' }
              ].map(option => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`
                    p-3 rounded-xl border-2 text-center transition-all duration-200
                    ${settings.tone === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                  onClick={() => setSettings(prev => ({ ...prev, tone: option.value as any }))}
                >
                  <div className="text-lg mb-1">{option.emoji}</div>
                  <div className="text-sm font-medium text-gray-900">{option.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Personas */}
          <PersonaSelector
            selectedPersonas={settings.personas}
            onPersonasChange={(personas) => setSettings(prev => ({ ...prev, personas }))}
            maxPersonas={3}
          />

          {/* Additional Options */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Additional Options
            </label>
            <div className="space-y-2">
              {[
                { key: 'includeIntro', label: 'Include introduction', desc: 'Brief overview of topics' },
                { key: 'includeOutro', label: 'Include conclusion', desc: 'Summary and key takeaways' },
                { key: 'backgroundMusic', label: 'Background music', desc: 'Subtle ambient audio' }
              ].map(option => (
                <label key={option.key} className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[option.key as keyof GenerationSettings] as boolean}
                    onChange={(e) => setSettings(prev => ({ 
                      ...prev, 
                      [option.key]: e.target.checked 
                    }))}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={handleGenerate}
        disabled={!canGenerate}
        loading={isGenerating}
        size="lg"
        className="w-full"
      >
        <Play className="h-5 w-5 mr-2" />
        {isGenerating ? 'Generating Podcast...' : 'Generate Podcast'}
      </Button>

      {!canGenerate && !isGenerating && (
        <div className="text-center text-sm text-gray-500">
          {!currentProject?.documents.length 
            ? 'Upload documents to get started'
            : !currentProject.documents.some(d => d.status === 'ready')
            ? 'Wait for documents to finish processing'
            : settings.personas.length < 2
            ? 'Select at least 2 personas'
            : 'Ready to generate'
          }
        </div>
      )}
    </div>
  );
}