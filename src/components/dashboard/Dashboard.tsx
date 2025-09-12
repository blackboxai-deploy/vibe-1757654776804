'use client';

import { useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { HabitCard } from '@/components/habits/HabitCard';
import { QuestCard } from '@/components/quests/QuestCard';
import { getUserRank } from '@/lib/expSystem';
import { LIFE_AREAS } from '@/lib/constants';

export const Dashboard = () => {
  const { state } = useGame();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!state.user) {
    return <div>Loading...</div>;
  }

  const userRank = getUserRank(state.user.level);
  const levelProgress = state.user.expToNextLevel > 0 
    ? Math.round((state.user.currentExp / state.user.expToNextLevel) * 100)
    : 100;

  const activeHabits = state.habits.filter(h => h.isActive).slice(0, 6);
  const activeQuests = state.quests.filter(q => !q.isCompleted).slice(0, 3);

  const todayCompletedHabits = state.habits.filter(habit => {
    const today = new Date().toISOString().split('T')[0];
    return habit.completedDates.includes(today);
  }).length;

  const totalActiveHabits = state.habits.filter(h => h.isActive).length;

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-400 hover:text-white md:hidden"
              >
                ☰
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Welcome back, {state.user.name}! 👋
                </h1>
                <p className="text-gray-400">Ready to level up your day?</p>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-sm text-gray-400">Level {state.user.level}</div>
                <div className="text-lg font-semibold text-white flex items-center">
                  {userRank.emoji} {userRank.rank}
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">{userRank.emoji}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {/* Level Progress */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">Level Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-2">
                  {state.user.currentExp}/{state.user.expToNextLevel} EXP
                </div>
                <Progress value={levelProgress} className="mb-2" />
                <p className="text-xs text-gray-400">{levelProgress}% to Level {state.user.level + 1}</p>
              </CardContent>
            </Card>

            {/* Today's Progress */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">Today&apos;s Habits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-2">
                  {todayCompletedHabits}/{totalActiveHabits}
                </div>
                <Progress 
                  value={totalActiveHabits > 0 ? (todayCompletedHabits / totalActiveHabits) * 100 : 0} 
                  className="mb-2"
                />
                <p className="text-xs text-gray-400">
                  {Math.round(totalActiveHabits > 0 ? (todayCompletedHabits / totalActiveHabits) * 100 : 0)}% completed
                </p>
              </CardContent>
            </Card>

            {/* Current Streak */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-2 flex items-center">
                  🔥 {state.user.streakDays}
                  <span className="text-sm font-normal text-gray-400 ml-1">days</span>
                </div>
                <p className="text-xs text-gray-400">
                  {state.user.streakDays > 0 ? "Keep it going!" : "Start your streak today!"}
                </p>
              </CardContent>
            </Card>

            {/* Total Badges */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-400">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white mb-2 flex items-center">
                  🏆 {state.user.badges.length}
                  <span className="text-sm font-normal text-gray-400 ml-1">badges</span>
                </div>
                <p className="text-xs text-gray-400">
                  {state.user.badges.length > 0 ? "Well earned!" : "Complete habits to earn badges"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Habits */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Today&apos;s Habits ✨
                    <Button variant="outline" size="sm" className="text-xs">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeHabits.length > 0 ? (
                    <div className="space-y-3">
                      {activeHabits.map(habit => (
                        <HabitCard key={habit.id} habit={habit} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">📝</div>
                      <h3 className="text-lg font-semibold text-white mb-2">No habits yet</h3>
                      <p className="text-gray-400 mb-4">Create your first habit to start earning EXP!</p>
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Create First Habit
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Active Quests */}
            <div>
              <Card className="bg-gray-800 border-gray-700 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    Epic Quests ⚔️
                    <Button variant="outline" size="sm" className="text-xs">
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activeQuests.length > 0 ? (
                    <div className="space-y-4">
                      {activeQuests.map(quest => (
                        <QuestCard key={quest.id} quest={quest} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="text-4xl mb-3">⚔️</div>
                      <h4 className="font-semibold text-white mb-1">No active quests</h4>
                      <p className="text-sm text-gray-400 mb-3">Create epic goals to conquer!</p>
                      <Button size="sm" variant="outline">
                        Create Quest
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Life Areas Quick View */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Life Balance 🎯</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(LIFE_AREAS).slice(0, 5).map(([key, areaData]) => {
                      const area = areaData as typeof LIFE_AREAS[keyof typeof LIFE_AREAS];
                      const areaHabits = state.habits.filter(h => h.category === key && h.isActive);
                      return (
                        <div key={key} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{area.icon}</span>
                            <span className="text-sm text-gray-300">{area.name}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {areaHabits.length} habits
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4 text-xs">
                    View All Areas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Daily Motivation */}
          <Card className="bg-gradient-to-r from-purple-800 to-blue-800 border-gray-700 mt-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Daily Motivation 💪
                  </h3>
                  <p className="text-gray-200">
                    &quot;Success is the sum of small efforts, repeated day in and day out.&quot;
                  </p>
                  <p className="text-sm text-gray-300 mt-1">- Robert Collier</p>
                </div>
                <div className="text-6xl">🌟</div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};