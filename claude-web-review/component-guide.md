# AstralCore Component Guide

## 🎨 Core UI Components

### AppButton
**Purpose**: Primary button component with multiple variants and states
**Location**: `src/components/AppButton.tsx`

```typescript
interface AppButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  onClick: () => void
  children: React.ReactNode
}
```

**Features**:
- Accessible with ARIA attributes
- Loading states with spinner
- Keyboard navigation support
- Multiple visual variants
- Hover and focus states

### Modal System
**Purpose**: Reusable dialog/modal component for overlays
**Location**: `src/components/Modal.tsx`

```typescript
interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  title?: string
  isDismissible?: boolean
  children: React.ReactNode
}
```

**Features**:
- Focus trapping
- ESC key closing
- Backdrop click dismissal
- Portal rendering
- Accessible modal dialog

### Toast Notifications
**Purpose**: User feedback system with temporary messages
**Location**: `src/components/Toast.tsx`

```typescript
interface ToastProps {
  message: string
  type: 'info' | 'success' | 'error' | 'warning'
  duration?: number
  onClose: () => void
}
```

**Features**:
- Auto-dismiss timers
- Multiple notification types
- Queue management
- Slide-in animations
- Action buttons support

## 📱 Layout Components

### Sidebar Navigation
**Purpose**: Main application navigation
**Location**: `src/components/Sidebar.tsx`

**Features**:
- Responsive collapsing
- Role-based menu items
- Active state indication
- Online helper counter
- User authentication status

### ViewHeader
**Purpose**: Consistent page headers
**Location**: `src/components/ViewHeader.tsx`

```typescript
interface ViewHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  showBack?: boolean
  onBack?: () => void
}
```

## 💬 Communication Components

### PostCard
**Purpose**: Display community posts/dilemmas
**Location**: `src/components/PostCard.tsx`

**Key Features**:
- Anonymous user display
- Support/upvote system
- Report functionality
- Time formatting
- Content truncation
- Crisis alert integration

### Chat Interface
**Purpose**: Real-time messaging between users
**Location**: `src/views/ChatView.tsx`

**Features**:
- Message bubbles
- Typing indicators
- Message status (sent/delivered/read)
- File sharing capability
- Crisis intervention alerts

### Video Chat
**Purpose**: Face-to-face support sessions
**Location**: `src/views/VideoChatView.tsx`

**Features**:
- WebRTC integration
- Camera/microphone controls
- Screen sharing
- Chat overlay
- Session recording (optional)

## 🧠 Mental Health Components

### Assessment Interface
**Purpose**: PHQ-9 and GAD-7 mental health assessments
**Location**: `src/views/AssessmentDetailView.tsx`

**Features**:
- Progress tracking
- Question validation
- Score calculation
- Results interpretation
- History tracking

### Wellness Dashboard
**Purpose**: Personal wellness tracking
**Location**: `src/views/WellnessView.tsx`

**Features**:
- Mood tracking charts
- Habit completion tracking
- Progress visualization
- Goal setting
- Reflection integration

### Crisis Alert System
**Purpose**: Emergency intervention interface
**Location**: `src/components/CrisisAlert.tsx`

**Features**:
- Immediate resource display
- Emergency contacts
- Professional referrals
- Safety planning tools
- Escalation protocols

## 🎯 Specialized Components

### XP Bar (Gamification)
**Purpose**: Progress visualization for user engagement
**Location**: `src/components/XPBar.tsx`

```typescript
interface XPBarProps {
  currentXP: number
  maxXP: number
  level: number
  showLabels?: boolean
}
```

### Animated Number
**Purpose**: Smooth number transitions for statistics
**Location**: `src/components/AnimatedNumber.tsx`

**Features**:
- Smooth counting animations
- Configurable duration
- Format customization
- Accessibility support

### Typing Indicator
**Purpose**: Real-time typing feedback in chats
**Location**: `src/components/TypingIndicator.tsx`

**Features**:
- Animated dots
- User identification
- Auto-timeout
- Multiple user support

## 🔧 Utility Components

### Empty State
**Purpose**: Placeholder for empty lists/content
**Location**: `src/components/EmptyState.tsx`

```typescript
interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  illustration?: React.ReactNode
}
```

### Loading Skeletons
**Purpose**: Content placeholders during loading
**Location**: `src/components/SkeletonPostCard.tsx`

**Features**:
- Realistic content shapes
- Shimmer animations
- Multiple layout options
- Accessibility labels

### Icon Library
**Purpose**: Comprehensive SVG icon system
**Location**: `src/components/icons.tsx`

**Available Icons** (40+ icons):
- Navigation: ShareIcon, FeedIcon, SettingsIcon
- Communication: SendIcon, VideoIcon, MicOnIcon
- Mental Health: HeartIcon, WellnessIcon, CrisisIcon
- User Actions: ThumbsUpIcon, ReportIcon, LogoutIcon
- UI Elements: CloseIcon, BackIcon, PlusIcon

## 🎨 Styling Approach

### CSS Variables
Global design tokens in `index.css`:
```css
:root {
  --color-primary: #3498db;
  --color-success: #2ecc71;
  --color-danger: #e74c3c;
  --color-warning: #f39c12;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 2rem;
}
```

### Component Styling
- CSS-in-JS approach with styled components
- Responsive design principles
- Dark/light theme support
- Accessibility-first styling

## 🔄 State Management Integration

### Zustand Store Connection
Components connect to stores using custom hooks:

```typescript
// Example: Dilemma management
const { dilemmas, postDilemma, reportDilemma } = useDilemmaStore()

// Example: Chat functionality  
const { activeChat, sendMessage, getHistory } = useChatStore()

// Example: User authentication
const { isAuthenticated, user, login, logout } = useAuth()
```

## 📱 Responsive Design

### Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

### Adaptive Features
- Collapsible navigation
- Touch-friendly buttons
- Swipe gestures
- Portrait/landscape optimization

## ♿ Accessibility Features

### WCAG Compliance
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- Focus management

### Testing
Components include accessibility tests:
```typescript
// Example test
test('button has proper ARIA attributes', () => {
  render(<AppButton onClick={() => {}}>Click me</AppButton>)
  expect(screen.getByRole('button')).toHaveAttribute('aria-label')
})
```

## 🧪 Testing Strategy

### Component Testing
- Unit tests with Jest + React Testing Library
- Storybook documentation
- Visual regression tests
- Accessibility audits

### Test Examples
```typescript
// Button component test
describe('AppButton', () => {
  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<AppButton onClick={handleClick}>Test</AppButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

## 🔄 Component Lifecycle

### Hooks Usage
Components utilize React hooks for state and effects:
- `useState` for local component state
- `useEffect` for side effects and cleanup
- `useContext` for accessing global state
- `useMemo` and `useCallback` for performance optimization
- Custom hooks for reusable logic

This component architecture ensures maintainability, accessibility, and scalability across the AstralCore platform.