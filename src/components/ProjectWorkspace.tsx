import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Mic, Download } from 'lucide-react';
import { useStore } from '../store/useStore';
import { FileUploader } from './FileUploader';
import { AudioGenerator } from './AudioGenerator';
import { AudioPlayer } from './AudioPlayer';
import { ProgressTracker } from './ProgressTracker';
import { Card, CardContent, CardHeader } from './ui/Card';

interface ProjectWorkspaceProps {
  projectId: string;
}

export function ProjectWorkspace({ projectId }: ProjectWorkspaceProps) {
  const { currentProject, isGenerating } = useStore();

  if (!currentProject) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Project not found</p>
      </div>
    );
  }

  const activeGeneration = currentProject.generations.find(g => 
    g.status === 'processing' || g.status === 'queued'
  );
  
  const completedGenerations = currentProject.generations.filter(g => 
    g.status === 'completed'
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Left Panel - Documents */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Documents</h2>
              <span className="text-sm text-gray-500">
                ({currentProject.documents.length})
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <FileUploader projectId={projectId} />
          </CardContent>
        </Card>
      </motion.div>

      {/* Center Panel - Generation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Mic className="h-5 w-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Generate Podcast</h2>
            </div>
          </CardHeader>
          <CardContent>
            <AudioGenerator projectId={projectId} />
          </CardContent>
        </Card>

        {/* Progress Tracker */}
        {activeGeneration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ProgressTracker generation={activeGeneration} />
          </motion.div>
        )}
      </motion.div>

      {/* Right Panel - Output */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Download className="h-5 w-5 text-gray-600" />
              <h2 className="font-semibold text-gray-900">Generated Podcasts</h2>
              <span className="text-sm text-gray-500">
                ({completedGenerations.length})
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {completedGenerations.length > 0 ? (
              <div className="space-y-4">
                {completedGenerations.map(generation => (
                  <motion.div
                    key={generation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AudioPlayer generation={generation} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Mic className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No podcasts generated yet</p>
                <p className="text-sm text-gray-400">
                  Upload documents and generate your first podcast
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}