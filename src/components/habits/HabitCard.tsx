'use client';

import { useState } from 'react';
import { Habit } from '@/lib/types';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LIFE_AREAS } from '@/lib/constants';
// import { toast } from 'sonner';

interface HabitCardProps {
  habit: Habit;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { completeHabit } = useGame();
  const [isCompleting, setIsCompleting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDates.includes(today);
  
  const lifeArea = LIFE_AREAS[habit.category];
  
  const handleComplete = async () => {
    if (isCompletedToday || isCompleting) return;
    
    setIsCompleting(true);
    try {
      const result = await completeHabit(habit.id);
      
      if (result.expGained > 0) {
        // Show success feedback (will implement toast later)
        console.log(`🎉 +${result.expGained} EXP earned!`);
        
        if (result.leveledUp) {
          console.log(`🎊 Level Up! You reached a new level!`);
        }
      }
    } catch (error) {
      console.error('Failed to complete habit. Please try again.');
    } finally {
      setIsCompleting(false);
    }
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 30) return '🔥🔥🔥';
    if (streak >= 14) return '🔥🔥';
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '💪';
  };

  const getHabitTypeColor = (type: 'good' | 'bad') => {
    return type === 'good' ? 'text-green-400' : 'text-red-400';
  };

  return (
    <Card className={`
      border transition-all duration-200 
      ${isCompletedToday 
        ? 'bg-green-900/30 border-green-500/50' 
        : 'bg-gray-700 border-gray-600 hover:border-gray-500'
      }
      ${habit.type === 'bad' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-green-500'}
    `}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Habit Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className={`font-semibold text-white ${isCompletedToday ? 'line-through' : ''}`}>
                {habit.name}
              </h3>
              <Badge 
                variant="outline" 
                className="text-xs px-2 py-0.5"
                style={{ 
                  backgroundColor: lifeArea.color.replace('bg-', 'rgba(') + ', 0.1)',
                  borderColor: lifeArea.color.replace('bg-', 'rgba(') + ', 0.3)',
                }}
              >
                {lifeArea.icon} {lifeArea.name}
              </Badge>
            </div>
            
            {habit.description && (
              <p className="text-sm text-gray-400 mb-2">{habit.description}</p>
            )}

            <div className="flex items-center space-x-4 text-sm">
              {/* EXP Value */}
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">⭐</span>
                <span className="text-gray-300">+{habit.expValue} EXP</span>
              </div>
              
              {/* Frequency */}
              <div className="flex items-center space-x-1">
                <span className="text-blue-400">📅</span>
                <span className="text-gray-300 capitalize">{habit.frequency}</span>
              </div>
              
              {/* Current Streak */}
              {habit.streak > 0 && (
                <div className="flex items-center space-x-1">
                  <span>{getStreakEmoji(habit.streak)}</span>
                  <span className="text-gray-300">{habit.streak} days</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="ml-4">
            {isCompletedToday ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-1">
                  <span className="text-xl">✅</span>
                </div>
                <span className="text-xs text-green-400 font-medium">Completed</span>
              </div>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={isCompleting}
                className={`
                  w-12 h-12 rounded-full p-0
                  ${habit.type === 'good' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                  }
                  ${isCompleting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isCompleting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : habit.type === 'good' ? (
                  '✓'
                ) : (
                  '✗'
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Progress Indicators */}
        {(habit.longestStreak > 0 || habit.completedDates.length > 0) && (
          <div className="mt-3 pt-3 border-t border-gray-600">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div>
                Total completions: <span className="text-white font-medium">{habit.completedDates.length}</span>
              </div>
              <div>
                Best streak: <span className="text-white font-medium">{habit.longestStreak} days</span>
              </div>
            </div>
          </div>
        )}

        {/* Habit Type Indicator */}
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-bold ${getHabitTypeColor(habit.type)}`}>
            {habit.type.toUpperCase()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};