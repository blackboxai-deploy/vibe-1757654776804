import { LifeArea, Badge } from './types';

// EXP and Level Constants
export const EXP_CONSTANTS = {
  BASE_EXP_TO_NEXT_LEVEL: 100,
  LEVEL_MULTIPLIER: 1.5,
  MAX_LEVEL: 100,
  STREAK_BONUS_MULTIPLIER: 0.1, // 10% bonus per streak day
  MAX_STREAK_BONUS: 2.0, // Maximum 200% bonus
  HABIT_COMPLETION_BASE_EXP: 10,
  QUEST_MILESTONE_BASE_EXP: 50,
  QUEST_COMPLETION_BONUS: 100,
} as const;

// Life Areas Configuration
export const LIFE_AREAS: Record<LifeArea, {
  name: string;
  description: string;
  color: string;
  icon: string;
}> = {
  health: {
    name: 'Kesehatan',
    description: 'Kesehatan fisik dan mental',
    color: 'bg-red-500',
    icon: '❤️',
  },
  fitness: {
    name: 'Kebugaran',
    description: 'Olahraga dan aktivitas fisik',
    color: 'bg-orange-500',
    icon: '💪',
  },
  career: {
    name: 'Karier',
    description: 'Pengembangan profesional',
    color: 'bg-blue-500',
    icon: '💼',
  },
  finance: {
    name: 'Keuangan',
    description: 'Manajemen keuangan pribadi',
    color: 'bg-green-500',
    icon: '💰',
  },
  'personal-development': {
    name: 'Pengembangan Diri',
    description: 'Belajar dan skill baru',
    color: 'bg-purple-500',
    icon: '📚',
  },
  relationships: {
    name: 'Hubungan',
    description: 'Relasi dengan keluarga dan teman',
    color: 'bg-pink-500',
    icon: '👥',
  },
  creativity: {
    name: 'Kreativitas',
    description: 'Seni, musik, dan ekspresi kreatif',
    color: 'bg-yellow-500',
    icon: '🎨',
  },
  spirituality: {
    name: 'Spiritualitas',
    description: 'Meditasi dan refleksi spiritual',
    color: 'bg-indigo-500',
    icon: '🧘',
  },
} as const;

// Achievement Badges
export const ACHIEVEMENT_BADGES: Badge[] = [
  {
    id: 'first-habit',
    name: 'First Steps',
    description: 'Menyelesaikan kebiasaan pertama',
    icon: '🌱',
    unlockedDate: '',
    rarity: 'common',
  },
  {
    id: 'week-streak',
    name: 'Week Warrior',
    description: 'Mencapai streak 7 hari',
    icon: '🔥',
    unlockedDate: '',
    rarity: 'common',
  },
  {
    id: 'month-streak',
    name: 'Month Master',
    description: 'Mencapai streak 30 hari',
    icon: '⭐',
    unlockedDate: '',
    rarity: 'rare',
  },
  {
    id: 'hundred-habits',
    name: 'Century Club',
    description: 'Menyelesaikan 100 kebiasaan',
    icon: '💯',
    unlockedDate: '',
    rarity: 'epic',
  },
  {
    id: 'first-quest',
    name: 'Quest Starter',
    description: 'Menyelesaikan Epic Quest pertama',
    icon: '⚔️',
    unlockedDate: '',
    rarity: 'rare',
  },
  {
    id: 'level-10',
    name: 'Rising Star',
    description: 'Mencapai Level 10',
    icon: '🌟',
    unlockedDate: '',
    rarity: 'rare',
  },
  {
    id: 'level-50',
    name: 'Champion',
    description: 'Mencapai Level 50',
    icon: '🏆',
    unlockedDate: '',
    rarity: 'epic',
  },
  {
    id: 'balanced-life',
    name: 'Life Balance',
    description: 'Aktif di semua 8 life areas',
    icon: '⚖️',
    unlockedDate: '',
    rarity: 'legendary',
  },
  {
    id: 'journal-streak',
    name: 'Reflective Soul',
    description: 'Jurnal 30 hari berturut-turut',
    icon: '📖',
    unlockedDate: '',
    rarity: 'rare',
  },
  {
    id: 'financial-tracker',
    name: 'Money Manager',
    description: 'Track keuangan selama 60 hari',
    icon: '📊',
    unlockedDate: '',
    rarity: 'epic',
  },
] as const;

// Habit Categories and Suggestions
export const HABIT_SUGGESTIONS = {
  health: [
    'Minum 8 gelas air per hari',
    'Tidur 8 jam setiap malam',
    'Makan buah setiap hari',
    'Tidak merokok',
    'Tidak minum alkohol berlebihan',
  ],
  fitness: [
    'Olahraga 30 menit',
    'Jalan kaki 10.000 langkah',
    'Stretching pagi',
    'Push-up 20 kali',
    'Naik tangga daripada lift',
  ],
  'personal-development': [
    'Membaca buku 30 menit',
    'Belajar bahasa asing',
    'Menonton video edukatif',
    'Mengikuti online course',
    'Menulis jurnal refleksi',
  ],
  career: [
    'Networking dengan 1 orang baru',
    'Update LinkedIn profile',
    'Belajar skill baru work-related',
    'Menyelesaikan task tepat waktu',
    'Tidak procrastinating',
  ],
  finance: [
    'Catat semua pengeluaran',
    'Tidak belanja impulsif',
    'Menabung setiap hari',
    'Review budget bulanan',
    'Investasi rutin',
  ],
} as const;

// Reward Categories
export const REWARD_CATEGORIES = {
  entertainment: {
    name: 'Hiburan',
    icon: '🎬',
    suggestions: ['Nonton film', 'Main game 2 jam', 'Binge-watch series'],
  },
  food: {
    name: 'Makanan',
    icon: '🍕',
    suggestions: ['Makan es krim', 'Order makanan favorit', 'Ke restoran baru'],
  },
  shopping: {
    name: 'Belanja',
    icon: '🛍️',
    suggestions: ['Beli baju baru', 'Beli gadget', 'Shopping spree'],
  },
  experience: {
    name: 'Pengalaman',
    icon: '🎪',
    suggestions: ['Ke konser', 'Traveling weekend', 'Spa/massage'],
  },
  custom: {
    name: 'Kustom',
    icon: '⭐',
    suggestions: ['Tidur siang', 'Me-time seharian', 'Hobby time'],
  },
} as const;

// Notification Types
export const NOTIFICATION_TYPES = {
  HABIT_REMINDER: 'habit_reminder',
  STREAK_WARNING: 'streak_warning',
  LEVEL_UP: 'level_up',
  QUEST_COMPLETE: 'quest_complete',
  AI_INSIGHT: 'ai_insight',
} as const;

// AI Prompts for GPT-5 Integration
export const AI_PROMPTS = {
  JOURNAL_ANALYSIS: `Analyze this journal entry for emotional patterns, habits, and provide encouraging insights. Focus on positive reinforcement and actionable suggestions. Respond in Indonesian language. Keep it supportive and motivating.`,
  
  PROGRESS_INSIGHTS: `Based on the user's habit completion data and progress, provide personalized insights about their journey. Highlight achievements, identify patterns, and suggest improvements. Use encouraging tone and respond in Indonesian.`,
  
  MOTIVATION_MESSAGE: `Create a personalized motivational message for this user based on their current streak and recent activity. Make it engaging, supportive, and inspiring. Use RPG/gaming terminology when appropriate. Respond in Indonesian.`,
  
  HABIT_SUGGESTIONS: `Based on the user's current habits and goals in {lifeArea}, suggest 3 new habits they could adopt. Make them specific, achievable, and aligned with their progress level. Respond in Indonesian.`,
  
  REFLECTION_PROMPTS: `Generate 3 thoughtful reflection questions related to {topic} that will help the user gain deeper self-awareness and motivation. Make them introspective but not overwhelming. Respond in Indonesian.`,
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_PROFILE: 'levelup_user_profile',
  HABITS: 'levelup_habits',
  QUESTS: 'levelup_quests',
  REWARDS: 'levelup_rewards',
  JOURNAL: 'levelup_journal',
  FINANCE: 'levelup_finance',
  NOTIFICATIONS: 'levelup_notifications',
  SETTINGS: 'levelup_settings',
  ONBOARDING_COMPLETED: 'levelup_onboarding_completed',
} as const;

// App Configuration
export const APP_CONFIG = {
  NAME: 'LevelUp Life',
  VERSION: '1.0.0',
  DESCRIPTION: 'Gamifikasi personal untuk mencapai tujuan hidup',
  AUTHOR: 'LevelUp Team',
  DEFAULT_THEME: 'dark' as const,
  SUPPORTED_LANGUAGES: ['id', 'en'] as const,
  MAX_HABITS_FREE: 50,
  MAX_QUESTS_FREE: 10,
  MAX_REWARDS_FREE: 20,
} as const;

// Time Constants
export const TIME_CONSTANTS = {
  MILLISECONDS_IN_DAY: 24 * 60 * 60 * 1000,
  DAYS_IN_WEEK: 7,
  DAYS_IN_MONTH: 30,
  STREAK_RESET_HOUR: 6, // 6 AM
} as const;