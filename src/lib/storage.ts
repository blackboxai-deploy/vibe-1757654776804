import { 
  UserProfile, 
  Habit, 
  EpicQuest, 
  JournalEntry, 
  GameSettings,
  GameState 
} from './types';
import { STORAGE_KEYS, EXP_CONSTANTS } from './constants';

// Utility function to safely parse JSON
const safeJSONParse = <T>(item: string | null, fallback: T): T => {
  if (!item) return fallback;
  try {
    return JSON.parse(item);
  } catch {
    return fallback;
  }
};

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Calculate EXP required for next level
export const calculateExpToNextLevel = (level: number): number => {
  return Math.floor(EXP_CONSTANTS.BASE_EXP_TO_NEXT_LEVEL * Math.pow(EXP_CONSTANTS.LEVEL_MULTIPLIER, level - 1));
};

// Calculate level from total EXP
export const calculateLevelFromExp = (totalExp: number): { level: number; currentExp: number; expToNextLevel: number } => {
  let level = 1;
  let expUsed = 0;
  
  while (level < EXP_CONSTANTS.MAX_LEVEL) {
    const expForNextLevel = calculateExpToNextLevel(level);
    if (totalExp < expUsed + expForNextLevel) {
      break;
    }
    expUsed += expForNextLevel;
    level++;
  }
  
  const currentExp = totalExp - expUsed;
  const expToNextLevel = calculateExpToNextLevel(level);
  
  return { level, currentExp, expToNextLevel };
};

// User Profile Storage
export const userStorage = {
  get: (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return safeJSONParse(data, null);
  },

  set: (profile: UserProfile): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  },

  create: (name: string): UserProfile => {
    const newProfile: UserProfile = {
      id: generateId(),
      name,
      level: 1,
      totalExp: 0,
      currentExp: 0,
      expToNextLevel: calculateExpToNextLevel(1),
      joinedDate: new Date().toISOString(),
      streakDays: 0,
      badges: [],
    };
    
    userStorage.set(newProfile);
    return newProfile;
  },

  update: (updates: Partial<UserProfile>): UserProfile | null => {
    const current = userStorage.get();
    if (!current) return null;
    
    const updated = { ...current, ...updates };
    
    // Recalculate level if totalExp changed
    if (updates.totalExp !== undefined) {
      const levelData = calculateLevelFromExp(updates.totalExp);
      updated.level = levelData.level;
      updated.currentExp = levelData.currentExp;
      updated.expToNextLevel = levelData.expToNextLevel;
    }
    
    userStorage.set(updated);
    return updated;
  },

  addExp: (exp: number): UserProfile | null => {
    const current = userStorage.get();
    if (!current) return null;
    
    const newTotalExp = current.totalExp + exp;
    return userStorage.update({ totalExp: newTotalExp });
  },
};

// Habits Storage
export const habitsStorage = {
  getAll: (): Habit[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    return safeJSONParse(data, []);
  },

  set: (habits: Habit[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  },

  add: (habit: Omit<Habit, 'id' | 'createdDate' | 'completedDates' | 'streak' | 'longestStreak'>): Habit => {
    const habits = habitsStorage.getAll();
    const newHabit: Habit = {
      ...habit,
      id: generateId(),
      createdDate: new Date().toISOString(),
      completedDates: [],
      streak: 0,
      longestStreak: 0,
    };
    
    habits.push(newHabit);
    habitsStorage.set(habits);
    return newHabit;
  },

  update: (id: string, updates: Partial<Habit>): Habit | null => {
    const habits = habitsStorage.getAll();
    const index = habits.findIndex(h => h.id === id);
    
    if (index === -1) return null;
    
    habits[index] = { ...habits[index], ...updates };
    habitsStorage.set(habits);
    return habits[index];
  },

  delete: (id: string): boolean => {
    const habits = habitsStorage.getAll();
    const filtered = habits.filter(h => h.id !== id);
    
    if (filtered.length === habits.length) return false;
    
    habitsStorage.set(filtered);
    return true;
  },

  markComplete: (id: string, date: string = new Date().toISOString().split('T')[0]): { habit: Habit | null; expGained: number } => {
    const habits = habitsStorage.getAll();
    const habit = habits.find(h => h.id === id);
    
    if (!habit) return { habit: null, expGained: 0 };
    
    // Check if already completed today
    if (habit.completedDates.includes(date)) {
      return { habit, expGained: 0 };
    }
    
    // Add completion date
    habit.completedDates.push(date);
    habit.completedDates.sort();
    
    // Calculate streak
    const today = new Date(date);
    let streak = 1;
    
    for (let i = 1; i < habit.completedDates.length; i++) {
      const currentDate = new Date(habit.completedDates[habit.completedDates.length - 1 - i]);
      const prevDate = new Date(habit.completedDates[habit.completedDates.length - i]);
      
      const dayDiff = Math.floor((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    habit.streak = streak;
    habit.longestStreak = Math.max(habit.longestStreak, streak);
    
    // Calculate EXP with streak bonus
    const baseExp = habit.expValue;
    const streakBonus = Math.min(
      streak * EXP_CONSTANTS.STREAK_BONUS_MULTIPLIER,
      EXP_CONSTANTS.MAX_STREAK_BONUS
    );
    const expGained = Math.floor(baseExp * (1 + streakBonus));
    
    habitsStorage.set(habits);
    
    // Update user EXP
    if (habit.type === 'good') {
      userStorage.addExp(expGained);
    }
    
    return { habit, expGained };
  },
};

// Quests Storage
export const questsStorage = {
  getAll: (): EpicQuest[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.QUESTS);
    return safeJSONParse(data, []);
  },

  set: (quests: EpicQuest[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.QUESTS, JSON.stringify(quests));
  },

  add: (quest: Omit<EpicQuest, 'id' | 'createdDate' | 'completedMilestones' | 'isCompleted'>): EpicQuest => {
    const quests = questsStorage.getAll();
    const newQuest: EpicQuest = {
      ...quest,
      id: generateId(),
      createdDate: new Date().toISOString(),
      completedMilestones: 0,
      isCompleted: false,
      milestones: quest.milestones.map((m, index) => ({
        ...m,
        id: generateId(),
        order: index,
        isCompleted: false,
      })),
    };
    
    quests.push(newQuest);
    questsStorage.set(quests);
    return newQuest;
  },

  completeMilestone: (questId: string, milestoneId: string): { quest: EpicQuest | null; expGained: number } => {
    const quests = questsStorage.getAll();
    const quest = quests.find(q => q.id === questId);
    
    if (!quest) return { quest: null, expGained: 0 };
    
    const milestone = quest.milestones.find(m => m.id === milestoneId);
    if (!milestone || milestone.isCompleted) return { quest, expGained: 0 };
    
    // Mark milestone as completed
    milestone.isCompleted = true;
    milestone.completedDate = new Date().toISOString();
    quest.completedMilestones++;
    
    let expGained = milestone.expReward;
    
    // Check if quest is completed
    if (quest.completedMilestones >= quest.totalMilestones) {
      quest.isCompleted = true;
      quest.completedDate = new Date().toISOString();
      expGained += quest.expReward;
    }
    
    questsStorage.set(quests);
    userStorage.addExp(expGained);
    
    return { quest, expGained };
  },
};

// Journal Storage
export const journalStorage = {
  getAll: (): JournalEntry[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    return safeJSONParse(data, []);
  },

  set: (entries: JournalEntry[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
  },

  add: (entry: Omit<JournalEntry, 'id'>): JournalEntry => {
    const entries = journalStorage.getAll();
    const newEntry: JournalEntry = {
      ...entry,
      id: generateId(),
    };
    
    entries.push(newEntry);
    entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    journalStorage.set(entries);
    return newEntry;
  },
};

// Settings Storage
export const settingsStorage = {
  get: (): GameSettings => {
    if (typeof window === 'undefined') {
      return {
        notifications: {
          habitReminders: true,
          streakWarnings: true,
          levelUp: true,
          dailyReflection: true,
        },
        theme: 'dark',
        language: 'id',
        privacy: {
          aiAnalysis: true,
          dataSharing: false,
        },
      };
    }
    
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return safeJSONParse(data, {
      notifications: {
        habitReminders: true,
        streakWarnings: true,
        levelUp: true,
        dailyReflection: true,
      },
      theme: 'dark',
      language: 'id',
      privacy: {
        aiAnalysis: true,
        dataSharing: false,
      },
    });
  },

  set: (settings: GameSettings): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },
};

// Data Export Functions
export const exportData = {
  getAllData: (): GameState => {
    return {
      user: userStorage.get()!,
      habits: habitsStorage.getAll(),
      quests: questsStorage.getAll(),
      rewards: [],
      journalEntries: journalStorage.getAll(),
      financeEntries: [],
      notifications: [],
      settings: settingsStorage.get(),
    };
  },

  exportToJSON: (): string => {
    const data = exportData.getAllData();
    return JSON.stringify(data, null, 2);
  },

  importFromJSON: (jsonData: string): boolean => {
    try {
      const data: GameState = JSON.parse(jsonData);
      
      if (data.user) userStorage.set(data.user);
      if (data.habits) habitsStorage.set(data.habits);
      if (data.quests) questsStorage.set(data.quests);
      if (data.journalEntries) journalStorage.set(data.journalEntries);
      if (data.settings) settingsStorage.set(data.settings);
      
      return true;
    } catch {
      return false;
    }
  },
};

// Data cleanup and maintenance
export const dataMaintenance = {
  cleanOldData: (): void => {
    // Remove journal entries older than 1 year
    const entries = journalStorage.getAll();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const filteredEntries = entries.filter(entry => 
      new Date(entry.date) > oneYearAgo
    );
    
    if (filteredEntries.length !== entries.length) {
      journalStorage.set(filteredEntries);
    }
  },

  calculateStorageUsage: (): { totalSize: number; breakdown: Record<string, number> } => {
    if (typeof window === 'undefined') return { totalSize: 0, breakdown: {} };
    
    const breakdown: Record<string, number> = {};
    let totalSize = 0;
    
    Object.values(STORAGE_KEYS).forEach((key: string) => {
      const item = localStorage.getItem(key);
      const size = item ? new Blob([item]).size : 0;
      breakdown[key] = size;
      totalSize += size;
    });
    
    return { totalSize, breakdown };
  },
};