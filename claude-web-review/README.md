# AstralCore - Claude Web Review Documentation

## Project Overview

**AstralCore** is an anonymous peer-to-peer mental health support platform built with React, TypeScript, and Vite. It provides a safe space for users to seek and provide mental health support while maintaining complete anonymity.

## 🎯 Purpose & Goals

- **Anonymous Support**: Users can share their struggles and receive help without revealing their identity
- **Peer-to-Peer Network**: Community-driven support system with helpers and seekers
- **Mental Health Focus**: Specialized tools for depression, anxiety, and wellness tracking
- **Crisis Resources**: Immediate access to professional help when needed
- **Safe Environment**: Moderated community with strict guidelines and reporting systems

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19** with TypeScript
- **Vite** for build tooling and development
- **Zustand** for state management
- **Auth0 SPA SDK** for authentication
- **React Markdown** for rich text content
- **i18n-js** for internationalization

### Backend (Netlify Functions)
- **Serverless Functions** for API endpoints
- **Google Gemini AI** for intelligent matching and support
- **Database Integration** for data persistence
- **RESTful API** design

### Key Features
- Real-time chat between helpers and seekers
- Video chat capabilities for deeper support
- AI-powered matching system
- Assessment tools (PHQ-9, GAD-7)
- Wellness tracking and habit formation
- Crisis intervention system
- Helper training and certification
- Moderation and admin dashboard

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Quick Start
```bash
# Clone the repository
git clone https://github.com/Damatnic/AstralCore.git
cd AstralCore

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Start development server (frontend only)
npm run dev

# Start full-stack development (with Netlify functions)
npm run dev:full
```

### Environment Variables Required
```
AUTH0_DOMAIN=your-auth0-domain.us.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_AUDIENCE=https://your-api-audience.com
GEMINI_API_KEY=your-gemini-api-key
```

## 📁 Project Structure

See the detailed file structure in `file-structure.md` for complete component and utility organization.

## 🔧 Recent Fixes & Improvements

### Application Startup Issues ✅
- Fixed syntax errors in icon components
- Resolved React Native dependency conflicts
- Added proper CSS imports and styling
- Fixed HTML duplicate imports

### API Configuration ✅
- Enhanced ApiClient with smart fallback to mock data
- Added Netlify function configuration
- Implemented proper error handling for missing backends
- Created comprehensive mock data for development

### Authentication System ✅
- Migrated from expo-auth-session to Auth0 SPA SDK
- Implemented web-compatible authentication flow
- Added legal consent management system
- Created anonymous user token system

### Assessment Tools ✅
- Built PHQ-9 depression assessment
- Implemented GAD-7 anxiety assessment
- Added scoring algorithms and interpretations
- Created assessment history tracking

## 🎨 UI/UX Features

- **Responsive Design**: Mobile-first approach with desktop optimization
- **Dark/Light Themes**: User-preferred theme switching
- **Accessibility**: WCAG compliant with screen reader support
- **Smooth Animations**: Subtle transitions and loading states
- **Toast Notifications**: User-friendly feedback system
- **Modal System**: Reusable dialog components
- **Loading States**: Skeleton screens and spinners

## 🔐 Security & Privacy

- **Anonymous by Default**: No personal information required
- **Encrypted Communications**: All data transmission secured
- **Content Moderation**: AI and human moderation systems
- **Crisis Intervention**: Automated detection and response
- **Data Minimization**: Only necessary data collection
- **Secure Authentication**: Auth0 integration with JWT tokens

## 🧪 Testing Strategy

- **Unit Tests**: Jest with React Testing Library
- **Component Tests**: Storybook for UI component documentation
- **Integration Tests**: API endpoint testing
- **End-to-End Tests**: Critical user journey validation

## 📊 Analytics & Monitoring

- **User Analytics**: Privacy-focused usage tracking
- **Error Monitoring**: Real-time error detection and reporting
- **Performance Metrics**: Core Web Vitals monitoring
- **API Monitoring**: Backend function performance tracking

## 🌍 Deployment

### Netlify Deployment
- Automatic deployments from main branch
- Environment variable configuration
- Function deployment with build optimization
- CDN distribution for global performance

### Production URLs
- **Frontend**: Deployed via Netlify
- **API**: Netlify Functions at `/.netlify/functions/`
- **Auth**: Auth0 integration for user management

## 🤝 Contributing

This project follows standard Git workflows with feature branches and pull requests. See individual component documentation for specific implementation details.

## 📞 Support & Resources

- **Crisis Resources**: Integrated crisis hotlines and resources
- **Community Guidelines**: Clear rules for safe interactions  
- **Helper Training**: Comprehensive training modules for volunteers
- **Admin Tools**: Full moderation and management dashboard

---

*This documentation is optimized for Claude web review with essential information condensed for efficient analysis.*