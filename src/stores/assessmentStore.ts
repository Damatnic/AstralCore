import { create } from 'zustand';
import { Assessment } from '../types';
import { ApiClient } from '../utils/ApiClient';
import { authState } from '../contexts/AuthContext';

interface AssessmentState {
  history: Assessment[];
  isLoading: boolean;
  
  // Actions
  fetchHistory: () => Promise<void>;
  submitPhq9Result: (score: number, answers: number[]) => Promise<void>;
  submitGad7Result: (score: number, answers: number[]) => Promise<void>;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
    history: [],
    isLoading: true,

    fetchHistory: async () => {
        const userToken = authState.userToken;
        if (!userToken) {
            set({ history: [], isLoading: false });
            return;
        }
        set({ isLoading: true });
        try {
            const data = await ApiClient.assessments.getHistory(userToken);
            set({ history: data });
        } catch (error) {
            console.error("Failed to fetch assessment history:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    submitPhq9Result: async (score, answers) => {
        const userToken = authState.userToken;
        if (!userToken) throw new Error("User token is not available.");
        await ApiClient.assessments.submitPhq9Result(userToken, score, answers);
        await get().fetchHistory();
    },
    
    submitGad7Result: async (score, answers) => {
        const userToken = authState.userToken;
        if (!userToken) throw new Error("User token is not available.");
        await ApiClient.assessments.submitGad7Result(userToken, score, answers);
        await get().fetchHistory();
    },

}));

// Initial data fetch
useAssessmentStore.getState().fetchHistory();