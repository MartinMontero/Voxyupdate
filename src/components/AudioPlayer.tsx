import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Download, FileText, Share2, SkipBack, SkipForward } from 'lucide-react';
import { AudioGeneration } from '../types';
import { formatDuration } from '../lib/utils';
import { Button } from './ui/Button';
import { Card, CardContent, CardHeader } from './ui/Card';

interface AudioPlayerProps {
  generation: AudioGeneration;
}

export function AudioPlayer({ generation }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(generation.duration || 0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">Generated Podcast</h3>
            <p className="text-sm text-gray-600">
              {generation.settings.personas.map(p => p.name).join(' & ')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Audio Element */}
        <audio
          ref={audioRef}
          src={generation.audioUrl}
          preload="metadata"
        />

        {/* Waveform Visualization */}
        <div className="mb-6">
          <div className="h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
            <div className="flex items-end space-x-1 h-12">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className={`w-1 rounded-full ${
                    i < (progress / 100) * 50 ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  style={{ 
                    height: `${Math.random() * 100}%`,
                    minHeight: '4px'
                  }}
                  animate={{
                    scaleY: isPlaying && i < (progress / 100) * 50 ? [1, 1.2, 1] : 1
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isPlaying ? Infinity : 0,
                    delay: i * 0.05
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress Bar */}
          <div 
            className="h-2 bg-gray-200 rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => skip(-10)}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayPause}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5 ml-0.5" />
              )}
            </motion.button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => skip(10)}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            {formatDuration(Math.floor(currentTime))} / {formatDuration(Math.floor(duration))}
          </div>
        </div>

        {/* Transcript Preview */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl">
          <h4 className="font-medium text-gray-900 mb-2">Transcript Preview</h4>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex space-x-2">
              <span className="font-medium text-blue-600">
                {generation.settings.personas[0]?.name}:
              </span>
              <span>
                Welcome to today's discussion! We're diving deep into the fascinating topics 
                covered in your uploaded documents.
              </span>
            </div>
            <div className="flex space-x-2">
              <span className="font-medium text-purple-600">
                {generation.settings.personas[1]?.name}:
              </span>
              <span>
                Absolutely! I'm particularly excited to explore the key insights and 
                implications we've discovered in this research.
              </span>
            </div>
            <div className="text-center text-gray-500 text-xs mt-3">
              <Button variant="ghost" size="sm">
                View Full Transcript
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}