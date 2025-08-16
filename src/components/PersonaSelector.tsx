import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';
import { DEFAULT_PERSONAS } from '../lib/personas';
import { Persona } from '../types';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface PersonaSelectorProps {
  selectedPersonas: Persona[];
  onPersonasChange: (personas: Persona[]) => void;
  maxPersonas?: number;
}

export function PersonaSelector({ 
  selectedPersonas, 
  onPersonasChange, 
  maxPersonas = 3 
}: PersonaSelectorProps) {
  const [showAll, setShowAll] = useState(false);

  const handlePersonaToggle = (persona: Persona) => {
    const isSelected = selectedPersonas.some(p => p.id === persona.id);
    
    if (isSelected) {
      onPersonasChange(selectedPersonas.filter(p => p.id !== persona.id));
    } else if (selectedPersonas.length < maxPersonas) {
      onPersonasChange([...selectedPersonas, persona]);
    }
  };

  const displayedPersonas = showAll ? DEFAULT_PERSONAS : DEFAULT_PERSONAS.slice(0, 6);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-gray-600" />
          <h3 className="font-medium text-gray-900">AI Personas</h3>
          <span className="text-sm text-gray-500">
            ({selectedPersonas.length}/{maxPersonas} selected)
          </span>
        </div>
        {DEFAULT_PERSONAS.length > 6 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : 'Show All'}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayedPersonas.map(persona => {
          const isSelected = selectedPersonas.some(p => p.id === persona.id);
          const canSelect = selectedPersonas.length < maxPersonas || isSelected;
          
          return (
            <motion.div
              key={persona.id}
              whileHover={{ scale: canSelect ? 1.02 : 1 }}
              whileTap={{ scale: canSelect ? 0.98 : 1 }}
            >
              <Card
                className={`
                  cursor-pointer transition-all duration-200 border-2
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : canSelect 
                      ? 'border-gray-200 hover:border-gray-300' 
                      : 'border-gray-100 opacity-50 cursor-not-allowed'
                  }
                `}
                onClick={() => canSelect && handlePersonaToggle(persona)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{persona.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">
                          {persona.name}
                        </h4>
                        {isSelected && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>
                      <p className="text-sm text-blue-600 font-medium mb-1">
                        {persona.role}
                      </p>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {persona.personality}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {selectedPersonas.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <h4 className="font-medium text-blue-900 mb-2">Selected Personas</h4>
          <div className="space-y-2">
            {selectedPersonas.map(persona => (
              <div key={persona.id} className="flex items-center space-x-2 text-sm">
                <span>{persona.avatar}</span>
                <span className="font-medium text-blue-800">{persona.name}</span>
                <span className="text-blue-600">as {persona.role}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}