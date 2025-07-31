// --- Interfaces ---
export interface Dilemma {
  id: string;
  userToken: string;
  category: string;
  content: string;
  timestamp: string;
  supportCount: number;
  isSupported: boolean;
  isReported: boolean;
  reportReason?: string;
  status: 'active' | 'in_progress' | 'resolved' | 'direct_request' | 'declined' | 'removed_by_moderator';
  assignedHelperId?: Helper['id'];
  helperDisplayName?: string;
  resolved_by_seeker?: boolean;
  requestedHelperId?: Helper['id'];
  summary?: string;
  summaryLoading?: boolean;
  moderation?: {
    action: 'removed' | 'dismissed';
    timestamp: string;
    moderatorId: string;
  }
  aiMatchReason?: string;
}

export interface Helper {
    id: string; // Internal UUID
    auth0UserId: string; // From Auth0
    displayName: string;
    bio: string;
    joinDate: string;
    helperType: 'Community' | 'Certified';
    role: 'Community' | 'Certified' | 'Moderator' | 'Admin';
    reputation: number;
    isAvailable: boolean;
    expertise: string[];
    kudosCount?: number;
    achievements?: Achievement[];
    xp: number;
    level: number;
    nextLevelXp: number;
    applicationStatus: 'none' | 'pending' | 'approved' | 'rejected';
    applicationNotes?: string;
    trainingCompleted: boolean;
    quizScore?: number;
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'poster';
    text: string;
    timestamp: string;
}

export interface ChatSession {
    dilemmaId: string;
    messages: ChatMessage[];
    unread: boolean;
    isTyping?: boolean;
    perspective?: 'seeker' | 'helper';
    helpSessionId?: string;
    helper?: Helper;
}

export interface AIChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
}

export interface AIChatSession {
    messages: AIChatMessage[];
    isTyping?: boolean;
}

export interface AnalysisResult {
  sentiment: 'Positive' | 'Negative' | 'Neutral' | '';
  isCrisis: boolean;
}

export interface Toast {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export interface ConfirmationModalState {
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger' | 'success' | 'secondary';
}

export interface Resource {
    id: string;
    title: string;
    description: string;
    link: string;
    category: 'Crisis Support' | 'Anxiety' | 'Depression' | 'Coping Strategies' | 'Grief';
    contact?: string;
}


export interface CrisisResource {
    title: string;
    contact: string;
}

export interface HelperGuidance {
    dilemmaId: string;
    isCrisis: boolean;
    flagReason: string;
    suggestedResponses: string[];
    suggestedResources: CrisisResource[];
}

export interface Feedback {
  dilemmaId: string;
  helperId: string;
  wasHelpful: boolean;
}

export interface ForumThread {
    id: string;
    title: string;
    authorId: string; // Helper ID
    authorName: string; // Helper display name
    timestamp: string;
    postCount: number;
    lastReply: string; // timestamp
}

export interface ForumPost {
    id: string;
    threadId: string;
    authorId: string; // Helper ID
    authorName: string; // Helper display name
    content: string;
    timestamp: string;
}

export interface CommunityProposal {
    id: string;
    title: string;
    description: string;
    authorId: string; // Helper ID
    authorName: string;
    status: 'open' | 'closed';
    createdAt: string;
    endsAt: string;
    votes: {
        for: number;
        against: number;
        abstain: number;
    }
}

export interface CommunityVote {
    proposalId: string;
    helperId: string;
    vote: 'for' | 'against' | 'abstain';
}

export interface Reflection {
    id: string;
    userToken: string; // Anonymous user token
    content: string;
    timestamp: string;
    reactions: { [type: string]: number }; // e.g. { light: 12 }
    myReaction?: string; // The reaction type the current user has given, if any
}

export interface Block {
    blockerId: string; // ID of the user initiating the block
    blockedId: string; // ID of the user being blocked
    timestamp: string;
}

export interface ModerationAction {
    id: string;
    userId: string; // The user who was moderated
    action: string; // e.g., 'Post Removed', 'Warning Issued'
    reason: string;
    timestamp: string;
    relatedContentId?: string; // ID of the post/comment
}

export interface UserStatus {
    userId: string; // Can be anonymous userToken or helperId
    warnings: number;
    isBanned: boolean;
    banReason?: string;
    banExpires?: string;
}

export interface HelpSession {
    id: string;
    dilemmaId: string;
    seekerId: string;
    helperId: string;
    helperDisplayName: string;
    startedAt: string;
    endedAt?: string;
    isFavorited: boolean;
    kudosGiven?: boolean;
    summary?: string;
    summaryLoading?: boolean;
    helperSummary?: string;
    helperSummaryLoading?: boolean;
}

export interface CommunityStats {
    activeDilemmas: number;
    avgTimeToFirstSupport: string; // e.g., "5m 30s"
    totalHelpers: number;
    mostCommonCategory: string;
}

export interface SafetyPlan {
    triggers: string;
    copingStrategies: string;
    supportContacts: string;
    safePlaces: string;
}

export interface LegalConsentRecord {
    userId: string;
    userType: string;
    documentType: string;
    documentVersion: string;
    consentTimestamp: string;
}

export interface WellnessVideo {
    id: string;
    videoUrl: string;
    userToken: string;
    description: string;
    likes: number;
    comments: number;
    shares: number;
    timestamp: string;
    isLiked: boolean; // Client-side state
}

export interface MoodCheckIn {
  id: string;
  userToken: string;
  timestamp: string;
  moodScore: number; // 1-5
  anxietyLevel: number; // 1-5
  sleepQuality: number; // 1-5
  energyLevel: number; // 1-5
  tags: string[];
  notes?: string;
}

export interface Habit {
  id: string;
  name: string;
  description: string;
  category: 'Mindfulness' | 'Physical' | 'Social' | 'Self-Care';
}

export interface TrackedHabit {
  userId: string;
  habitId: string;
  trackedAt: string;
  currentStreak: number;
  longestStreak: number;
  isCompletedToday: boolean;
}

export interface HabitCompletion {
  id: string;
  userId: string;
  habitId: string;
  completedAt: string; // ISO date string (YYYY-MM-DD)
}

export interface AssessmentQuestion {
    id: string;
    text: string;
    options: { text: string; value: number }[];
}

export interface AssessmentResult {
    score: number;
    severity: string;
    recommendation: string;
}

export interface Assessment {
    id: string;
    userToken: string;
    type: 'phq-9' | 'gad-7';
    timestamp: string;
    score: number;
    answers: number[];
}

export interface JournalEntry {
  id: string;
  userToken: string;
  timestamp: string;
  content: string;
}


export type View = 'share' | 'feed' | 'crisis' | 'settings' | 'guidelines' | 'login' | 'legal' | 'dashboard' | 'my-activity' | 'safety-plan' | 'quiet-space' | 'ai-chat' | 'video-chat' | 'create-profile' | 'helper-profile' | 'helper-training' | 'helper-community' | 'reflections' | 'moderation-history' | 'blocked-users' | 'public-helper-profile' | 'moderation-dashboard' | 'admin-dashboard' | 'helper-application' | 'donation' | 'wellness-videos' | 'upload-video' | 'wellness-tracking' | 'assessments' | 'assessment-history' | 'assessment-detail';
export type ActiveView = { view: View; params?: any };
export type SortOption = 'newest' | 'most-support' | 'needs-support';
export type Theme = 'light' | 'dark';