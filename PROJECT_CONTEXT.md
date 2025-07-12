# Buddy Code Mentor - Project Context

## Project Overview

**Buddy Code Mentor** is a collaborative coding platform that connects learners with peers for real-time problem-solving sessions. The platform focuses on peer-to-peer learning through collaborative problem-solving, skill-based matchmaking, and real-time code execution.

## Core Mission & Goals

### Primary Objectives
1. **Peer-to-Peer Learning**: Enable learners to solve coding problems together in real-time
2. **Skill-Based Matchmaking**: Connect users based on specific skills needed for problems (e.g., Arrays, Hash Tables, Dynamic Programming)
3. **Real-Time Code Execution**: Provide instant feedback on code with Judge0 CE API integration
4. **Help Request System**: Allow users to request assistance when stuck on problems
5. **Progress Tracking**: Gamify learning with XP, badges, and leaderboards

### Target Users
- **Coding Students**: Learning algorithms and data structures
- **Bootcamp Participants**: Practicing coding problems collaboratively
- **Self-Learners**: Seeking peer support while solving problems
- **Coding Interview Prep**: Users preparing for technical interviews

## Technical Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Code Editor**: Monaco Editor (VS Code-like experience)
- **State Management**: React hooks (useState, useEffect)
- **Routing**: React Router v6
- **HTTP Client**: Fetch API with custom wrapper

### Backend Stack
- **Runtime**: Node.js with Express.js
- **Database**: JSON file (db.json) for simplicity
- **Code Execution**: Judge0 CE API via RapidAPI
- **CORS**: Enabled for frontend integration
- **Port**: 3001 (configurable via environment)

### Key Dependencies
```json
{
  "react": "^18.2.0",
  "typescript": "^5.0.0",
  "vite": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "express": "^4.18.0",
  "axios": "^1.6.0",
  "@monaco-editor/react": "^0.45.0"
}
```

## Core Features & Components

### 1. Problem Solver (`src/pages/ProblemSolver.tsx`)
- **Interactive Code Editor**: Monaco Editor with syntax highlighting
- **Real-Time Execution**: Judge0 CE API integration
- **Test Case Validation**: Automatic testing with expected outputs
- **Problem Description**: Detailed problem statements with examples
- **Collaboration Integration**: Direct access to peer matching

### 2. Collaborative Solve (`src/components/CollaborativeSolve.tsx`)
- **Skill-Based Matchmaking**: Find partners based on specific skills
- **Real-Time Chat**: In-session communication
- **User Profiles**: Display partner information and ratings
- **Session Management**: Start/end collaborative sessions

### 3. Help Requests (`src/pages/HelpRequests.tsx`)
- **Request System**: Users can request help when stuck
- **Manual Loading**: Button-triggered data fetching
- **Filtering**: By difficulty and status
- **Acceptance Flow**: Helpers can accept and start sessions

### 4. User Profiles (`src/pages/Profile.tsx`)
- **XP System**: Experience points and leveling
- **Skill Ratings**: Detailed skill breakdown (Array, Hash Table, etc.)
- **Badges**: Achievement system
- **Statistics**: Problems solved, help given, response times

### 5. Leaderboard (`src/pages/Leaderboard.tsx`)
- **Global Rankings**: Based on XP and problems solved
- **User Stats**: Detailed performance metrics
- **Achievement Display**: Badges and accomplishments

## Data Models

### User Structure
```typescript
interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  joinDate: string;
  currentXP: number;
  nextLevelXP: number;
  rank: number;
  totalHelped: number;
  overallRating: number;
  skillRatings: Record<string, number>; // e.g., {"Array": 4.8, "Hash Table": 4.7}
  badges: Badge[];
  stats: UserStats;
}
```

### Problem Structure
```typescript
interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  tags: string[]; // e.g., ["Array", "Hash Table"]
  examples: Array<{
    input: string;
    output: string;
    explanation: string;
  }>;
  testCases: Array<{
    input: any[];
    expected: any;
  }>;
}
```

### Help Request Structure
```typescript
interface HelpRequest {
  id: string;
  problemTitle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  requesterId: string;
  requesterName: string;
  timeStuck: string;
  attempts: number;
  message: string;
  status: 'open' | 'matched' | 'closed';
  createdAt: string;
}
```

## API Endpoints

### Core Endpoints
- `GET /api/health` - Server health check
- `GET /api/user/me` - Get current user profile
- `GET /api/help-requests` - List help requests with filtering
- `POST /api/help-requests/:id/accept` - Accept help request
- `GET /api/leaderboard` - Get user rankings
- `GET /api/stats/global` - Get global statistics

### Matchmaking
- `GET /api/matchmaking/skills?skills=Array,Hash%20Table&limit=5` - Skill-based user matching

### Code Execution
- `POST /api/execute-code` - Execute code using Judge0 CE API
  ```json
  {
    "code": "function twoSum(nums, target) { ... }",
    "language": "javascript",
    "testCases": [
      {
        "input": "[[2,7,11,15], 9]",
        "expected": "[0,1]"
      }
    ]
  }
  ```

## Code Execution Integration

### Judge0 CE API Setup
1. **API Provider**: RapidAPI Judge0 CE
2. **Languages Supported**: 25+ programming languages
3. **Execution Flow**:
   - Submit code to Judge0 API
   - Poll for completion status
   - Return results with timing/memory metrics
   - Validate against test cases

### Supported Languages
- JavaScript (Node.js) - Primary language
- Python 3
- Java
- C++
- C
- C#
- PHP
- Ruby
- Swift
- Go
- Rust
- Kotlin
- TypeScript
- And many more...

## Key Business Logic

### Skill-Based Matchmaking Algorithm
1. **Skill Extraction**: Parse problem tags to identify required skills
2. **User Filtering**: Find users with relevant skill ratings
3. **Score Calculation**: 
   - Skill match percentage
   - Average skill rating
   - Online status
   - Response time
4. **Ranking**: Sort by match percentage, then by skill rating

### XP & Leveling System
- **XP Sources**: Problems solved, help given, collaboration time
- **Level Thresholds**: Increasing XP requirements per level
- **Badge System**: Achievements for milestones
- **Skill Progression**: Individual skill ratings improve with practice

### Help Request Triggers
- **Time-Based**: After 5 minutes of being stuck
- **Attempt-Based**: After 3 failed code execution attempts
- **Manual**: User can request help anytime

## Development Guidelines

### Code Quality Standards
- **TypeScript**: Strict typing throughout
- **Component Structure**: Functional components with hooks
- **Error Handling**: Comprehensive try-catch blocks
- **Loading States**: User feedback during async operations
- **Responsive Design**: Mobile-first approach

### State Management
- **Local State**: useState for component-specific data
- **API State**: Custom hooks for data fetching
- **Global State**: Context API for user authentication (planned)
- **Persistence**: JSON file for data storage

### Testing Strategy
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API endpoint testing
- **E2E Tests**: User workflow testing (planned)
- **Code Execution**: Judge0 API integration testing

## Deployment & Environment

### Environment Variables
```bash
JUDGE0_API_KEY=your-rapidapi-key-here
PORT=3001
NODE_ENV=development
```

### Build Process
```bash
# Frontend build
npm run build

# Backend start
npm run server:dev

# Production
npm run start
```

### File Structure
```
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility libraries
├── server.cjs              # Express backend
├── db.json                 # External database
├── package.json            # Dependencies
└── README.md              # Documentation
```

## Future Roadmap

### Phase 1 (Current)
- ✅ Basic problem solving interface
- ✅ Code execution with Judge0
- ✅ Help request system
- ✅ Skill-based matchmaking
- ✅ User profiles and leaderboards

### Phase 2 (Planned)
- **Real-Time Chat**: WebSocket integration for live communication
- **Video Calls**: Integration with WebRTC for screen sharing
- **Problem Library**: Expandable problem database
- **Advanced Analytics**: Detailed learning analytics

### Phase 3 (Future)
- **AI Tutoring**: GPT integration for hints and explanations
- **Competitive Mode**: Timed coding competitions
- **Team Challenges**: Multi-user problem solving
- **Mobile App**: React Native version

## Success Metrics

### User Engagement
- **Daily Active Users**: Target 100+ active users
- **Session Duration**: Average 30+ minutes per session
- **Problem Completion Rate**: 70%+ success rate
- **Help Request Response Time**: <5 minutes average

### Learning Outcomes
- **Skill Improvement**: Measurable skill rating increases
- **Collaboration Rate**: 60%+ of sessions involve collaboration
- **User Retention**: 80%+ monthly retention rate
- **Problem Difficulty Progression**: Users advancing to harder problems

### Technical Performance
- **Code Execution Speed**: <3 seconds average response time
- **API Uptime**: 99.9% availability
- **Error Rate**: <1% failed executions
- **Load Testing**: Support 100+ concurrent users

## Integration Points

### External APIs
- **Judge0 CE**: Code execution and compilation
- **RapidAPI**: API management and monitoring
- **Future**: WebRTC for video calls, WebSocket for real-time chat

### Data Sources
- **db.json**: User data, problems, help requests
- **Judge0 API**: Code execution results
- **Future**: PostgreSQL for production database

## Security Considerations

### Current
- **CORS**: Configured for frontend-backend communication
- **Input Validation**: Code execution with time/memory limits
- **Error Handling**: Comprehensive error catching

### Planned
- **User Authentication**: JWT-based auth system
- **Rate Limiting**: API usage limits
- **Code Sanitization**: Prevent malicious code execution
- **Data Encryption**: Sensitive data protection

## Performance Optimization

### Frontend
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Vite build optimization
- **Caching**: API response caching
- **Image Optimization**: Compressed assets

### Backend
- **Connection Pooling**: Database connection management
- **Caching**: Redis for session data (planned)
- **Load Balancing**: Multiple server instances (planned)
- **CDN**: Static asset delivery (planned)

This context provides a comprehensive overview of the Buddy Code Mentor project for use with other LLMs. The project is a modern, collaborative coding platform focused on peer-to-peer learning with real-time code execution capabilities. 