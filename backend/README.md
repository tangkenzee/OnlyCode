# OnlyCode Backend

Express.js backend API for the OnlyCode application, providing help request management, user statistics, and leaderboard functionality.

## Features

- **RESTful API** for help requests, user management, and leaderboard
- **External JSON database** (`db.json`) for data persistence
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

### Using the Start Script
```bash
# From project root
./start-backend.sh
```

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Users
- `GET /api/user/me` - Get current user profile

### Help Requests
- `GET /api/help-requests` - List help requests (with filters)
- `POST /api/help-requests/:requestId/accept` - Accept help request

### Leaderboard
- `GET /api/leaderboard` - Get user rankings

### Statistics
- `GET /api/stats/global` - Get global application statistics

## Database

The backend uses an external `db.json` file located in the project root for data persistence.

### Data Structure
```json
{
  "users": {
    "user1": {
      "id": "user1",
      "name": "Alex Thompson",
      "avatar": "AT",
      "email": "alex@example.com",
      "joinDate": "2024-03-01",
      "currentXP": 2480,
      "nextLevelXP": 3000,
      "rank": 6,
      "totalHelped": 134,
      "rating": 4.6,
      "badges": [...],
      "stats": {...}
    }
  },
  "helpRequests": [
    {
      "id": "req1",
      "problemTitle": "Two Sum",
      "difficulty": "Easy",
      "requesterId": "user3",
      "requesterName": "Alex Johnson",
      "timeStuck": "8 minutes",
      "attempts": 4,
      "message": "...",
      "tags": ["Array", "Hash Table"],
      "urgent": false,
      "status": "open",
      "createdAt": "2024-07-11T00:00:00.000Z",
      "code": "..."
    }
  ],
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user1",
      "name": "Alex Thompson",
      "avatar": "AT",
      "xp": 2480,
      "totalHelped": 134,
      "rating": 4.6
    }
  ]
}
```

### Data Models

#### User
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

#### HelpRequest
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

#### LeaderboardEntry
```typescript
interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  totalHelped: number;
  rating: number;
}
```

## Development

### Adding New Endpoints
1. Add route handler in `server.js`
2. Update data structure in `db.json` if needed
3. Test with the frontend application

### Database Management
- Edit `db.json` to modify sample data
- Restart the server after database changes
- The server automatically loads data from `db.json` on startup

### Error Handling
The server includes comprehensive error handling:
- Invalid request IDs return 404
- Missing required fields return 400
- Server errors return 500 with descriptive messages

## Production Considerations

- **Database**: Consider migrating to a proper database (PostgreSQL, MongoDB)
- **Authentication**: Implement proper user authentication (JWT, sessions)
- **Rate Limiting**: Add rate limiting for API endpoints
- **Logging**: Add comprehensive logging
- **Monitoring**: Add health checks and monitoring
- **SSL**: Use HTTPS in production
- **Environment**: Use environment variables for configuration

## Troubleshooting

### Common Issues
1. **Server won't start**: Check if port 3001 is available
2. **Data not loading**: Verify `db.json` exists and is properly formatted
3. **API errors**: Check browser console for detailed error messages
4. **CORS issues**: Ensure frontend is running on the correct port

### Debug Tips
- Check server logs for detailed error messages
- Verify `db.json` format with JSON validator
- Test API endpoints with curl or Postman
- Check browser network tab for request/response details

## Testing

```bash
npm test
```

## License

MIT