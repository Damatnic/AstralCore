# AstralCore Technical Specifications

## 🏗️ Architecture Overview

### Frontend Architecture
- **Framework**: React 19 with TypeScript 5.5
- **Build Tool**: Vite 5.4 for fast development and optimized builds
- **State Management**: Zustand for lightweight, scalable state
- **Styling**: CSS-in-JS with CSS custom properties
- **Routing**: Client-side routing with React state management
- **Bundle Splitting**: Lazy loading with React.lazy() and Suspense

### Backend Architecture
- **Platform**: Netlify Functions (AWS Lambda)
- **Runtime**: Node.js 18+
- **API Design**: RESTful services with JSON responses
- **Database**: SQL database with connection pooling
- **AI Integration**: Google Gemini 1.5 Flash API
- **Authentication**: Auth0 with JWT tokens

## 🔧 Development Stack

### Core Dependencies
```json
{
  "react": "^19.1.0",
  "react-dom": "^19.1.0",
  "typescript": "^5.5.3",
  "vite": "^5.3.3",
  "@auth0/auth0-spa-js": "^2.1.3",
  "zustand": "^4.5.4",
  "@google/genai": "^1.8.0"
}
```

### Development Tools
```json
{
  "jest": "^29.7.0",
  "@testing-library/react": "^16.0.0",
  "@storybook/react": "^8.2.4",
  "eslint": "^8.57.0",
  "@vitejs/plugin-react": "^4.3.1",
  "netlify-cli": "^17.0.0"
}
```

## 🌐 API Specifications

### RESTful Endpoints
Base URL: `https://astralcore.netlify.app/.netlify/functions/`

#### Authentication
- **POST** `/users/token` - Generate anonymous token
- **GET** `/users/{token}/profile` - Get user profile
- **PUT** `/users/{token}/preferences` - Update preferences

#### Content Management
- **GET** `/dilemmas` - Fetch community posts
- **POST** `/dilemmas` - Create new post
- **POST** `/dilemmas/{id}/support` - Support a post
- **POST** `/dilemmas/{id}/report` - Report content

#### Communication
- **POST** `/chat` - Send message
- **GET** `/chat/{sessionId}/history` - Chat history
- **POST** `/sessions` - Create video session
- **POST** `/sessions/{id}/join` - Join session

#### Mental Health
- **POST** `/wellness/assessments` - Submit assessment
- **GET** `/wellness/{token}/dashboard` - Wellness data
- **POST** `/reflections` - Create journal entry

### Response Format
```typescript
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
}
```

## 🗄️ Data Models

### User Model
```typescript
interface User {
  id: string
  token: string // Anonymous identifier
  preferences: {
    theme: 'light' | 'dark'
    notifications: boolean
    language: string
  }
  createdAt: Date
  lastActive: Date
}
```

### Helper Model
```typescript
interface Helper {
  id: string
  auth0Id: string
  displayName: string
  bio: string
  specializations: string[]
  certifications: string[]
  rating: number
  totalSessions: number
  availability: 'available' | 'busy' | 'offline'
  role: 'Helper' | 'Moderator' | 'Admin'
  applicationStatus: 'pending' | 'approved' | 'rejected'
}
```

### Dilemma Model
```typescript
interface Dilemma {
  id: string
  userToken: string
  title: string
  content: string
  category: 'depression' | 'anxiety' | 'general' | 'crisis'
  tags: string[]
  supportCount: number
  isSupported: boolean
  isReported: boolean
  status: 'active' | 'resolved' | 'moderated'
  createdAt: Date
  updatedAt: Date
}
```

### Chat Session Model
```typescript
interface ChatSession {
  id: string
  dilemmaId: string
  helperId: string
  seekerToken: string
  status: 'active' | 'ended' | 'abandoned'
  messages: Message[]
  startedAt: Date
  endedAt?: Date
}

interface Message {
  id: string
  sessionId: string
  senderId: string
  content: string
  type: 'text' | 'system' | 'crisis'
  timestamp: Date
  isRead: boolean
}
```

### Assessment Model
```typescript
interface Assessment {
  id: string
  userToken: string
  type: 'phq9' | 'gad7'
  responses: number[]
  score: number
  severity: 'minimal' | 'mild' | 'moderate' | 'severe'
  recommendations: string[]
  completedAt: Date
}
```

## 🔐 Security Implementation

### Authentication Flow
1. **Anonymous Users**: Generate UUID token, store in localStorage
2. **Helpers**: Auth0 OAuth flow with JWT tokens
3. **Session Management**: JWT refresh tokens with 7-day expiry
4. **Role-Based Access**: Helper/Moderator/Admin role checking

### Data Protection
- **Encryption**: All data encrypted at rest and in transit
- **Anonymization**: No PII storage for seekers
- **Content Sanitization**: XSS prevention with input validation
- **CORS Configuration**: Restricted to specific domains
- **Rate Limiting**: API endpoint throttling

### Privacy Measures
```typescript
// Example: Anonymous user token generation
const generateAnonymousToken = (): string => {
  return crypto.randomUUID()
}

// Content sanitization
const sanitizeContent = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em'],
    ALLOWED_ATTR: []
  })
}
```

## 🧠 AI Integration

### Google Gemini Configuration
```typescript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }
  ]
})
```

### AI Use Cases
- **Content Summarization**: Generate post summaries
- **Crisis Detection**: Identify urgent mental health situations
- **Helper Matching**: Match seekers with appropriate helpers
- **Content Moderation**: Automatic inappropriate content detection

## 📊 Performance Specifications

### Frontend Performance
- **Bundle Size**: < 2MB total, < 500KB initial load
- **Load Time**: < 3 seconds on 3G connection
- **Lighthouse Score**: 90+ for Performance, Accessibility, Best Practices
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1

### Backend Performance
- **Response Time**: < 500ms for API calls
- **Throughput**: 1000+ requests/minute per function
- **Uptime**: 99.9% availability target
- **Database**: < 100ms average query time

### Optimization Strategies
```typescript
// Lazy loading implementation
const LazyComponent = lazy(() => 
  import('./Component').then(module => ({ 
    default: module.Component 
  }))
)

// Memoization for expensive calculations
const expensiveCalculation = useMemo(() => {
  return processLargeDataset(data)
}, [data])
```

## 🧪 Testing Specifications

### Test Coverage Requirements
- **Unit Tests**: 80%+ coverage for utilities and hooks
- **Component Tests**: All interactive components tested
- **Integration Tests**: Critical user journeys tested
- **E2E Tests**: Core functionality automated testing

### Testing Tools
```typescript
// Jest configuration
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.tsx'
  ]
}
```

## 🚀 Deployment Specifications

### Build Process
```bash
# Production build
npm run build

# Bundle analysis
npm run analyze

# Storybook build
npm run build-storybook
```

### Environment Configuration
```typescript
// Environment variables
interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test'
  VITE_API_URL: string
  AUTH0_DOMAIN: string
  AUTH0_CLIENT_ID: string
  AUTH0_AUDIENCE: string
  GEMINI_API_KEY: string // Server-side only
}
```

### Netlify Configuration
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  node_bundler = "esbuild"
```

## 📱 Browser Support

### Supported Browsers
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Safari**: iOS 14+
- **Chrome Mobile**: Android 90+

### Progressive Enhancement
- **Core Functionality**: Works without JavaScript
- **Enhanced Features**: Rich interactions with JavaScript
- **Offline Support**: Service Worker for critical features
- **Responsive Design**: Mobile-first approach

## 🔧 Development Workflow

### Git Workflow
- **Main Branch**: Production-ready code
- **Feature Branches**: Individual feature development
- **Pull Requests**: Code review required
- **Automated Testing**: CI/CD pipeline on push

### Code Quality
```typescript
// ESLint configuration
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    'no-console': 'warn',
    '@typescript-eslint/no-unused-vars': 'error'
  }
}
```

This technical specification ensures robust, scalable, and maintainable development of the AstralCore platform.