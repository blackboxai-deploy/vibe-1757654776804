// Core user and game types
export interface UserProfile {
  id: string;
  name: string;
  level: number;
  totalExp: number;
  currentExp: number;
  expToNextLevel: number;
  joinedDate: string;
  streakDays: number;
  badges: Badge[];
  avatar?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  type: 'good' | 'bad';
  category: LifeArea;
  frequency: 'daily' | 'weekly';
  expValue: number;
  streak: number;
  longestStreak: number;
  completedDates: string[];
  isActive: boolean;
  createdDate: string;
  color?: string;
}

export interface EpicQuest {
  id: string;
  title: string;
  description: string;
  category: LifeArea;
  totalMilestones: number;
  completedMilestones: number;
  expReward: number;
  isCompleted: boolean;
  completedDate?: string;
  createdDate: string;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  expReward: number;
  isCompleted: boolean;
  completedDate?: string;
  order: number;
}

export interface JournalEntry {
  id: string;
  date: string;
  title?: string;
  content: string;
  mood: 'very-bad' | 'bad' | 'neutral' | 'good' | 'excellent';
  habits?: string[];
  tags?: string[];
  aiInsights?: AIInsight[];
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'suggestion' | 'motivation' | 'reflection';
  content: string;
  confidence: number;
  generatedDate: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  category: 'entertainment' | 'food' | 'shopping' | 'experience' | 'custom';
  isUnlocked: boolean;
  isRedeemed: boolean;
  redeemedDate?: string;
  createdDate: string;
  requiredLevel?: number;
  requiredBadges?: string[];
}

export interface FinanceEntry {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  habitRelated?: string;
  aiCategorized?: boolean;
}

export interface Notification {
  id: string;
  type: 'habit_reminder' | 'streak_warning' | 'level_up' | 'quest_complete' | 'ai_insight';
  title: string;
  message: string;
  isRead: boolean;
  createdDate: string;
  actionUrl?: string;
}

export type LifeArea = 
  | 'health'
  | 'fitness'
  | 'career'
  | 'finance'
  | 'personal-development'
  | 'relationships'
  | 'creativity'
  | 'spirituality';

export interface LifeAreaProgress {
  area: LifeArea;
  totalExp: number;
  level: number;
  habits: number;
  quests: number;
  completionRate: number;
}

// Game state interfaces
export interface GameState {
  user: UserProfile;
  habits: Habit[];
  quests: EpicQuest[];
  rewards: Reward[];
  journalEntries: JournalEntry[];
  financeEntries: FinanceEntry[];
  notifications: Notification[];
  settings: GameSettings;
}

export interface GameSettings {
  notifications: {
    habitReminders: boolean;
    streakWarnings: boolean;
    levelUp: boolean;
    dailyReflection: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'id';
  privacy: {
    aiAnalysis: boolean;
    dataSharing: boolean;
  };
}

// API response types
export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Statistics and analytics types
export interface HabitStats {
  habitId: string;
  completionRate: number;
  totalCompletions: number;
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: number[];
  monthlyProgress: number[];
}

export interface OverallStats {
  totalExp: number;
  habitsCompleted: number;
  questsCompleted: number;
  currentStreaks: number;
  journalEntries: number;
  daysActive: number;
  lifeAreaProgress: LifeAreaProgress[];
}

// Form types
export interface CreateHabitForm {
  name: string;
  description?: string;
  type: 'good' | 'bad';
  category: LifeArea;
  frequency: 'daily' | 'weekly';
  expValue: number;
  color?: string;
}

export interface CreateQuestForm {
  title: string;
  description: string;
  category: LifeArea;
  milestones: {
    title: string;
    description: string;
    expReward: number;
  }[];
}

export interface CreateRewardForm {
  name: string;
  description: string;
  cost: number;
  category: 'entertainment' | 'food' | 'shopping' | 'experience' | 'custom';
  requiredLevel?: number;
  requiredBadges?: string[];
}

// Export utility types
export interface ExcelExportData {
  filename: string;
  sheets: {
    name: string;
    data: any[];
    headers: string[];
  }[];
}