import { Dilemma, Helper, HelpSession, ChatMessage, Feedback, Reflection, Block, LegalConsentRecord, SafetyPlan, WellnessVideo, MoodCheckIn, Habit, HabitCompletion, Assessment, Resource, JournalEntry, Achievement } from "../../../src/types";

// ========================================================================
// MOCK DATABASE - In a real application, this file would be replaced
// with a database client (e.g., Prisma, Kysely, node-postgres) that
// connects to a real database like PostgreSQL.
// ========================================================================

let dilemmas: Dilemma[] = [
    {
        id: 'mock-dilemma-1',
        userToken: 'user-token-123',
        category: 'Relationships',
        content: "I had a big fight with my partner and I don't know what to do. I feel like they don't understand me at all, and I'm tired of explaining myself. It just feels like we're growing apart.",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        supportCount: 3,
        isSupported: false,
        isReported: false,
        status: 'active',
    },
    {
        id: 'mock-dilemma-2',
        userToken: 'user-token-456',
        category: 'Anxiety',
        content: 'I have a job interview tomorrow for a position I really want, and my anxiety is through the roof. I keep thinking about all the ways I could mess it up. Any advice on how to stay calm would be appreciated.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        supportCount: 12,
        isSupported: false,
        isReported: false,
        status: 'active',
    }
];
let helpers: Helper[] = [];
let sessions: HelpSession[] = [];
let chatMessages: Record<string, ChatMessage[]> = {};
let feedbackStore: Feedback[] = [];
let reflections: Reflection[] = [];
let blockedUsers: Block[] = [];
let legalConsents: LegalConsentRecord[] = [];
let safetyPlans: Record<string, SafetyPlan> = {};
let wellnessVideos: WellnessVideo[] = [
    { id: 'vid1', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', userToken: 'vid-user-1', description: 'Just a moment of calm. Remember to breathe. #mindfulness #calm', likes: 1523, comments: 102, shares: 45, timestamp: new Date(Date.now() - 86400000).toISOString(), isLiked: false },
    { id: 'vid2', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', userToken: 'vid-user-2', description: 'Sharing a quick tip that helped me today! Hope it helps you too. #copingskills #anxietyrelief', likes: 3410, comments: 250, shares: 112, timestamp: new Date(Date.now() - 172800000).toISOString(), isLiked: false },
    { id: 'vid3', videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', userToken: 'vid-user-3', description: 'You are stronger than you think. Keep going. #motivation #mentalstrength', likes: 5800, comments: 430, shares: 230, timestamp: new Date(Date.now() - 259200000).toISOString(), isLiked: false },
];
let moodCheckIns: MoodCheckIn[] = [];
let predefinedHabits: Habit[] = [
    { id: 'h1', name: '5-Minute Meditation', description: 'Take a short break to focus on your breath.', category: 'Mindfulness' },
    { id: 'h2', name: 'Go for a Walk', description: 'Step outside for some fresh air and light exercise.', category: 'Physical' },
    { id: 'h3', name: 'Journal for 10 Minutes', description: 'Write down your thoughts and feelings without judgment.', category: 'Self-Care' },
];
let trackedHabits: Record<string, string[]> = {};
let habitCompletions: HabitCompletion[] = [];
let assessments: Assessment[] = [];
let preferences: Record<string, any> = {};
let resources: Resource[] = [
    { id: 'res1', title: '988 Suicide & Crisis Lifeline', description: 'Free, confidential support for people in distress, prevention and crisis resources.', link: '#', contact: 'Call or Text 988', category: 'Crisis Support' },
    { id: 'res2', title: 'Crisis Text Line', description: 'Connect with a volunteer Crisis Counselor for free, 24/7 support via text message.', link: '#', contact: 'Text HOME to 741741', category: 'Crisis Support' },
];
let journalEntries: JournalEntry[] = [];

const PREDEFINED_ACHIEVEMENTS: Achievement[] = [
    { id: 'ach_first_step', name: 'First Step', description: 'Supported your first post.', icon: 'HeartIcon' },
    { id: 'ach_five_a_day', name: 'Helping Hand', description: 'Supported 5 posts.', icon: 'PostsIcon' },
    { id: 'ach_first_kudos', name: 'Heartfelt Thanks', description: 'Received your first Kudos.', icon: 'KudosIcon' },
    { id: 'ach_trusted_voice', name: 'Trusted Voice', description: 'Received 10 Kudos.', icon: 'KudosIcon' },
    { id: 'ach_community_pillar', name: 'Community Pillar', description: 'Supported 25 posts.', icon: 'PostsIcon' },
];


// --- Dilemma Functions ---
export const getDilemmas = async (): Promise<Dilemma[]> => Promise.resolve(dilemmas);
export const getDilemmaById = async (id: string): Promise<Dilemma | undefined> => Promise.resolve(dilemmas.find(d => d.id === id));
export const createDilemma = async (data: Omit<Dilemma, 'id'>): Promise<Dilemma> => {
    const newDilemma: Dilemma = { ...data, id: crypto.randomUUID() };
    dilemmas.unshift(newDilemma);
    return Promise.resolve(newDilemma);
};
export const updateDilemma = async (id: string, updates: Partial<Dilemma>): Promise<Dilemma | null> => {
    const index = dilemmas.findIndex(d => d.id === id);
    if (index === -1) return null;
    dilemmas[index] = { ...dilemmas[index], ...updates };
    return Promise.resolve(dilemmas[index]);
};

// --- Helper Functions ---
export const getHelpers = async (): Promise<Helper[]> => Promise.resolve(helpers);
export const getHelperById = async (id: string): Promise<Helper | undefined> => Promise.resolve(helpers.find(h => h.id === id));
export const getHelperByAuth0Id = async (auth0Id: string): Promise<Helper | undefined> => Promise.resolve(helpers.find(h => h.auth0UserId === auth0Id));
export const createHelper = async (data: Omit<Helper, 'id'>): Promise<Helper> => {
    const newHelper: Helper = { ...data, id: crypto.randomUUID() };
    helpers.push(newHelper);
    return Promise.resolve(newHelper);
}
export const updateHelper = async (id: string, updates: Partial<Helper>): Promise<Helper | null> => {
    const index = helpers.findIndex(h => h.id === id);
    if (index === -1) return null;
    helpers[index] = { ...helpers[index], ...updates };
    return Promise.resolve(helpers[index]);
};

// --- Session Functions ---
export const getSessions = async (): Promise<HelpSession[]> => Promise.resolve(sessions);
export const getSessionById = async(id: string): Promise<HelpSession | undefined> => Promise.resolve(sessions.find(s => s.id === id));
export const createSession = async (data: Omit<HelpSession, 'id'>): Promise<HelpSession> => {
    const newSession: HelpSession = { ...data, id: crypto.randomUUID() };
    sessions.push(newSession);
    return Promise.resolve(newSession);
};
export const updateSession = async (id: string, updates: Partial<HelpSession>): Promise<HelpSession | null> => {
     const index = sessions.findIndex(s => s.id === id);
    if (index === -1) return null;
    sessions[index] = { ...sessions[index], ...updates };
    return Promise.resolve(sessions[index]);
}

// --- Chat Functions ---
export const getChatMessages = async (dilemmaId: string): Promise<ChatMessage[]> => Promise.resolve(chatMessages[dilemmaId] || []);
export const createChatMessage = async (dilemmaId: string, message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> => {
    if (!chatMessages[dilemmaId]) {
        chatMessages[dilemmaId] = [];
    }
    const newMessage = { ...message, id: crypto.randomUUID() };
    chatMessages[dilemmaId].push(newMessage);
    return Promise.resolve(newMessage);
};

// --- Feedback Functions ---
export const createFeedback = async (feedback: Feedback): Promise<Feedback> => {
    feedbackStore.push(feedback);
    // In real DB, update helper reputation
    return Promise.resolve(feedback);
};
export const getFeedbackForHelper = async (helperId: string): Promise<Feedback[]> => Promise.resolve(feedbackStore.filter(f => f.helperId === helperId));

// --- Reflections ---
export const getReflections = async (): Promise<Reflection[]> => Promise.resolve(reflections);
export const getReflectionById = async (id: string): Promise<Reflection | undefined> => Promise.resolve(reflections.find(r => r.id === id));
export const createReflection = async (data: Omit<Reflection, 'id'>): Promise<Reflection> => {
    const newReflection = { ...data, id: crypto.randomUUID() };
    reflections.unshift(newReflection);
    return Promise.resolve(newReflection);
}
export const updateReflection = async (id: string, updates: Partial<Reflection>): Promise<Reflection | null> => {
     const index = reflections.findIndex(r => r.id === id);
    if (index === -1) return null;
    reflections[index] = { ...reflections[index], ...updates };
    return Promise.resolve(reflections[index]);
}

// --- User Management ---
export const getBlockedUsers = async(blockerId: string): Promise<Block[]> => Promise.resolve(blockedUsers.filter(b => b.blockerId === blockerId));
export const blockUser = async(block: Omit<Block, 'timestamp'>): Promise<Block> => {
    const newBlock = { ...block, timestamp: new Date().toISOString() };
    blockedUsers.push(newBlock);
    return Promise.resolve(newBlock);
}
export const unblockUser = async(blockerId: string, blockedId: string): Promise<void> => {
    blockedUsers = blockedUsers.filter(b => !(b.blockerId === blockerId && b.blockedId === blockedId));
    return Promise.resolve();
}
export const getSafetyPlan = async(userId: string): Promise<SafetyPlan | null> => Promise.resolve(safetyPlans[userId] || null);
export const saveSafetyPlan = async(userId: string, plan: SafetyPlan): Promise<void> => {
    safetyPlans[userId] = plan;
    return Promise.resolve();
}
export const getPreferences = async(userId: string): Promise<any> => Promise.resolve(preferences[userId] || { researchConsent: false });
export const savePreferences = async(userId: string, prefs: any): Promise<void> => {
    preferences[userId] = prefs;
    return Promise.resolve();
}

// --- Legal ---
export const getConsent = async (userId: string, docType: string): Promise<LegalConsentRecord | undefined> => {
    return Promise.resolve(legalConsents.find(c => c.userId === userId && c.documentType === docType));
};
export const recordConsent = async (consent: Omit<LegalConsentRecord, 'consentTimestamp'>): Promise<void> => {
    const newRecord = { ...consent, consentTimestamp: new Date().toISOString() };
    const existingIndex = legalConsents.findIndex(c => c.userId === newRecord.userId && c.documentType === newRecord.documentType);
    if (existingIndex > -1) {
        legalConsents[existingIndex] = newRecord;
    } else {
        legalConsents.push(newRecord);
    }
    return Promise.resolve();
}

// --- Wellness ---
export const getVideos = async(): Promise<WellnessVideo[]> => Promise.resolve(wellnessVideos);
export const getVideoById = async(id: string): Promise<WellnessVideo | undefined> => Promise.resolve(wellnessVideos.find(v => v.id === id));
export const updateVideo = async(id: string, updates: Partial<WellnessVideo>): Promise<WellnessVideo | null> => {
    const index = wellnessVideos.findIndex(v => v.id === id);
    if (index === -1) return null;
    wellnessVideos[index] = { ...wellnessVideos[index], ...updates };
    return Promise.resolve(wellnessVideos[index]);
}
export const createVideo = async(data: Omit<WellnessVideo, 'id'>): Promise<WellnessVideo> => {
    const newVideo = { ...data, id: crypto.randomUUID() };
    wellnessVideos.unshift(newVideo);
    return Promise.resolve(newVideo);
}
export const getMoods = async(userId: string): Promise<MoodCheckIn[]> => Promise.resolve(moodCheckIns.filter(m => m.userToken === userId));
export const createMood = async(mood: Omit<MoodCheckIn, 'id'>): Promise<MoodCheckIn> => {
    const newMood = { ...mood, id: crypto.randomUUID() };
    moodCheckIns.push(newMood);
    return Promise.resolve(newMood);
}
export const getPredefinedHabits = async(): Promise<Habit[]> => Promise.resolve(predefinedHabits);
export const getTrackedHabitIds = async(userId: string): Promise<string[]> => Promise.resolve(trackedHabits[userId] || []);
export const trackHabit = async(userId: string, habitId: string): Promise<void> => {
    if (!trackedHabits[userId]) trackedHabits[userId] = [];
    if (!trackedHabits[userId].includes(habitId)) trackedHabits[userId].push(habitId);
    return Promise.resolve();
}
export const untrackHabit = async(userId: string, habitId: string): Promise<void> => {
    if (trackedHabits[userId]) {
        trackedHabits[userId] = trackedHabits[userId].filter(id => id !== habitId);
    }
    return Promise.resolve();
}
export const getCompletions = async(userId: string): Promise<HabitCompletion[]> => Promise.resolve(habitCompletions.filter(c => c.userId === userId));
export const createCompletion = async(completion: Omit<HabitCompletion, 'id'>): Promise<HabitCompletion> => {
    const newCompletion = { ...completion, id: crypto.randomUUID() };
    habitCompletions.push(newCompletion);
    return Promise.resolve(newCompletion);
}
export const getAssessments = async(userId: string): Promise<Assessment[]> => Promise.resolve(assessments.filter(a => a.userToken === userId));
export const createAssessment = async(assessment: Omit<Assessment, 'id'>): Promise<Assessment> => {
    const newAssessment = { ...assessment, id: crypto.randomUUID() };
    assessments.push(newAssessment);
    return Promise.resolve(newAssessment);
}
export const getResources = async(): Promise<Resource[]> => Promise.resolve(resources);
export const getJournalEntries = async(userId: string): Promise<JournalEntry[]> => Promise.resolve(journalEntries.filter(j => j.userToken === userId));
export const createJournalEntry = async(entry: Omit<JournalEntry, 'id'>): Promise<JournalEntry> => {
    const newEntry = { ...entry, id: crypto.randomUUID() };
    journalEntries.push(newEntry);
    return Promise.resolve(newEntry);
}

// --- Achievements ---
export const checkAndAwardAchievements = async (helperId: string): Promise<{ updatedHelper: Helper, newAchievements: Achievement[] }> => {
    const helper = await getHelperById(helperId);
    if (!helper) {
        throw new Error('Helper not found for achievement check');
    }

    const newAchievements: Achievement[] = [];
    const helperAchievements = new Set(helper.achievements?.map(a => a.id) || []);

    const check = (id: string, condition: boolean) => {
        if (condition && !helperAchievements.has(id)) {
            const achievement = PREDEFINED_ACHIEVEMENTS.find(a => a.id === id)!;
            newAchievements.push(achievement);
            helperAchievements.add(achievement.id);
        }
    };

    const supportedSessions = sessions.filter(s => s.helperId === helperId);

    check('ach_first_step', supportedSessions.length >= 1);
    check('ach_five_a_day', supportedSessions.length >= 5);
    check('ach_community_pillar', supportedSessions.length >= 25);
    check('ach_first_kudos', (helper.kudosCount || 0) >= 1);
    check('ach_trusted_voice', (helper.kudosCount || 0) >= 10);

    if (newAchievements.length > 0) {
        const updatedAchievements = PREDEFINED_ACHIEVEMENTS.filter(a => helperAchievements.has(a.id));
        await updateHelper(helperId, { achievements: updatedAchievements });
        const updatedHelper = await getHelperById(helperId);
        return { updatedHelper: updatedHelper!, newAchievements };
    }

    return { updatedHelper: helper, newAchievements: [] };
};