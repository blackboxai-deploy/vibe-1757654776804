'use client';

import { useState, useEffect } from 'react';

export const LoadingScreen = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="text-center">
        {/* Animated Logo/Icon */}
        <div className="mb-8">
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-4xl">🎮</span>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-sm">⭐</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          LevelUp Life
        </h1>
        
        {/* Subtitle */}
        <p className="text-gray-400 text-lg mb-8">
          Preparing your adventure{dots}
        </p>

        {/* Progress Bar */}
        <div className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse"></div>
        </div>

        {/* Motivational Text */}
        <p className="text-sm text-gray-500 mt-4 max-w-md mx-auto">
          "Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown."
        </p>
      </div>
    </div>
  );
};