'use client';

import { useEffect, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

export default function HomePage() {
  const { state } = useGame();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user exists and onboarding is completed
    if (!state.isLoading && !state.user) {
      setShowOnboarding(true);
    }
  }, [state.isLoading, state.user]);

  if (state.isLoading) {
    return <LoadingScreen />;
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-400 mb-4">{state.error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }

  return <Dashboard />;
}