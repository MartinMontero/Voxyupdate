import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { AudioGeneration } from '../types';
import { Card, CardContent, CardHeader } from './ui/Card';

interface ProgressTrackerProps {
  generation: AudioGeneration;
}

export function ProgressTracker({ generation }: ProgressTrackerProps) {
  const getStatusIcon = () => {
    switch (generation.status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (generation.status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'processing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const steps = [
    { name: 'Document Analysis', progress: generation.progress >= 20 ? 100 : (generation.progress / 20) * 100 },
    { name: 'Content Extraction', progress: generation.progress >= 40 ? 100 : Math.max(0, (generation.progress - 20) / 20) * 100 },
    { name: 'Conversation Generation', progress: generation.progress >= 70 ? 100 : Math.max(0, (generation.progress - 40) / 30) * 100 },
    { name: 'Audio Synthesis', progress: generation.progress >= 90 ? 100 : Math.max(0, (generation.progress - 70) / 20) * 100 },
    { name: 'Final Processing', progress: generation.progress >= 100 ? 100 : Math.max(0, (generation.progress - 90) / 10) * 100 }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <h3 className="font-medium text-gray-900">Generation Progress</h3>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {generation.currentStep}
            </span>
            <span className="text-sm text-gray-500">
              {generation.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${generation.progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Detailed Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={step.name} className="flex items-center space-x-3">
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                ${step.progress === 100 
                  ? 'bg-green-100 text-green-600' 
                  : step.progress > 0 
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-400'
                }
              `}>
                {step.progress === 100 ? '✓' : index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{step.name}</span>
                  <span className="text-xs text-gray-500">
                    {Math.round(step.progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                  <motion.div
                    className={`h-1 rounded-full ${
                      step.progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${step.progress}%` }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Estimated Time */}
        {generation.estimatedTime && generation.status === 'processing' && (
          <div className="text-center text-sm text-gray-500 pt-2 border-t border-gray-100">
            Estimated time remaining: {Math.ceil(generation.estimatedTime / 60)} minutes
          </div>
        )}
      </CardContent>
    </Card>
  );
}