# AstralCore File Structure

## 📁 Root Directory
```
AstralCore/
├── claude-web-review/          # Documentation for Claude web review
├── .storybook/                 # Storybook configuration
├── netlify/functions/          # Backend serverless functions
├── src/                        # Main source code
├── index.html                  # Main HTML entry point
├── index.tsx                   # React app entry point
├── index.css                   # Global styles
├── package.json                # Dependencies and scripts
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── netlify.toml               # Netlify deployment config
└── .env.local                 # Environment variables (local)
```

## 🎨 Components (`src/components/`)

### Core UI Components
- **AppButton.tsx** - Primary button component with variants
- **AppInput.tsx** - Form input component with validation
- **Modal.tsx** - Reusable modal/dialog system
- **Toast.tsx** - Notification system with toast messages
- **Card.tsx** - Content container component
- **Sidebar.tsx** - Main navigation sidebar

### Specialized Components
- **PostCard.tsx** - Display user dilemma/support posts
- **ReflectionCard.tsx** - Wellness reflection entries
- **CrisisAlert.tsx** - Emergency crisis intervention alerts
- **VideoPlayer.tsx** - Video content playback
- **XPBar.tsx** - Gamification progress bars
- **TypingIndicator.tsx** - Real-time typing feedback

### Helper Components
- **HelperSidebar.tsx** - Navigation for helper users
- **SeekerSidebar.tsx** - Navigation for seeker users
- **GuidancePanel.tsx** - Contextual help and tips
- **ReportModal.tsx** - Content reporting system

### Utility Components
- **EmptyState.tsx** - Empty list/content placeholders
- **SkeletonPostCard.tsx** - Loading skeleton for posts
- **AnimatedNumber.tsx** - Animated numeric displays
- **ViewHeader.tsx** - Page header component
- **icons.tsx** - SVG icon library (40+ icons)

## 🧠 Contexts (`src/contexts/`)
- **AuthContext.tsx** - Authentication state management
- **AuthContext.expo.tsx** - Backup of original Expo auth
- **NotificationContext.tsx** - Toast and confirmation system
- **ThemeContext.tsx** - Dark/light theme switching
- **ChatContext.tsx** - Real-time chat state
- **DilemmaContext.tsx** - Post/dilemma management
- **SessionContext.tsx** - Video chat sessions
- **WellnessContext.tsx** - Wellness tracking state

## 🗃️ State Management (`src/stores/`)

### Zustand Stores
- **dilemmaStore.ts** - Posts, reports, and content management
- **chatStore.ts** - Chat sessions and messaging
- **sessionStore.ts** - Video/voice call sessions
- **wellnessStore.ts** - Health tracking and habits
- **assessmentStore.ts** - Mental health assessments
- **preferenceStore.ts** - User preferences and settings

### Store Tests
- **dilemmaStore.test.ts** - Dilemma store unit tests
- **chatStore.test.ts** - Chat functionality tests
- **sessionStore.test.ts** - Session management tests
- **wellnessStore.test.ts** - Wellness tracking tests
- **assessmentStore.test.ts** - Assessment logic tests

## 📱 Views/Pages (`src/views/`)

### Core Views
- **FeedView.tsx** - Main community feed
- **ShareView.tsx** - Create new posts/dilemmas
- **ChatView.tsx** - One-on-one chat interface
- **VideoChatView.tsx** - Video call interface

### User Management
- **LoginView.tsx** - Authentication page
- **SettingsView.tsx** - User preferences
- **CreateHelperProfileView.tsx** - Helper onboarding
- **HelperProfileView.tsx** - Helper profile management
- **PublicHelperProfileView.tsx** - Public helper profiles

### Mental Health Tools
- **AssessmentsView.tsx** - Mental health assessments list
- **AssessmentDetailView.tsx** - Individual assessment interface
- **AssessmentHistoryView.tsx** - Assessment progress tracking
- **WellnessView.tsx** - Wellness dashboard
- **SafetyPlanView.tsx** - Crisis safety planning
- **QuietSpaceView.tsx** - Mindfulness and calm space

### Helper Features
- **HelperDashboardView.tsx** - Helper control panel
- **HelperApplicationView.tsx** - Helper application process
- **HelperTrainingView.tsx** - Training modules
- **HelperCommunityView.tsx** - Helper-only community

### Admin/Moderation
- **ModerationDashboardView.tsx** - Content moderation tools
- **ModerationHistoryView.tsx** - Moderation log
- **AdminDashboardView.tsx** - Admin control panel
- **BlockedUsersView.tsx** - User blocking management

### Additional Features
- **AIChatView.tsx** - AI companion chat
- **WellnessVideosView.tsx** - Wellness content library
- **UploadVideoView.tsx** - Content upload interface
- **CrisisResourcesView.tsx** - Crisis support resources
- **ReflectionsView.tsx** - Personal journaling
- **MyActivityView.tsx** - User activity history
- **LegalView.tsx** - Terms, privacy, agreements
- **DonationView.tsx** - Platform support donations

## 🔧 Utilities (`src/utils/`)
- **ApiClient.ts** - HTTP client with smart fallbacks
- **assessmentUtils.ts** - PHQ-9/GAD-7 assessment logic
- **chartUtils.ts** - Data visualization helpers
- **formatTimeAgo.ts** - Human-readable time formatting
- **habitUtils.ts** - Habit tracking calculations
- **truncateText.ts** - Text truncation utilities

## 🎣 Hooks (`src/hooks/`)
- **useAIChat.ts** - AI conversation management
- **useInterval.ts** - Interval timer hook
- **useIntersectionObserver.ts** - Scroll-based triggers

## 🔐 Services (`src/services/`)
- **authService.ts** - Authentication helpers
- **notificationService.ts** - Notification management

## 🌐 Backend (`netlify/functions/`)
- **ai.ts** - Gemini AI integration
- **chat.ts** - Chat message handling
- **dilemmas.ts** - Post management API
- **helpers.ts** - Helper profile API
- **users.ts** - User management API
- **sessions.ts** - Video session API
- **wellness.ts** - Wellness data API
- **reflections.ts** - Journaling API
- **feedback.ts** - User feedback API
- **lib/database.ts** - Database utilities

## 📋 Configuration Files
- **vite.config.ts** - Build configuration
- **tsconfig.json** - TypeScript settings
- **jest.config.js** - Testing configuration
- **jest-setup.ts** - Test environment setup
- **netlify.toml** - Deployment configuration
- **.gitignore** - Git exclusions
- **package.json** - Dependencies and scripts

## 🎨 Styling
- **index.css** - Global styles and CSS variables
- Component-specific styles are included within TSX files

## 📚 Documentation
- **README.md** - Project overview
- **PROJECT_STATUS.md** - Current development status
- **metadata.json** - Project metadata
- **claude-web-review/** - Documentation for Claude web analysis

## 🧪 Testing
- **src/test-utils.tsx** - Testing utilities
- **jest-setup.ts** - Jest configuration
- Various `*.test.tsx` files throughout components and stores

This structure follows React best practices with clear separation of concerns, making it easy to navigate and maintain the codebase.