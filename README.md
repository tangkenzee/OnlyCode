# OnlyCode

A collaborative coding platform that connects learners with peers for real-time problem-solving sessions.

## Features

- **Real-time Collaboration**: Work with peers on coding problems
- **Skill-based Matchmaking**: Find partners based on specific skills needed
- **Help Requests**: Request assistance when stuck on problems
- **Code Execution**: Run code with Judge0 CE API integration
- **Leaderboard**: Track progress and achievements
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: JSON file (db.json)
- **Code Execution**: Judge0 CE API via RapidAPI
- **Real-time**: WebSocket support (planned)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/buddy-code-mentor.git
   cd buddy-code-mentor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Judge0 CE API (Required for code execution)**
   
   The code editor uses Judge0 CE API for code execution. You need to:
   
   a. Sign up for a free account at [RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce/)
   b. Subscribe to the Judge0 CE API (free tier available)
   c. Get your API key from the RapidAPI dashboard
   d. Create a `.env` file in the root directory:
   ```bash
   # Judge0 CE API Configuration
   JUDGE0_API_KEY=your-rapidapi-key-here
   
   # Backend Configuration
   PORT=3001
   NODE_ENV=development
   ```

4. **Start the development server**
   ```bash
   # Start backend
   npm run server:dev
   
   # In another terminal, start frontend
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## API Endpoints

### Core Endpoints
- `GET /api/health` - Health check
- `GET /api/user/me` - Get current user info
- `GET /api/help-requests` - List help requests
- `POST /api/help-requests/:id/accept` - Accept help request
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/stats/global` - Get global stats

### Matchmaking
- `GET /api/matchmaking/skills?skills=Array,Hash%20Table&limit=5` - Skill-based matchmaking

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

## Supported Programming Languages

The code editor supports multiple languages via Judge0 CE API:

- JavaScript (Node.js)
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

## Data Models

### User
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
  skillRatings: Record<string, number>;
  badges: Badge[];
  stats: UserStats;
}
```

### Help Request
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

## Troubleshooting

### Code Execution Issues
- Ensure your Judge0 API key is correctly set in `.env`
- Check that you have an active RapidAPI subscription
- Verify the API key has proper permissions

### Backend Connection Issues
- Make sure the backend is running on port 3001
- Check that no other process is using the port
- Verify CORS settings if accessing from different domains

### Frontend Issues
- Clear browser cache if UI doesn't update
- Check browser console for JavaScript errors
- Ensure all dependencies are installed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Judge0 CE](https://judge0.com/) for code execution API
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for code editing
