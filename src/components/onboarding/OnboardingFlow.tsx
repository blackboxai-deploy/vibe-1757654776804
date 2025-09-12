'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LIFE_AREAS, HABIT_SUGGESTIONS } from '@/lib/constants';
import { LifeArea } from '@/lib/types';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { initializeUser, addHabit } = useGame();
  const [currentStep, setCurrentStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [selectedLifeAreas, setSelectedLifeAreas] = useState<LifeArea[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);

  const steps = [
    'welcome',
    'profile',
    'life-areas',
    'first-habits',
    'tutorial',
    'complete'
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    // Initialize user
    initializeUser(userName);

    // Add selected habits
    selectedHabits.forEach(habitName => {
      const lifeArea = selectedLifeAreas[0] || 'personal-development';
      addHabit({
        name: habitName,
        type: 'good',
        category: lifeArea,
        frequency: 'daily',
        expValue: 10,
        isActive: true,
      });
    });

    // Mark onboarding as completed
    localStorage.setItem('levelup_onboarding_completed', 'true');
    onComplete();
  };

  const renderStep = () => {
    switch (steps[currentStep]) {
      case 'welcome':
        return (
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-6xl">🎮</span>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Welcome to LevelUp Life!
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Transform your personal development journey into an epic RPG adventure. 
                Track habits, complete quests, earn EXP, and level up your life with AI-powered insights.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-3xl mb-2">📈</div>
                <p className="text-sm text-gray-400">Track Progress</p>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-3xl mb-2">⚔️</div>
                <p className="text-sm text-gray-400">Epic Quests</p>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-3xl mb-2">🏆</div>
                <p className="text-sm text-gray-400">Earn Rewards</p>
              </div>
              <div className="text-center p-4 bg-gray-800 rounded-lg">
                <div className="text-3xl mb-2">🤖</div>
                <p className="text-sm text-gray-400">AI Insights</p>
              </div>
            </div>

            <Button onClick={handleNext} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 text-lg">
              Start Your Journey 🚀
            </Button>
          </div>
        );

      case 'profile':
        return (
          <div className="max-w-md">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-white">
                  Create Your Character
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-3xl">👤</span>
                  </div>
                  <p className="text-gray-400">What should we call you, hero?</p>
                </div>
                
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mb-6 bg-gray-700 border-gray-600 text-white text-center text-lg"
                  maxLength={30}
                />
                
                <Button 
                  onClick={handleNext} 
                  disabled={!userName.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'life-areas':
        return (
          <div className="max-w-4xl">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-white">
                  Choose Your Focus Areas
                </CardTitle>
                <p className="text-center text-gray-400">
                  Select the areas of life you want to improve (choose 1-3)
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {Object.entries(LIFE_AREAS).map(([key, areaData]) => {
                    const area = areaData as typeof LIFE_AREAS[keyof typeof LIFE_AREAS];
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          const lifeArea = key as LifeArea;
                          if (selectedLifeAreas.includes(lifeArea)) {
                            setSelectedLifeAreas(selectedLifeAreas.filter(a => a !== lifeArea));
                          } else if (selectedLifeAreas.length < 3) {
                            setSelectedLifeAreas([...selectedLifeAreas, lifeArea]);
                          }
                        }}
                        className={`p-4 rounded-lg text-center transition-all ${
                          selectedLifeAreas.includes(key as LifeArea)
                            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">{area.icon}</div>
                        <div className="font-semibold text-sm">{area.name}</div>
                      </button>
                    );
                  })}
                </div>
                
                <Button 
                  onClick={handleNext} 
                  disabled={selectedLifeAreas.length === 0}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Continue ({selectedLifeAreas.length}/3 selected)
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'first-habits':
        const availableHabits = selectedLifeAreas.flatMap(area => {
          const suggestions = HABIT_SUGGESTIONS[area as keyof typeof HABIT_SUGGESTIONS];
          return suggestions || [];
        }).slice(0, 10);

        return (
          <div className="max-w-4xl">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-white">
                  Choose Your Starting Habits
                </CardTitle>
                <p className="text-center text-gray-400">
                  Pick 2-5 habits to start your journey (you can add more later)
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  {availableHabits.map((habit, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (selectedHabits.includes(habit)) {
                          setSelectedHabits(selectedHabits.filter(h => h !== habit));
                        } else if (selectedHabits.length < 5) {
                          setSelectedHabits([...selectedHabits, habit]);
                        }
                      }}
                      className={`p-4 rounded-lg text-left transition-all ${
                        selectedHabits.includes(habit)
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="font-medium">{habit}</div>
                          <div className="text-sm text-gray-400">+10 EXP daily</div>
                        </div>
                        {selectedHabits.includes(habit) && (
                          <Badge className="bg-yellow-500 text-black">Selected</Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                <Button 
                  onClick={handleNext} 
                  disabled={selectedHabits.length < 2}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Continue ({selectedHabits.length}/5 selected)
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'tutorial':
        return (
          <div className="max-w-3xl">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-white">
                  How LevelUp Life Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">✅</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Complete Daily Habits</h3>
                      <p className="text-gray-400">Mark your habits as complete to earn EXP and build streaks</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">📊</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Level Up & Earn Badges</h3>
                      <p className="text-gray-400">Gain EXP to increase your level and unlock achievement badges</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">⚔️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Complete Epic Quests</h3>
                      <p className="text-gray-400">Set long-term goals and break them into achievable milestones</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🎁</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-lg">Redeem Rewards</h3>
                      <p className="text-gray-400">Spend your EXP on rewards you set for yourself</p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleNext}
                  className="w-full mt-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Got it! Let&apos;s Start 🎮
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center max-w-2xl">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-6xl">🎉</span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Welcome aboard, {userName}!
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Your adventure begins now. You&apos;ve already earned your first achievement badge!
              </p>
              
              <div className="bg-gray-800 rounded-lg p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-3xl mr-3">🌱</span>
                  <div>
                    <h3 className="font-semibold text-white">First Steps Badge</h3>
                    <p className="text-gray-400 text-sm">Completed onboarding and ready to level up!</p>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleComplete}
              size="lg"
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
            >
              Enter LevelUp Life 🚀
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full flex flex-col items-center">
        {/* Progress Bar */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="w-full max-w-md mb-8">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span>Step {currentStep} of {steps.length - 1}</span>
              <span>{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {renderStep()}
      </div>
    </div>
  );
};