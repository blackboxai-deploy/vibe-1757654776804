'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  UserProfile, 
  Habit, 
  EpicQuest, 
  JournalEntry, 
  Reward,
  GameSettings 
} from '@/lib/types';
import { 
  userStorage, 
  habitsStorage, 
  questsStorage, 
  journalStorage,
  settingsStorage
} from '@/lib/storage';
import { awardExp, calculateCurrentStreak } from '@/lib/expSystem';

// Game State Interface
interface GameState {
  user: UserProfile | null;
  habits: Habit[];
  quests: EpicQuest[];
  journalEntries: JournalEntry[];
  rewards: Reward[];
  settings: GameSettings;
  isLoading: boolean;
  error: string | null;
}

// Action Types
type GameAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'INITIALIZE_GAME'; payload: GameState }
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'UPDATE_USER'; payload: Partial<UserProfile> }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: { id: string; updates: Partial<Habit> } }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'COMPLETE_HABIT'; payload: { habitId: string; expGained: number } }
  | { type: 'ADD_QUEST'; payload: EpicQuest }
  | { type: 'UPDATE_QUEST'; payload: { id: string; updates: Partial<EpicQuest> } }
  | { type: 'COMPLETE_MILESTONE'; payload: { questId: string; milestoneId: string; expGained: number } }
  | { type: 'ADD_JOURNAL_ENTRY'; payload: JournalEntry }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> };

// Initial State
const initialState: GameState = {
  user: null,
  habits: [],
  quests: [],
  journalEntries: [],
  rewards: [],
  settings: {
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
  },
  isLoading: true,
  error: null,
};

// Reducer
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'INITIALIZE_GAME':
      return { ...action.payload, isLoading: false };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'UPDATE_USER':
      return { 
        ...state, 
        user: state.user ? { ...state.user, ...action.payload } : null 
      };
    
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id
            ? { ...habit, ...action.payload.updates }
            : habit
        ),
      };
    
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
      };
    
    case 'COMPLETE_HABIT':
      const updatedUser = userStorage.get();
      return {
        ...state,
        user: updatedUser,
        habits: habitsStorage.getAll(),
      };
    
    case 'ADD_QUEST':
      return { ...state, quests: [...state.quests, action.payload] };
    
    case 'UPDATE_QUEST':
      return {
        ...state,
        quests: state.quests.map(quest =>
          quest.id === action.payload.id
            ? { ...quest, ...action.payload.updates }
            : quest
        ),
      };
    
    case 'COMPLETE_MILESTONE':
      const updatedUserAfterMilestone = userStorage.get();
      return {
        ...state,
        user: updatedUserAfterMilestone,
        quests: questsStorage.getAll(),
      };
    
    case 'ADD_JOURNAL_ENTRY':
      return {
        ...state,
        journalEntries: [action.payload, ...state.journalEntries],
      };
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };
    
    default:
      return state;
  }
};

// Context
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  // Helper functions
  initializeUser: (name: string) => void;
  addHabit: (habitData: Omit<Habit, 'id' | 'createdDate' | 'completedDates' | 'streak' | 'longestStreak'>) => void;
  completeHabit: (habitId: string) => Promise<{ expGained: number; leveledUp: boolean }>;
  addQuest: (questData: Omit<EpicQuest, 'id' | 'createdDate' | 'completedMilestones' | 'isCompleted'>) => void;
  completeMilestone: (questId: string, milestoneId: string) => Promise<{ expGained: number }>;
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateUserStreak: () => void;
} | null>(null);

// Provider Component
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Initialize game data from storage
  useEffect(() => {
    const initializeGame = () => {
      try {
        const user = userStorage.get();
        const habits = habitsStorage.getAll();
        const quests = questsStorage.getAll();
        const journalEntries = journalStorage.getAll();
        const settings = settingsStorage.get();

        // Update user streak if needed
        if (user) {
          const currentStreak = calculateCurrentStreak(habits);
          if (currentStreak !== user.streakDays) {
            const updatedUser = userStorage.update({ streakDays: currentStreak });
            if (updatedUser) {
              dispatch({ type: 'SET_USER', payload: updatedUser });
            }
          } else {
            dispatch({ type: 'SET_USER', payload: user });
          }
        }

        dispatch({
          type: 'INITIALIZE_GAME',
          payload: {
            user,
            habits,
            quests,
            journalEntries,
            rewards: [],
            settings,
            isLoading: false,
            error: null,
          },
        });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load game data' });
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeGame();
  }, []);

  // Helper Functions
  const initializeUser = (name: string) => {
    const newUser = userStorage.create(name);
    dispatch({ type: 'SET_USER', payload: newUser });
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdDate' | 'completedDates' | 'streak' | 'longestStreak'>) => {
    const newHabit = habitsStorage.add(habitData);
    dispatch({ type: 'ADD_HABIT', payload: newHabit });
  };

  const completeHabit = async (habitId: string): Promise<{ expGained: number; leveledUp: boolean }> => {
    const result = habitsStorage.markComplete(habitId);
    
    if (result.habit && result.expGained > 0) {
      dispatch({ type: 'COMPLETE_HABIT', payload: { habitId, expGained: result.expGained } });
      
      // Check for level up and achievements
      const expResult = awardExp(result.expGained);
      
      return {
        expGained: result.expGained,
        leveledUp: expResult.leveledUp,
      };
    }
    
    return { expGained: 0, leveledUp: false };
  };

  const addQuest = (questData: Omit<EpicQuest, 'id' | 'createdDate' | 'completedMilestones' | 'isCompleted'>) => {
    const newQuest = questsStorage.add(questData);
    dispatch({ type: 'ADD_QUEST', payload: newQuest });
  };

  const completeMilestone = async (questId: string, milestoneId: string): Promise<{ expGained: number }> => {
    const result = questsStorage.completeMilestone(questId, milestoneId);
    
    if (result.quest && result.expGained > 0) {
      dispatch({ 
        type: 'COMPLETE_MILESTONE', 
        payload: { questId, milestoneId, expGained: result.expGained } 
      });
      
      return { expGained: result.expGained };
    }
    
    return { expGained: 0 };
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = journalStorage.add(entry);
    dispatch({ type: 'ADD_JOURNAL_ENTRY', payload: newEntry });
  };

  const updateUserStreak = () => {
    if (!state.user) return;
    
    const currentStreak = calculateCurrentStreak(state.habits);
    if (currentStreak !== state.user.streakDays) {
      const updatedUser = userStorage.update({ streakDays: currentStreak });
      if (updatedUser) {
        dispatch({ type: 'UPDATE_USER', payload: { streakDays: currentStreak } });
      }
    }
  };

  const value = {
    state,
    dispatch,
    initializeUser,
    addHabit,
    completeHabit,
    addQuest,
    completeMilestone,
    addJournalEntry,
    updateUserStreak,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

// Hook to use Game Context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export default GameContext;