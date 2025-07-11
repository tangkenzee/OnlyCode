# Buddy Code Mentor Backend

Express.js backend API for the Buddy Code Mentor application, providing real-time chat, help request management, and user statistics.

## Features

- **RESTful API** for help requests, user management, and problems
- **WebSocket support** for real-time chat during help sessions
- **In-memory data storage** (easily replaceable with database)
- **CORS enabled** for frontend integration
- **Security headers** with Helmet
- **Sample data** for development and testing

## Quick Start

### Prerequisites
- Node.js (v16+)
- npm

### Installation
```bash
cd backend
npm install
```

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication
Currently uses simple header-based user identification:
- `user-id`: User identifier
- `user-name`: User display name

### Users
- `GET /api/user/me` - Get current user profile
- `PUT /api/user/:userId` - Update user profile
- `GET /api/user/:userId/stats` - Get user statistics

### Help Requests
- `GET /api/help-requests` - List help requests (with filters)
- `POST /api/help-requests` - Create new help request
- `POST /api/help-requests/:requestId/accept` - Accept help request

### Sessions
- `GET /api/sessions/:sessionId` - Get help session details
- `POST /api/sessions/:sessionId/messages` - Send message in session
- `PUT /api/sessions/:sessionId/end` - End session with rating

### Problems
- `GET /api/problems` - List coding problems (with filters)
- `GET /api/problems/:problemId` - Get specific problem details

### Leaderboard
- `GET /api/leaderboard` - Get user rankings

### Statistics
- `GET /api/stats/global` - Get global application statistics

### Health Check
- `GET /api/health` - Server health status

## WebSocket API

### Connection
Connect to `ws://localhost:3002/sessions/:sessionId`

### Message Format
```json
{
  "senderId": "user123",
  "senderName": "John Doe",
  "message": "Hello, I need help with this problem"
}
```

### Received Messages
```json
{
  "id": "msg-uuid",
  "sessionId": "session-uuid",
  "senderId": "user123",
  "senderName": "John Doe",
  "message": "Hello, I need help with this problem",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "type": "text"
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=development
```

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
  rating: number;
  badges: Badge[];
  stats: UserStats;
}
```

### HelpRequest
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
  tags: string[];
  urgent: boolean;
  status: 'open' | 'matched' | 'completed';
  createdAt: string;
  code?: string;
}
```

### HelpSession
```typescript
interface HelpSession {
  id: string;
  requestId: string;
  requesterId: string;
  helperId: string;
  status: 'active' | 'completed' | 'cancelled';
  messages: ChatMessage[];
  startedAt: string;
  endedAt?: string;
  rating?: number;
  feedback?: string;
}
```

## Development

### Adding New Endpoints
1. Add route handler in `server.js`
2. Update API client in frontend (`src/lib/api.ts`)
3. Add corresponding hook in `src/hooks/use-api.ts`

### Database Integration
Replace in-memory storage with your preferred database:
- MongoDB with Mongoose
- PostgreSQL with Prisma
- Redis for caching

### Authentication
Implement proper authentication:
- JWT tokens
- Session management
- Role-based access control

## Production Considerations

- **Database**: Replace in-memory storage with persistent database
- **Authentication**: Implement proper user authentication
- **Rate Limiting**: Add rate limiting for API endpoints
- **Logging**: Add comprehensive logging
- **Monitoring**: Add health checks and monitoring
- **SSL**: Use HTTPS in production
- **Environment**: Use environment variables for configuration

## Testing

```bash
npm test
```

## License

MIT 