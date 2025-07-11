# Buddy Code Mentor

## Project Overview
A modern React + TypeScript app with custom UI components, Tailwind CSS, and Vite. This project helps users request and solve coding problems collaboratively with peer-to-peer assistance.

---

## Features

- **Problem Solving**: Interactive code editor with real-time execution
- **Peer Collaboration**: Find partners with similar skill levels to solve problems together
- **Help Requests**: Request help from experienced users when stuck
- **Live Chat**: Real-time communication during help sessions
- **Leaderboard**: Track user progress and rankings
- **User Profiles**: Detailed user statistics and achievements
- **Auto-Help System**: Automatic help suggestions after 3 failed attempts

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Start Backend Server
```bash
./start-backend.sh
```

### Build for Production
```bash
npm run build
```

---

## Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility libraries
├── backend/                # Express.js backend
├── db.json                 # External database file
├── server.js               # Main backend server
└── start-backend.sh        # Backend startup script
```

---

## Backend Integration

This project includes a simple Express.js backend for data persistence and API functionality.

### Backend Setup
```bash
# Use the start script (recommended)
./start-backend.sh

# Or manual setup
cd backend
npm install
npm run dev
```

The backend provides:
- RESTful API for help requests, user management, and leaderboard
- External JSON database (`db.json`) for data persistence
- CORS enabled for frontend integration
- Health check endpoint for monitoring

### API Endpoints
- `GET /api/health` - Server health status
- `GET /api/user/me` - Get current user profile
- `GET /api/help-requests` - List help requests (with filters)
- `POST /api/help-requests/:id/accept` - Accept help request
- `GET /api/leaderboard` - Get user rankings

### Database
The project uses an external `db.json` file for data storage:
- **Users**: User profiles and statistics
- **Help Requests**: Open requests for assistance
- **Leaderboard**: User rankings and XP

To modify data, edit `db.json` and restart the backend server.

---

## Key Features

### Problem Solver
- Interactive code editor with syntax highlighting
- Real-time code execution and testing
- Problem descriptions with examples and constraints
- Auto-help system after 3 failed attempts

### Collaborative Solving
- Find partners with similar skill levels
- Real-time chat during problem solving
- Progress tracking and shared achievements

### Help Requests
- Manual fetch button to load open requests
- Filter by difficulty level
- Accept requests to start help sessions
- Real-time chat with requesters

### User Experience
- Modern, responsive UI with Tailwind CSS
- Toast notifications for user feedback
- Loading states and error handling
- Mobile-friendly design

---

## Code Quality

- **Lint:**
  ```bash
  npm run lint
  ```
- **Format:**
  ```bash
  npm run format
  ```

---

## Troubleshooting

### API Connection Issues
1. Make sure the backend server is running on `http://localhost:3001`
2. Check the API Status component on the homepage
3. Verify `db.json` exists and is properly formatted
4. Restart the backend server if needed

### Common Issues
- **Port conflicts**: Ensure port 3001 is available
- **Node.js version**: Requires Node.js v16 or higher
- **Dependencies**: Run `npm install` if you get module errors
- **Database**: Check `db.json` format if data isn't loading

---

## Development

### Adding New Features
1. Update `db.json` for new data structures
2. Add API endpoints in `server.js`
3. Create corresponding frontend components
4. Update TypeScript types as needed

### Data Management
- Edit `db.json` to modify sample data
- Restart backend server after database changes
- Use browser dev tools to inspect API responses

---

## License
MIT
