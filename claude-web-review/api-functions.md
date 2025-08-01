# AstralCore API Functions Documentation

## 🔌 Backend API Overview

The AstralCore backend uses **Netlify Functions** (serverless) to provide a RESTful API. All functions are located in `/netlify/functions/` and are accessible at `/.netlify/functions/{function-name}`.

## 🤖 AI Integration (`ai.ts`)

### Purpose
Provides AI-powered features using Google Gemini API for intelligent matching and support.

### Key Functions
```typescript
// Generate summaries for dilemmas
POST /.netlify/functions/ai
{
  "action": "summarize",
  "content": "User's dilemma text..."
}

// AI matching between seekers and helpers
POST /.netlify/functions/ai
{
  "action": "match",
  "seekerProfile": {...},
  "helperProfiles": [...]
}

// Crisis detection and response
POST /.netlify/functions/ai
{
  "action": "crisis_detect",
  "message": "User message content"
}
```

### Configuration
- **API Key**: `GEMINI_API_KEY` environment variable
- **Model**: `gemini-1.5-flash` for fast responses
- **Safety Settings**: Configured for mental health content

## 💬 Chat System (`chat.ts`)

### Purpose
Manages real-time messaging between helpers and seekers.

### Endpoints
```typescript
// Send message
POST /.netlify/functions/chat
{
  "sessionId": "uuid",
  "senderId": "user-token",
  "message": "message content",
  "type": "text" | "system" | "crisis"
}

// Get chat history
GET /.netlify/functions/chat?sessionId=uuid&limit=50

// Start new chat session
POST /.netlify/functions/chat
{
  "dilemmaId": "uuid",
  "helperId": "helper-id",
  "seekerToken": "seeker-token"
}
```

### Features
- Message encryption for privacy
- Crisis message flagging
- Typing indicators
- Message status tracking

## 📝 Dilemma Management (`dilemmas.ts`)

### Purpose
Handles user posts, community content, and support requests.

### Core Endpoints
```typescript
// Create new dilemma/post
POST /.netlify/functions/dilemmas
{
  "title": "Post title",
  "content": "Detailed description",
  "category": "depression" | "anxiety" | "general",
  "tags": ["tag1", "tag2"],
  "isAnonymous": true,
  "userToken": "anonymous-token"
}

// Get community feed
GET /.netlify/functions/dilemmas?page=1&limit=20&category=all

// Support a post
POST /.netlify/functions/dilemmas/{id}/support
{
  "userToken": "supporter-token"
}

// Report inappropriate content
POST /.netlify/functions/dilemmas/{id}/report
{
  "reason": "spam" | "inappropriate" | "crisis",
  "details": "Additional context"
}
```

### Content Features
- AI-powered content summarization
- Automatic crisis detection
- Community voting/support system
- Content moderation workflow

## 👥 Helper Management (`helpers.ts`)

### Purpose
Manages helper profiles, applications, and matching system.

### Key Operations
```typescript
// Get helper profile
GET /.netlify/functions/helpers/{id}

// Update helper profile
PUT /.netlify/functions/helpers/{id}
{
  "specializations": ["depression", "anxiety"],
  "availability": "weekdays",
  "bio": "Helper description",
  "certifications": [...]
}

// Helper application process
POST /.netlify/functions/helpers/apply
{
  "experience": "Background information",
  "motivation": "Why they want to help",
  "availability": "Schedule information"
}

// Get online helper count
GET /.netlify/functions/helpers/online-count
```

### Helper Features
- Skill-based matching
- Availability scheduling
- Training progress tracking
- Performance metrics

## 👤 User Management (`users.ts`)

### Purpose
Handles user accounts, preferences, and anonymous token management.

### Core Functions
```typescript
// Create anonymous user token
POST /.netlify/functions/users/token
{
  "deviceId": "device-identifier"
}

// Update user preferences
PUT /.netlify/functions/users/{token}/preferences
{
  "theme": "dark" | "light",
  "notifications": true,
  "language": "en"
}

// Get user activity
GET /.netlify/functions/users/{token}/activity?limit=50
```

## 🎥 Session Management (`sessions.ts`)

### Purpose
Manages video/voice chat sessions between users.

### Session Operations
```typescript
// Create video session
POST /.netlify/functions/sessions
{
  "dilemmaId": "uuid",
  "participants": ["helper-id", "seeker-token"],
  "type": "video" | "voice"
}

// Join session
POST /.netlify/functions/sessions/{id}/join
{
  "userId": "user-identifier",
  "consent": true
}

// End session
POST /.netlify/functions/sessions/{id}/end
{
  "reason": "completed" | "terminated"
}
```

## 🌱 Wellness Tracking (`wellness.ts`)

### Purpose
Mental health assessments, habit tracking, and wellness metrics.

### Assessment Features
```typescript
// Submit PHQ-9 assessment
POST /.netlify/functions/wellness/assessments
{
  "type": "phq9",
  "responses": [0, 1, 2, 1, 0, 1, 2, 1, 0],
  "userToken": "anonymous-token"
}

// Get wellness dashboard
GET /.netlify/functions/wellness/{token}/dashboard

// Track habit completion
POST /.netlify/functions/wellness/{token}/habits
{
  "habitId": "uuid",
  "completed": true,
  "date": "2025-01-01"
}
```

## 📔 Reflections/Journaling (`reflections.ts`)

### Purpose
Private journaling and reflection tracking for mental health.

### Journal Operations
```typescript
// Create reflection entry
POST /.netlify/functions/reflections
{
  "content": "Today I felt...",
  "mood": 1-10,
  "tags": ["gratitude", "anxiety"],
  "isPrivate": true,
  "userToken": "token"
}

// Get reflection history
GET /.netlify/functions/reflections?token=user-token&limit=30
```

## 📊 Feedback System (`feedback.ts`)

### Purpose
Collects user feedback, ratings, and platform improvements.

### Feedback Types
```typescript
// Submit feedback
POST /.netlify/functions/feedback
{
  "type": "bug" | "feature" | "general",
  "message": "Feedback content",
  "rating": 1-5,
  "category": "ui" | "performance" | "feature"
}
```

## 🗄️ Database Layer (`lib/database.ts`)

### Purpose
Centralized database operations and utilities.

### Key Features
- Connection pooling
- Query optimization
- Data encryption
- Backup management
- Migration handling

## 🔐 Security Features

### Authentication
- JWT token validation
- Anonymous user tokens
- Session management
- Role-based access control

### Privacy Protection
- Data encryption at rest
- Anonymous communication
- No personal data storage
- GDPR compliance

### Content Safety
- AI-powered content moderation
- Crisis intervention protocols
- Community reporting system
- Professional escalation paths

## 📈 Performance Optimizations

### Caching Strategy
- Function-level caching
- Database query optimization
- CDN integration
- Response compression

### Scalability
- Serverless auto-scaling
- Database connection pooling
- Load balancing
- Error handling and retry logic

## 🚨 Error Handling

### Standard Response Format
```typescript
{
  "success": boolean,
  "data"?: any,
  "error"?: {
    "code": string,
    "message": string,
    "details"?: any
  }
}
```

### Error Codes
- `AUTH_REQUIRED` - Authentication needed
- `INVALID_INPUT` - Validation failed
- `NOT_FOUND` - Resource not found
- `RATE_LIMITED` - Too many requests
- `SERVER_ERROR` - Internal server error
- `CRISIS_DETECTED` - Crisis intervention needed

All functions follow RESTful principles and include comprehensive error handling for robust operation.