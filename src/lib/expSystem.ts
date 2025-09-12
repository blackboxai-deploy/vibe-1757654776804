import { UserProfile, Badge, Habit } from './types';
import { EXP_CONSTANTS, ACHIEVEMENT_BADGES } from './constants';
import { userStorage } from './storage';

// Calculate EXP with streak bonus
export const calculateExpWithStreak = (baseExp: number, streakDays: number): number => {
  const streakBonus = Math.min(
    streakDays * EXP_CONSTANTS.STREAK_BONUS_MULTIPLIER,
    EXP_CONSTANTS.MAX_STREAK_BONUS
  );
  return Math.floor(baseExp * (1 + streakBonus));
};

// Check if user leveled up
export const checkLevelUp = (oldExp: number, newExp: number): { leveledUp: boolean; newLevel: number; oldLevel: number } => {
  const oldLevelData = calculateLevelFromExp(oldExp);
  const newLevelData = calculateLevelFromExp(newExp);
  
  return {
    leveledUp: newLevelData.level > oldLevelData.level,
    newLevel: newLevelData.level,
    oldLevel: oldLevelData.level,
  };
};

// Calculate level from total EXP
export const calculateLevelFromExp = (totalExp: number): { level: number; currentExp: number; expToNextLevel: number } => {
  let level = 1;
  let expUsed = 0;
  
  while (level < EXP_CONSTANTS.MAX_LEVEL) {
    const expForNextLevel = Math.floor(
      EXP_CONSTANTS.BASE_EXP_TO_NEXT_LEVEL * Math.pow(EXP_CONSTANTS.LEVEL_MULTIPLIER, level - 1)
    );
    if (totalExp < expUsed + expForNextLevel) {
      break;
    }
    expUsed += expForNextLevel;
    level++;
  }
  
  const currentExp = totalExp - expUsed;
  const expToNextLevel = Math.floor(
    EXP_CONSTANTS.BASE_EXP_TO_NEXT_LEVEL * Math.pow(EXP_CONSTANTS.LEVEL_MULTIPLIER, level - 1)
  );
  
  return { level, currentExp, expToNextLevel };
};

// Check and unlock achievements
export const checkAchievements = (user: UserProfile, habits: Habit[], completedQuestsCount: number): Badge[] => {
  const newBadges: Badge[] = [];
  const unlockedBadgeIds = user.badges.map(b => b.id);
  
  // First habit completion
  if (!unlockedBadgeIds.includes('first-habit') && habits.some(h => h.completedDates.length > 0)) {
    newBadges.push({
      ...ACHIEVEMENT_BADGES.find(b => b.id === 'first-habit')!,
      unlockedDate: new Date().toISOString(),
    });
  }
  
  // Streak achievements
  if (!unlockedBadgeIds.includes('week-streak') && user.streakDays >= 7) {
    newBadges.push({
      ...ACHIEVEMENT_BADGES.find(b => b.id === 'week-streak')!,
      unlockedDate: new Date().toISOString(),
    });
  }
  
  if (!unlockedBadgeIds.includes('month-streak') && user.streakDays >= 30) {
    newBadges.push({
      ...ACHIEVEMENT_BADGES.find(b => b.id === 'month-streak')!,
      unlockedDate: new Date().toISOString(),
    });
  }
  
  // Habit completion count
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
  if (!unlockedBadgeIds.includes('hundred-habits') && totalCompletions >= 100) {
    newBadges.push({
      ...ACHIEVEMENT_BADGES.find(b => b.id === 'hundred-habits')!,
      unlockedDate: new Date().toISOString(),
    });
  }
  
  // Quest completion
  if (!unlockedBadgeIds.includes('first-quest') && completedQuestsCount >= 1) {
    newBadges.push({
      ...ACHIEVEMENT_BADGES.find(b => b.id === 'first-quest')!,
      unlockedDate: new Date().toISOString(),
    });
  }
  
  // Level achievements
  if (!unlockedBadgeIds.includes('level-10') && user.level >= 10) {
    newBadges.push({
      ...ACHIEVEMENT_BADGES.find(b => b.id === 'level-10')!,
      unlockedDate: new Date().toISOString(),
    });
  }
  
  if (!unlockedBadgeIds.includes('level-50') && user.level >= 50) {
    newBadges.push({
      ...ACHIEVEMENT_BADGES.find(b => b.id === 'level-50')!,
      unlockedDate: new Date().toISOString(),
    });
  }
  
  return newBadges;
};

// Calculate current streak days
export const calculateCurrentStreak = (habits: Habit[]): number => {
  if (habits.length === 0) return 0;
  
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Check if any habit was completed today or yesterday
  let streakDays = 0;
  let checkDate = today;
  
  while (true) {
    const hasCompletionOnDate = habits.some(habit => 
      habit.isActive && habit.completedDates.includes(checkDate)
    );
    
    if (!hasCompletionOnDate) {
      // Allow one day grace period (check yesterday)
      if (checkDate === today) {
        checkDate = yesterday;
        continue;
      }
      break;
    }
    
    streakDays++;
    const prevDate = new Date(checkDate);
    prevDate.setDate(prevDate.getDate() - 1);
    checkDate = prevDate.toISOString().split('T')[0];
    
    // Limit to reasonable streak calculation (avoid infinite loops)
    if (streakDays > 365) break;
  }
  
  return streakDays;
};

// Award EXP and handle level up
export const awardExp = (expAmount: number): { 
  leveledUp: boolean; 
  newLevel?: number; 
  oldLevel?: number;
  newBadges: Badge[];
} => {
  const user = userStorage.get();
  if (!user) return { leveledUp: false, newBadges: [] };
  
  const oldExp = user.totalExp;
  const newExp = oldExp + expAmount;
  
  const levelUpInfo = checkLevelUp(oldExp, newExp);
  const updatedUser = userStorage.update({ totalExp: newExp });
  
  if (!updatedUser) return { leveledUp: false, newBadges: [] };
  
  // Check for new achievements
  const habits = JSON.parse(localStorage.getItem('levelup_habits') || '[]');
  const quests = JSON.parse(localStorage.getItem('levelup_quests') || '[]');
  const completedQuestsCount = quests.filter((q: any) => q.isCompleted).length;
  
  const newBadges = checkAchievements(updatedUser, habits, completedQuestsCount);
  
  // Update user with new badges
  if (newBadges.length > 0) {
    userStorage.update({ 
      badges: [...updatedUser.badges, ...newBadges] 
    });
  }
  
  return {
    leveledUp: levelUpInfo.leveledUp,
    newLevel: levelUpInfo.newLevel,
    oldLevel: levelUpInfo.oldLevel,
    newBadges,
  };
};

// Get level progress percentage
export const getLevelProgressPercentage = (currentExp: number, expToNextLevel: number): number => {
  if (expToNextLevel <= 0) return 100;
  return Math.round((currentExp / expToNextLevel) * 100);
};

// Calculate total EXP needed to reach a specific level
export const calculateTotalExpForLevel = (targetLevel: number): number => {
  let totalExp = 0;
  
  for (let level = 1; level < targetLevel; level++) {
    totalExp += Math.floor(
      EXP_CONSTANTS.BASE_EXP_TO_NEXT_LEVEL * Math.pow(EXP_CONSTANTS.LEVEL_MULTIPLIER, level - 1)
    );
  }
  
  return totalExp;
};

// Get user's rank based on level (for motivation)
export const getUserRank = (level: number): { rank: string; emoji: string; description: string } => {
  if (level >= 80) return { rank: 'Grandmaster', emoji: '👑', description: 'Legend of Self-Improvement' };
  if (level >= 60) return { rank: 'Master', emoji: '🏆', description: 'Master of Life Balance' };
  if (level >= 40) return { rank: 'Expert', emoji: '⭐', description: 'Expert Life Optimizer' };
  if (level >= 25) return { rank: 'Advanced', emoji: '🌟', description: 'Advanced Self-Developer' };
  if (level >= 15) return { rank: 'Skilled', emoji: '💪', description: 'Skilled Habit Builder' };
  if (level >= 8) return { rank: 'Intermediate', emoji: '📈', description: 'Growing Stronger' };
  if (level >= 3) return { rank: 'Beginner', emoji: '🌱', description: 'Building Momentum' };
  return { rank: 'Novice', emoji: '✨', description: 'Starting the Journey' };
};