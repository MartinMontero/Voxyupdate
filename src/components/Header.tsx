import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mic2, Settings, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Button } from './ui/Button';

export function Header() {
  const { currentProject, setCurrentProject } = useStore();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side */}
          <div className="flex items-center space-x-4">
            {currentProject && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentProject(null)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            )}
            
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl"
              >
                <Mic2 className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Voxy
                </h1>
                {currentProject && (
                  <p className="text-sm text-gray-600">{currentProject.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}