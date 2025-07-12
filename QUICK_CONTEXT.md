# Buddy Code Mentor - Quick Context

## Project Summary
Collaborative coding platform for peer-to-peer learning with real-time code execution. Users solve coding problems together, get matched by skills, and receive instant feedback.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Monaco Editor
- **Backend**: Node.js + Express + JSON database (db.json)
- **Code Execution**: Judge0 CE API via RapidAPI
- **Port**: Frontend 5173, Backend 3001

## Core Features
1. **Problem Solver**: Interactive code editor with real-time execution
2. **Skill-Based Matchmaking**: Connect users by specific skills (Array, Hash Table, etc.)
3. **Help Requests**: Request assistance when stuck
4. **Collaborative Sessions**: Real-time problem solving with peers
5. **XP System**: Gamified learning with levels and badges

## Key Components
- `ProblemSolver.tsx`: Main coding interface with Monaco Editor
- `CollaborativeSolve.tsx`: Peer matching and chat
- `HelpRequests.tsx`: Help request management
- `Profile.tsx`: User stats and skill ratings
- `Leaderboard.tsx`: Global rankings

## Data Models
```typescript
// User with skill ratings
interface User {
  skillRatings: Record<string, number>; // {"Array": 4.8, "Hash Table": 4.7}
  currentXP: number;
  totalHelped: number;
}

// Problem with test cases
interface Problem {
  testCases: Array<{input: any[], expected: any}>;
  tags: string[]; // ["Array", "Hash Table"]
}
```

## API Endpoints
- `POST /api/execute-code`: Run code with Judge0 CE API
- `GET /api/matchmaking/skills`: Find users by skills
- `GET /api/help-requests`: List help requests
- `GET /api/leaderboard`: User rankings

## Current State
- ✅ Code execution working with Judge0 API
- ✅ Skill-based matchmaking implemented
- ✅ Help request system functional
- ✅ User profiles and leaderboards
- 🔄 Real-time chat (planned)
- 🔄 WebSocket integration (planned)

## Environment Setup
```bash
JUDGE0_API_KEY=your-rapidapi-key-here
PORT=3001
NODE_ENV=development
```

## Development Commands
```bash
npm run dev          # Start frontend
npm run server:dev   # Start backend
npm run build        # Build for production
```

## Key Files
- `server.cjs`: Express backend with API endpoints
- `db.json`: User data and help requests
- `src/lib/api-simple.ts`: API client
- `src/pages/ProblemSolver.tsx`: Main coding interface

## Next Steps
1. Add real-time chat with WebSockets
2. Implement user authentication
3. Add more programming languages
4. Expand problem library
5. Add video call integration

This is a modern React/TypeScript app focused on collaborative coding education with real-time code execution capabilities. 