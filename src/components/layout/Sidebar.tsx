'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getUserRank } from '@/lib/expSystem';

interface SidebarProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { state } = useGame();
  const [activeSection, setActiveSection] = useState('dashboard');

  if (!state.user) return null;

  const userRank = getUserRank(state.user.level);

  const navigationItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠', description: 'Overview & Stats' },
    { id: 'habits', name: 'Habits', icon: '✅', description: 'Daily Routines' },
    { id: 'quests', name: 'Epic Quests', icon: '⚔️', description: 'Long-term Goals' },
    { id: 'journal', name: 'Journal', icon: '📖', description: 'Reflection & Notes' },
    { id: 'rewards', name: 'Rewards', icon: '🎁', description: 'Redeem EXP' },
    { id: 'analytics', name: 'Analytics', icon: '📊', description: 'Progress Charts' },
    { id: 'finance', name: 'Finance', icon: '💰', description: 'Money Tracking' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => onToggle(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-50 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-80 h-full bg-gray-800 border-r border-gray-700 flex flex-col
      `}>
        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-2xl">{userRank.emoji}</span>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">{state.user.name}</h2>
              <p className="text-sm text-gray-400">{userRank.rank}</p>
              <p className="text-xs text-gray-500">{userRank.description}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-white">{state.user.level}</div>
                <div className="text-xs text-gray-400">Level</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-white">{state.user.totalExp}</div>
                <div className="text-xs text-gray-400">Total EXP</div>
              </CardContent>
            </Card>
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-3 text-center">
                <div className="text-lg font-bold text-white">{state.user.streakDays}</div>
                <div className="text-xs text-gray-400">Streak</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`
                  w-full justify-start h-auto p-4 text-left
                  ${activeSection === item.id 
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }
                `}
                onClick={() => setActiveSection(item.id)}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </nav>

        {/* Recent Achievements */}
        <div className="p-4 border-t border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-3">Recent Achievements</h3>
          {state.user.badges.length > 0 ? (
            <div className="space-y-2">
              {state.user.badges.slice(-3).map((badge) => (
                <div key={badge.id} className="flex items-center space-x-2 p-2 bg-gray-700 rounded-lg">
                  <span className="text-lg">{badge.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white truncate">{badge.name}</div>
                    <div className="text-xs text-gray-400 truncate">{badge.description}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-xs text-gray-400">Complete habits to unlock achievements!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">LevelUp Life v1.0</div>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white p-2">
              ⚙️
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};