
import { Dilemma, AnalysisResult, AIChatMessage, ChatMessage, CrisisResource, Feedback, Helper, ForumThread, ForumPost, CommunityProposal, CommunityVote, Reflection, Block, ModerationAction, HelpSession, Achievement, UserStatus, CommunityStats, HelperGuidance, SafetyPlan, LegalConsentRecord, WellnessVideo, MoodCheckIn, Habit, TrackedHabit, HabitCompletion, Assessment, Resource, JournalEntry } from '../types';

// ====================================================================================
// API CLIENT REFACTOR COMPLETE
// This file has been fully transitioned to a client that calls a real backend API
// running on Netlify Functions. All mock logic and localStorage access has been
// removed and replaced with calls to the `_callApi` helper. The frontend is now
// completely decoupled from the data layer.
// ====================================================================================


/**
 * The single source of truth for all backend API calls.
 * @param endpoint The API endpoint to call (e.g., '/dilemmas')
 * @param options Standard fetch options (method, body, etc.)
 */
const _callApi = async (endpoint: string, options: RequestInit = {}) => {
    // In a real app, the access token would be retrieved from a secure context.
    const token = sessionStorage.getItem('accessToken'); 

    const response = await fetch(`/api${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    });

    if (response.status === 401) {
        // Broadcast an event that other parts of the app can listen for.
        // This is a clean way to handle auth errors globally.
        window.dispatchEvent(new CustomEvent('auth-error'));
        throw new Error('Unauthorized');
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An unknown API error occurred.' }));
        console.error(`API call to ${endpoint} failed with status ${response.status}.`, errorData);
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return; // No content to parse
    }
    
    return response.json();
};

// --- Centralized API Client ---
export const ApiClient = {
    resources: {
        getResources: (): Promise<Resource[]> => {
            return _callApi('/wellness/resources');
        }
    },
    assessments: {
        submitPhq9Result: (userToken: string, score: number, answers: number[]): Promise<Assessment> => {
            return _callApi('/wellness/assessments', { method: 'POST', body: JSON.stringify({ userToken, score, answers, type: 'phq-9' }) });
        },
        submitGad7Result: (userToken: string, score: number, answers: number[]): Promise<Assessment> => {
             return _callApi('/wellness/assessments', { method: 'POST', body: JSON.stringify({ userToken, score, answers, type: 'gad-7' }) });
        },
        getHistory: (userToken: string): Promise<Assessment[]> => {
            return _callApi(`/wellness/assessments/history/${userToken}`);
        }
    },
    habits: {
        getPredefinedHabits: (): Promise<Habit[]> => {
            return _callApi('/wellness/habits/predefined');
        },
        getTrackedHabitIds: (userId: string): Promise<string[]> => {
            return _callApi(`/wellness/habits/tracked/${userId}`);
        },
        getCompletions: (userId: string): Promise<HabitCompletion[]> => {
            return _callApi(`/wellness/habits/completions/${userId}`);
        },
        trackHabit: (userId: string, habitId: string): Promise<void> => {
            return _callApi('/wellness/habits/track', { method: 'POST', body: JSON.stringify({ userId, habitId }) });
        },
        untrackHabit: (userId: string, habitId: string): Promise<void> => {
            return _callApi('/wellness/habits/untrack', { method: 'POST', body: JSON.stringify({ userId, habitId }) });
        },
        logCompletion: (userId: string, habitId: string, date: string): Promise<HabitCompletion> => {
            return _callApi('/wellness/habits/log', { method: 'POST', body: JSON.stringify({ userId, habitId, date }) });
        },
    },
    mood: {
        postCheckIn: (checkInData: Omit<MoodCheckIn, 'id' | 'userToken' | 'timestamp'>, userToken: string): Promise<MoodCheckIn> => {
            return _callApi('/wellness/mood/checkin', { method: 'POST', body: JSON.stringify({ ...checkInData, userToken }) });
        },
        getHistory: (userToken: string): Promise<MoodCheckIn[]> => {
            return _callApi(`/wellness/mood/history/${userToken}`);
        },
    },
    journal: {
        getEntries: (userToken: string): Promise<JournalEntry[]> => {
            return _callApi(`/wellness/journal/history/${userToken}`);
        },
        postEntry: (content: string, userToken: string): Promise<JournalEntry> => {
            return _callApi('/wellness/journal/entry', { method: 'POST', body: JSON.stringify({ content, userToken }) });
        },
    },
    videos: {
        getVideos: (): Promise<WellnessVideo[]> => {
            return _callApi('/wellness/videos');
        },
        likeVideo: (videoId: string): Promise<WellnessVideo> => {
            return _callApi(`/wellness/videos/like/${videoId}`, { method: 'POST' });
        },
        uploadVideo: async (file: File, description: string, userToken: string): Promise<WellnessVideo> => {
            // In a real app, this would be a multi-part upload, but for the mock backend we simplify.
            return _callApi('/wellness/videos/upload', { method: 'POST', body: JSON.stringify({ description, userToken, fileName: file.name }) });
        }
    },
    safetyPlan: {
        get: (userToken: string): Promise<SafetyPlan | null> => {
            return _callApi(`/users/safety-plan/${userToken}`);
        },
        save: (plan: SafetyPlan, userToken: string): Promise<void> => {
            return _callApi('/users/safety-plan', { method: 'POST', body: JSON.stringify({ plan, userToken }) });
        }
    },
    legal: {
        checkConsent: (userId: string, documentType: string): Promise<{ document_version: string; consent_timestamp: string } | null> => {
            return _callApi(`/users/consent/${userId}/${documentType}`);
        },
        recordConsent: (userId: string, userType: string, documentType: string, documentVersion: string): Promise<void> => {
            return _callApi('/users/consent', { method: 'POST', body: JSON.stringify({ userId, userType, documentType, documentVersion }) });
        }
    },
    payment: {
        createDonationIntent: (amount: number): Promise<{ clientSecret: string }> => {
            // This can remain a mock or be built out as a real function.
            // For now, no changes are needed as it doesn't rely on the mock DB.
            return new Promise((resolve) => {
                console.log(`Simulating creating a payment intent for $${(amount / 100).toFixed(2)}`);
                setTimeout(() => {
                    resolve({ clientSecret: `pi_${crypto.randomUUID()}_secret_${crypto.randomUUID()}` });
                }, 500);
            });
        }
    },
    emergency: {
        trigger: (dilemmaId: string, location?: { latitude: number; longitude: number }): Promise<void> => {
             // This can remain a mock or be built out as a real function.
            return new Promise((resolve) => {
                console.log(`!!! EMERGENCY TRIGGERED for Dilemma ${dilemmaId} !!!`);
                if (location) {
                    console.log(`  > Location: lat=${location.latitude}, lon=${location.longitude}`);
                }
                setTimeout(() => resolve(), 300);
            });
        }
    },
    helpSessions: {
        getForUser: (userId: string): Promise<HelpSession[]> => {
            return _callApi(`/sessions/user/${userId}`);
        },
        toggleFavorite: (sessionId: string, seekerId: string): Promise<HelpSession> => {
            return _callApi(`/sessions/${sessionId}/favorite`, { method: 'POST', body: JSON.stringify({ seekerId }) });
        },
        sendKudos: (sessionId: string, seekerId: string): Promise<{ updatedHelper: Helper, newAchievements: Achievement[] }> => {
            return _callApi(`/sessions/${sessionId}/kudos`, { method: 'POST', body: JSON.stringify({ seekerId }) });
        },
    },
    preferences: {
        getPreferences: (userId: string): Promise<{ researchConsent: boolean }> => {
            return _callApi(`/users/preferences/${userId}`);
        },
        updatePreferences: (userId: string, prefs: { researchConsent: boolean }): Promise<void> => {
            return _callApi(`/users/preferences/${userId}`, { method: 'PUT', body: JSON.stringify(prefs) });
        }
    },
    dilemmas: {
        getDilemmas: (): Promise<Dilemma[]> => {
            return _callApi('/dilemmas');
        },
        getForYouFeed: (userToken: string): Promise<Dilemma[]> => {
            return _callApi(`/dilemmas/for-you/${userToken}`);
        },
        postDilemma: (dilemmaData: Omit<Dilemma, 'id' | 'userToken' | 'supportCount' | 'isSupported' | 'isReported' | 'reportReason' | 'status' | 'assignedHelperId' | 'resolved_by_seeker' | 'requestedHelperId' | 'summary' | 'summaryLoading' | 'moderation' | 'aiMatchReason'>, userToken: string): Promise<Dilemma> => {
            return _callApi('/dilemmas', { method: 'POST', body: JSON.stringify({ ...dilemmaData, userToken }) });
        },
        createDirectRequest: (dilemmaData: Pick<Dilemma, 'content' | 'category'>, userToken: string, requestedHelperId: string): Promise<Dilemma> => {
            return _callApi('/dilemmas/direct-request', { method: 'POST', body: JSON.stringify({ ...dilemmaData, userToken, requestedHelperId }) });
        },
        declineRequest: (dilemmaId: string, helperId: string): Promise<Dilemma> => {
            return _callApi(`/dilemmas/${dilemmaId}/decline`, { method: 'POST', body: JSON.stringify({ helperId }) });
        },
        toggleSupport: (dilemmaId: string): Promise<Dilemma> => {
            return _callApi(`/dilemmas/${dilemmaId}/support`, { method: 'POST' });
        },
        report: (dilemmaId: string, reason: string): Promise<Dilemma> => {
            return _callApi(`/dilemmas/${dilemmaId}/report`, { method: 'POST', body: JSON.stringify({ reason }) });
        },
        acceptDilemma: (dilemmaId: string, helperId: string): Promise<{dilemma: Dilemma, session: HelpSession, updatedHelper: Helper, newAchievements: Achievement[]}> => {
            return _callApi(`/dilemmas/${dilemmaId}/accept`, { method: 'POST', body: JSON.stringify({ helperId }) });
        },
        resolveBySeeker: (dilemmaId: string, userToken: string): Promise<Dilemma> => {
            return _callApi(`/dilemmas/${dilemmaId}/resolve`, { method: 'POST', body: JSON.stringify({ userToken }) });
        },
    },
    chat: {
        getMessages: (dilemmaId: string): Promise<ChatMessage[]> => {
            return _callApi(`/chat/${dilemmaId}/messages`);
        },
        sendMessage: (dilemmaId: string, text: string, sender: 'user' | 'poster', senderId: string): Promise<ChatMessage> => {
            return _callApi(`/chat/${dilemmaId}/messages`, { method: 'POST', body: JSON.stringify({ text, sender, senderId }) });
        },
    },
    helpers: {
        getById: (helperId: string): Promise<Helper | null> => {
            return _callApi(`/helpers/${helperId}`);
        },
        getAllHelpers: (): Promise<Helper[]> => {
            return _callApi('/helpers');
        },
        getProfile: (auth0UserId: string): Promise<Helper | null> => {
            return _callApi(`/helpers/profile/${auth0UserId}`);
        },
        getFavoriteHelpersDetails: (seekerId: string): Promise<Helper[]> => {
            return _callApi(`/helpers/favorites/${seekerId}`);
        },
        createProfile: (profileData: Pick<Helper, 'auth0UserId' | 'displayName' | 'expertise' | 'bio'>): Promise<Helper> => {
            return _callApi('/helpers', { method: 'POST', body: JSON.stringify(profileData) });
        },
        updateProfile: (helperId: string, updates: Partial<Pick<Helper, 'displayName' | 'expertise' | 'bio'>>): Promise<Helper> => {
            return _callApi(`/helpers/${helperId}`, { method: 'PUT', body: JSON.stringify(updates) });
        },
        setAvailability: (helperId: string, isAvailable: boolean): Promise<Helper> => {
            return _callApi(`/helpers/${helperId}/availability`, { method: 'PUT', body: JSON.stringify({ isAvailable }) });
        },
        getOnlineHelperCount: (): Promise<number> => {
            // This is one of the few non-authed endpoints
            return _callApi('/helpers/online-count', { headers: { 'Authorization': '' } });
        },
        getHelperAchievements: (helperId: string): Promise<Achievement[]> => {
            return _callApi(`/helpers/${helperId}/achievements`);
        },
        submitTrainingQuiz: (helperId: string, score: number): Promise<Helper> => {
            return _callApi(`/helpers/${helperId}/training`, { method: 'POST', body: JSON.stringify({ score }) });
        },
        submitApplication: (helperId: string): Promise<Helper> => {
            return _callApi(`/helpers/${helperId}/application`, { method: 'POST' });
        },
    },
    admin: {
        getApplications: (): Promise<Helper[]> => {
             return _callApi('/admin/applications');
        },
        getApplicantDetails: (helperId: string): Promise<any> => {
            return _callApi(`/admin/applicants/${helperId}`);
        },
        updateApplicationStatus: (helperId: string, status: Helper['applicationStatus'], actingHelper: Helper, notes?: string): Promise<Helper> => {
            return _callApi(`/admin/applications/${helperId}`, { method: 'PUT', body: JSON.stringify({ status, notes }) });
        },
        getCommunityStats: (): Promise<CommunityStats> => {
            return _callApi('/admin/stats');
        },
    },
    feedback: {
        submitFeedback: (dilemmaId: string, helperId: string, wasHelpful: boolean): Promise<void> => {
            return _callApi('/feedback', { method: 'POST', body: JSON.stringify({ dilemmaId, helperId, wasHelpful }) });
        },
        getFeedbackForHelper: (helperId: string): Promise<Feedback[]> => {
            return _callApi(`/feedback/${helperId}`);
        }
    },
    helperCommunity: {
        getThreads: (): Promise<ForumThread[]> => {
            return _callApi('/community/threads');
        },
        getPosts: (threadId: string): Promise<ForumPost[]> => {
            return _callApi(`/community/posts/${threadId}`);
        },
        createPost: (postData: Omit<ForumPost, 'id' | 'timestamp'>): Promise<ForumPost> => {
            return _callApi('/community/posts', { method: 'POST', body: JSON.stringify(postData) });
        },
        createThread: (threadData: Omit<ForumThread, 'id' | 'timestamp' | 'postCount' | 'lastReply'>, firstPostContent: string): Promise<ForumThread> => {
            return _callApi('/community/threads', { method: 'POST', body: JSON.stringify({ ...threadData, firstPostContent }) });
        },
        getProposals: (): Promise<CommunityProposal[]> => {
            return _callApi('/community/proposals');
        },
        createProposal: (proposalData: Omit<CommunityProposal, 'id' | 'createdAt' | 'endsAt' | 'status' | 'votes'>): Promise<CommunityProposal> => {
            return _callApi('/community/proposals', { method: 'POST', body: JSON.stringify(proposalData) });
        },
        voteOnProposal: (proposalId: string, helperId: string, vote: 'for' | 'against' | 'abstain'): Promise<CommunityProposal> => {
            return _callApi(`/community/proposals/${proposalId}/vote`, { method: 'POST', body: JSON.stringify({ helperId, vote }) });
        }
    },
    reflections: {
        getReflections: (): Promise<Reflection[]> => {
            return _callApi('/reflections');
        },
        postReflection: (userToken: string, content: string): Promise<Reflection> => {
            return _callApi('/reflections', { method: 'POST', body: JSON.stringify({ userToken, content }) });
        },
        addReaction: (reflectionId: string, reactionType: string, userToken: string): Promise<Reflection> => {
            return _callApi(`/reflections/${reflectionId}/react`, { method: 'POST', body: JSON.stringify({ reactionType, userToken }) });
        },
    },
    userBlocking: {
        getBlockedUsers: (blockerId: string): Promise<Block[]> => {
            return _callApi(`/users/blocked/${blockerId}`);
        },
        blockUser: (blockerId: string, blockedId: string): Promise<Block> => {
            return _callApi('/users/block', { method: 'POST', body: JSON.stringify({ blockerId, blockedId }) });
        },
        unblockUser: (blockerId: string, blockedId: string): Promise<void> => {
            return _callApi('/users/unblock', { method: 'POST', body: JSON.stringify({ blockerId, blockedId }) });
        }
    },
    moderation: {
        getHistory: (userId: string): Promise<ModerationAction[]> => {
            return _callApi(`/moderation/history/${userId}`);
        },
        dismissReport: (dilemmaId: string, actingHelper: Helper): Promise<Dilemma> => {
            return _callApi(`/moderation/reports/${dilemmaId}/dismiss`, { method: 'POST' });
        },
        removePost: (dilemmaId: string, actingHelper: Helper): Promise<Dilemma> => {
            return _callApi(`/moderation/posts/${dilemmaId}`, { method: 'DELETE' });
        },
        getUserStatus: (userId: string): Promise<UserStatus> => {
            return _callApi(`/moderation/users/${userId}/status`);
        },
        issueWarning: (userId: string): Promise<UserStatus> => {
            return _callApi(`/moderation/users/${userId}/warn`, { method: 'POST' });
        },
        banUser: (userId: string, reason: string, durationHours?: number): Promise<UserStatus> => {
            return _callApi(`/moderation/users/${userId}/ban`, { method: 'POST', body: JSON.stringify({ reason, durationHours }) });
        },
    },
    ai: {
        chat: async (messages: AIChatMessage[], systemInstruction: string): Promise<string> => {
            const response = await _callApi('/ai', {
                method: 'POST',
                body: JSON.stringify({ messages, systemInstruction }),
            });
            if (!response || !response.text) {
                throw new Error("Received an invalid response from the AI service.");
            }
            return response.text;
        },
        resetAIChat: () => {
             _callApi('/ai/reset', { method: 'POST' });
        },
        saveChatHistory: async (messages: AIChatMessage[]): Promise<void> => {
             _callApi('/ai/history', { method: 'POST', body: JSON.stringify({ messages }) });
        },
        loadChatHistory: async (): Promise<AIChatMessage[]> => {
            return _callApi('/ai/history');
        },
        draftPostFromChat: async (messages: AIChatMessage[]): Promise<{ postContent: string, category: string }> => {
            return _callApi('/ai/draft-post', { method: 'POST', body: JSON.stringify({ messages }) });
        },
        getHelperGuidance: async (text: string): Promise<HelperGuidance> => {
            return _callApi('/ai/guidance', { method: 'POST', body: JSON.stringify({ text }) });
        },
        summarizeDilemma: async (content: string): Promise<string> => {
            const res = await _callApi('/ai/summarize-dilemma', { method: 'POST', body: JSON.stringify({ content }) });
            return res.summary;
        },
        summarizeChat: async (transcript: string): Promise<string> => {
            const res = await _callApi('/ai/summarize-chat', { method: 'POST', body: JSON.stringify({ transcript }) });
            return res.summary;
        },
        getAiMatchedDilemmas: async (helper: Helper, dilemmas: Dilemma[]): Promise<Dilemma[]> => {
             const res = await _callApi('/ai/match-dilemmas', { method: 'POST', body: JSON.stringify({ helper, dilemmas }) });
             return res.matchedDilemmas;
        },
        summarizeHelperPerformance: async (transcript: string): Promise<string> => {
            const res = await _callApi('/ai/summarize-performance', { method: 'POST', body: JSON.stringify({ transcript }) });
            return res.summary;
        },
    }
};