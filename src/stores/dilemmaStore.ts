import { create } from 'zustand';
import { Dilemma, Helper, SortOption, HelpSession, Achievement } from '../types';
import { ApiClient } from '../utils/ApiClient';
import { authState } from '../contexts/AuthContext';
import { useChatStore } from './chatStore';
import { useSessionStore } from './sessionStore';
import { notificationService } from '../services/notificationService';
import { authService } from '../services/authService';

const POSTS_PER_PAGE = 10;

interface DilemmaState {
  allDilemmas: Dilemma[];
  forYouDilemmas: Dilemma[];
  isLoading: boolean;
  filter: string;
  sort: SortOption;
  searchTerm: string;
  currentPage: number;
  reportingDilemmaId: string | null;
  isReportModalOpen: boolean;
  blockedUserIds: Set<string>;

  // Derived state
  reportedDilemmas: Dilemma[];
  visibleDilemmas: Dilemma[];
  hasMore: boolean;

  // Actions
  fetchDilemmas: () => Promise<void>;
  fetchForYouFeed: () => Promise<void>;
  setFilter: (filter: string) => void;
  setSort: (sort: SortOption) => void;
  setSearchTerm: (term: string) => void;
  loadMore: () => void;
  postDilemma: (data: Omit<Dilemma, 'id' | 'userToken' | 'supportCount' | 'isSupported' | 'isReported' | 'reportReason' | 'status' | 'assignedHelperId' | 'resolved_by_seeker' | 'requestedHelperId' | 'summary' | 'summaryLoading' | 'moderation' | 'aiMatchReason'>, userToken: string) => Promise<void>;
  createDirectRequest: (data: Pick<Dilemma, 'content' | 'category'>, userToken: string, requestedHelperId: string) => Promise<void>;
  toggleSupport: (dilemmaId: string) => Promise<void>;
  openReportModal: (dilemmaId: string) => void;
  closeReportModal: () => void;
  reportDilemma: (reason: string) => Promise<void>;
  getDilemmaById: (id: string) => Dilemma | undefined;
  acceptDilemma: (dilemmaId: string) => Promise<void>;
  resolveDilemma: (dilemmaId: string, userToken: string) => Promise<void>;
  declineRequest: (dilemmaId: string) => Promise<void>;
  summarizeDilemma: (dilemmaId: string) => Promise<void>;
  dismissReport: (dilemmaId: string) => Promise<void>;
  removePost: (dilemmaId: string) => Promise<void>;
}

export const useDilemmaStore = create<DilemmaState>((set, get) => {
    const calculateDerivedState = (state: DilemmaState) => {
        const { allDilemmas, filter, sort, searchTerm, currentPage, blockedUserIds } = state;

        // Calculate reportedDilemmas
        const reportedDilemmas = allDilemmas.filter(d => d.isReported && d.status !== 'removed_by_moderator');

        // Calculate visibleDilemmas and hasMore for the community feed
        let filteredDilemmas = allDilemmas.filter(d =>
            d.status === 'active' &&
            !d.assignedHelperId &&
            !d.isReported &&
            !blockedUserIds.has(d.userToken)
        );

        if (filter !== 'All') {
            filteredDilemmas = filteredDilemmas.filter(d => d.category === filter);
        }

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            filteredDilemmas = filteredDilemmas.filter(d => d.content.toLowerCase().includes(lowerCaseSearchTerm));
        }

        switch (sort) {
            case 'newest':
                filteredDilemmas.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                break;
            case 'most-support':
                filteredDilemmas.sort((a, b) => b.supportCount - a.supportCount);
                break;
            case 'needs-support':
                filteredDilemmas.sort((a, b) => a.supportCount - b.supportCount);
                break;
        }

        const paginatedDilemmas = filteredDilemmas.slice(0, currentPage * POSTS_PER_PAGE);
        const hasMore = paginatedDilemmas.length < filteredDilemmas.length;

        return {
            reportedDilemmas,
            visibleDilemmas: paginatedDilemmas,
            hasMore,
        };
    };

  return {
    allDilemmas: [],
    forYouDilemmas: [],
    isLoading: true,
    filter: 'All',
    sort: 'newest',
    searchTerm: '',
    currentPage: 1,
    reportingDilemmaId: null,
    isReportModalOpen: false,
    blockedUserIds: new Set(),
    reportedDilemmas: [],
    visibleDilemmas: [],
    hasMore: false,

    fetchDilemmas: async () => {
        set({ isLoading: true });
        try {
            const dilemmas = await ApiClient.dilemmas.getDilemmas();
            set(state => ({
                ...state,
                allDilemmas: dilemmas,
                isLoading: false,
                ...calculateDerivedState({ ...state, allDilemmas: dilemmas })
            }));
        } catch (error) {
            console.error("Failed to fetch dilemmas:", error);
            set({ isLoading: false });
        }
    },

    fetchForYouFeed: async () => {
        const userToken = authState.userToken;
        if (!userToken) return;
        try {
            const dilemmas = await ApiClient.dilemmas.getForYouFeed(userToken);
            set({ forYouDilemmas: dilemmas });
        } catch (error) {
            console.error("Failed to load For You feed:", error);
        }
    },
    
    setFilter: (filter) => set(state => {
        const newState = { ...state, filter, currentPage: 1 };
        return { ...newState, ...calculateDerivedState(newState) };
    }),
    setSort: (sort) => set(state => {
        const newState = { ...state, sort };
        return { ...newState, ...calculateDerivedState(newState) };
    }),
    setSearchTerm: (term) => set(state => {
        const newState = { ...state, searchTerm: term, currentPage: 1 };
        return { ...newState, ...calculateDerivedState(newState) };
    }),
    loadMore: () => set(state => {
        const newState = { ...state, currentPage: state.currentPage + 1 };
        return { ...newState, ...calculateDerivedState(newState) };
    }),
    
    openReportModal: (dilemmaId) => set({ reportingDilemmaId: dilemmaId, isReportModalOpen: true }),
    closeReportModal: () => set({ reportingDilemmaId: null, isReportModalOpen: false }),

    getDilemmaById: (id) => get().allDilemmas.find(d => d.id === id),
    
    postDilemma: async (data, userToken) => {
        await ApiClient.dilemmas.postDilemma(data, userToken);
        await get().fetchDilemmas();
    },

    createDirectRequest: async (data, userToken, requestedHelperId) => {
        await ApiClient.dilemmas.createDirectRequest(data, userToken, requestedHelperId);
        await get().fetchDilemmas();
    },
    
    toggleSupport: async (dilemmaId) => {
        const updated = await ApiClient.dilemmas.toggleSupport(dilemmaId);
        set(state => {
            const newAllDilemmas = state.allDilemmas.map(d => d.id === updated.id ? updated : d);
            const newState = { ...state, allDilemmas: newAllDilemmas };
            return { ...newState, ...calculateDerivedState(newState) };
        });
    },
    
    reportDilemma: async (reason) => {
        const { reportingDilemmaId } = get();
        if (!reportingDilemmaId) return;
        const updated = await ApiClient.dilemmas.report(reportingDilemmaId, reason);
        set(state => {
            const newAllDilemmas = state.allDilemmas.map(d => d.id === updated.id ? updated : d);
            const newState = { ...state, allDilemmas: newAllDilemmas, reportingDilemmaId: null };
            return { ...newState, ...calculateDerivedState(newState) };
        });
    },
    
    acceptDilemma: async (dilemmaId) => {
        const helper = authState.helperProfile;
        if (!helper) throw new Error("Helper profile not found");
        
        const result = await ApiClient.dilemmas.acceptDilemma(dilemmaId, helper.id);
        
        set(state => {
            const newAllDilemmas = state.allDilemmas.map(d => d.id === result.dilemma.id ? result.dilemma : d);
            const newState = { ...state, allDilemmas: newAllDilemmas };
            return { ...newState, ...calculateDerivedState(newState) };
        });
        
        if (result.updatedHelper) {
            authService.updateHelperProfile(result.updatedHelper);
        }
        
        if (result.newAchievements && result.newAchievements.length > 0) {
            result.newAchievements.forEach(ach => {
                notificationService.addToast(`🏆 Achievement Unlocked: ${ach.name}!`, 'success');
            });
        }

        useChatStore.getState().startChat(result.dilemma.id, 'helper');
    },
    
    declineRequest: async (dilemmaId) => {
        const helper = authState.helperProfile;
        if (!helper) throw new Error("Helper profile not found");

        const updatedDilemma = await ApiClient.dilemmas.declineRequest(dilemmaId, helper.id);
        set(state => {
            const newAllDilemmas = state.allDilemmas.map(d => d.id === updatedDilemma.id ? updatedDilemma : d);
            const newState = { ...state, allDilemmas: newAllDilemmas };
            return { ...newState, ...calculateDerivedState(newState) };
        });
    },

    resolveDilemma: async (dilemmaId, userToken) => {
        const updated = await ApiClient.dilemmas.resolveBySeeker(dilemmaId, userToken);
        set(state => {
            const newAllDilemmas = state.allDilemmas.map(d => d.id === updated.id ? updated : d);
            const newState = { ...state, allDilemmas: newAllDilemmas };
            return { ...newState, ...calculateDerivedState(newState) };
        });
    },

    summarizeDilemma: async (dilemmaId) => {
        const dilemma = get().allDilemmas.find(d => d.id === dilemmaId);
        if (!dilemma) return;

        set(state => ({ allDilemmas: state.allDilemmas.map(d => d.id === dilemmaId ? { ...d, summaryLoading: true } : d) }));
        try {
            const summary = await ApiClient.ai.summarizeDilemma(dilemma.content);
            set(state => ({ allDilemmas: state.allDilemmas.map(d => d.id === dilemmaId ? { ...d, summary, summaryLoading: false } : d) }));
        } catch (err) {
            console.error("Failed to summarize dilemma", err);
            set(state => ({ allDilemmas: state.allDilemmas.map(d => d.id === dilemmaId ? { ...d, summaryLoading: false } : d) }));
        }
    },

    dismissReport: async (dilemmaId) => {
        const helper = authState.helperProfile;
        if (!helper) throw new Error("Moderator profile not found");
        await ApiClient.moderation.dismissReport(dilemmaId, helper);
        await get().fetchDilemmas();
    },

    removePost: async (dilemmaId) => {
        const helper = authState.helperProfile;
        if (!helper) throw new Error("Moderator profile not found");
        await ApiClient.moderation.removePost(dilemmaId, helper);
        await get().fetchDilemmas();
    },
  }
});

// Initial data fetch
useDilemmaStore.getState().fetchDilemmas();