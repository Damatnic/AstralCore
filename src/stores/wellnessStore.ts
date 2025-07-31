import { create } from 'zustand';
import { MoodCheckIn, Habit, TrackedHabit, HabitCompletion, JournalEntry } from '../types';
import { ApiClient } from '../utils/ApiClient';
import { authState } from '../contexts/AuthContext';
import { calculateStreaks } from '../utils/habitUtils';

interface WellnessState {
  history: MoodCheckIn[];
  journalEntries: JournalEntry[];
  isLoading: boolean;
  predefinedHabits: Habit[];
  trackedHabits: TrackedHabit[];
  isLoadingHabits: boolean;
  completions: HabitCompletion[];

  // Actions
  fetchHistory: () => Promise<void>;
  postCheckIn: (checkInData: Omit<MoodCheckIn, 'id' | 'userToken' | 'timestamp'>) => Promise<void>;
  fetchHabits: () => Promise<void>;
  trackHabit: (habitId: string) => Promise<void>;
  untrackHabit: (habitId: string) => Promise<void>;
  logCompletion: (habitId: string) => Promise<void>;
  fetchJournalEntries: () => Promise<void>;
  postJournalEntry: (content: string) => Promise<void>;
}

export const useWellnessStore = create<WellnessState>((set, get) => ({
  history: [],
  journalEntries: [],
  isLoading: true,
  predefinedHabits: [],
  trackedHabits: [],
  isLoadingHabits: true,
  completions: [],

  fetchHistory: async () => {
    const userToken = authState.userToken;
    if (!userToken) {
        set({ history: [], isLoading: false });
        return;
    }
    set({ isLoading: true });
    try {
      const data = await ApiClient.mood.getHistory(userToken);
      set({ history: data });
    } catch (error) {
      console.error("Failed to fetch wellness history:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  postCheckIn: async (checkInData) => {
    const userToken = authState.userToken;
    if (!userToken) throw new Error("User token is not available.");
    
    await ApiClient.mood.postCheckIn(checkInData, userToken);
    await get().fetchHistory();
  },

  fetchJournalEntries: async () => {
    const userToken = authState.userToken;
    if (!userToken) {
        set({ journalEntries: [] });
        return;
    }
    try {
      const data = await ApiClient.journal.getEntries(userToken);
      set({ journalEntries: data.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) });
    } catch (error) {
      console.error("Failed to fetch journal entries:", error);
    }
  },

  postJournalEntry: async (content) => {
    const userToken = authState.userToken;
    if (!userToken) throw new Error("User token is not available.");
    
    await ApiClient.journal.postEntry(content, userToken);
    await get().fetchJournalEntries();
  },

  fetchHabits: async () => {
    const userToken = authState.userToken;
    if (!userToken) {
      set({ predefinedHabits: [], trackedHabits: [], completions: [], isLoadingHabits: false });
      return;
    }
    set({ isLoadingHabits: true });
    try {
        const [predefined, trackedIds, comps] = await Promise.all([
            ApiClient.habits.getPredefinedHabits(),
            ApiClient.habits.getTrackedHabitIds(userToken),
            ApiClient.habits.getCompletions(userToken),
        ]);
        
        const trackedWithStreaks = calculateStreaks(predefined.filter(h => trackedIds.includes(h.id)), comps, userToken);
        set({
            predefinedHabits: predefined,
            completions: comps,
            trackedHabits: trackedWithStreaks,
        });
    } catch (error) {
        console.error("Failed to fetch habits data:", error);
    } finally {
        set({ isLoadingHabits: false });
    }
  },

  trackHabit: async (habitId) => {
    const userToken = authState.userToken;
    if (!userToken) return;
    await ApiClient.habits.trackHabit(userToken, habitId);
    await get().fetchHabits();
  },
  
  untrackHabit: async (habitId) => {
    const userToken = authState.userToken;
    if (!userToken) return;
    await ApiClient.habits.untrackHabit(userToken, habitId);
    await get().fetchHabits();
  },

  logCompletion: async (habitId) => {
    const userToken = authState.userToken;
    if (!userToken) return;
    const today = new Date().toISOString().split('T')[0];
    await ApiClient.habits.logCompletion(userToken, habitId, today);
    await get().fetchHabits();
  },
}));

// Initial data fetches
useWellnessStore.getState().fetchHistory();
useWellnessStore.getState().fetchHabits();
useWellnessStore.getState().fetchJournalEntries();