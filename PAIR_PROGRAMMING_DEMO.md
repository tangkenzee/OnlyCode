# Pair Programming Demo

## Overview

This demo implements a **global pair programming room** where multiple users can collaborate on the same coding problem in real-time. All users share the same code editor and can see each other's changes instantly.

## Key Features

### 🌐 **Global Room**
- **Single shared room** for all users
- No matter how many users join (2, 4, 10+), they all go to the same room
- Perfect for demos and testing

### 💻 **Real-Time Code Synchronization**
- **Live code editing** - when one user types, all users see the changes
- **Monaco Editor** integration with syntax highlighting
- **Instant synchronization** across all connected users

### 💬 **Real-Time Chat**
- **Live messaging** between all users in the room
- **User identification** with avatars and names
- **Timestamp tracking** for all messages

### 🎯 **Fixed Problem**
- **Two Sum problem** - classic algorithmic challenge
- **Pre-loaded starter code** for immediate collaboration
- **Code execution** with Judge0 CE API integration

### 👥 **User Management**
- **Random user generation** for demo purposes
- **Online user list** showing all active participants
- **Connection status** indicators

## How to Use

### 1. Start the Servers
```bash
# Terminal 1 - Backend (WebSocket + API)
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

### 2. Access the Demo
1. Open your browser to `http://localhost:5173`
2. Click the **"Try Pair Programming Demo"** button on the homepage
3. Or navigate directly to `http://localhost:5173/pair-programming`

### 3. Test Multi-User Collaboration
1. **Open multiple browser tabs/windows** to simulate different users
2. **Navigate to the pair programming page** in each tab
3. **Start typing code** - you'll see changes sync across all tabs
4. **Send chat messages** - they appear in all tabs
5. **Run code** - all users see the same output

## Technical Implementation

### Backend (WebSocket Server)
```javascript
// Global room state
const globalPairProgrammingRoom = {
  id: 'global-pair-programming',
  users: new Set(), // All connected users
  code: '...', // Shared code content
  problem: { /* Two Sum problem */ }
};
```

### Frontend (React Component)
```typescript
// Real-time code synchronization
const handleCodeChange = (value: string | undefined) => {
  setCode(value || "");
  ws.send(JSON.stringify({
    type: 'code-change',
    code: value
  }));
};
```

### WebSocket Message Types
- `room-joined` - New user joins, receives current state
- `user-joined` - Notify others about new participant
- `user-left` - Notify others about departure
- `code-updated` - Broadcast code changes to all users
- `chat-message` - Broadcast chat messages

## Demo Scenarios

### Scenario 1: Two Users
1. User A opens the demo
2. User B opens the demo in another tab
3. Both see each other in the online users list
4. User A types code → User B sees it instantly
5. User B sends chat message → User A sees it

### Scenario 2: Multiple Users
1. Open 4-5 browser tabs
2. All users join the same global room
3. Any user can edit code and all others see changes
4. Chat messages broadcast to everyone
5. Code execution results visible to all

### Scenario 3: Code Execution
1. Multiple users collaborate on the Two Sum solution
2. One user clicks "Run Code"
3. All users see the execution results
4. Users can discuss the solution in chat

## File Structure

```
src/
├── pages/
│   └── PairProgramming.tsx     # Main demo page
├── App.tsx                     # Route configuration
└── pages/Index.tsx            # Homepage with demo button

backend/
└── src/
    └── server.js              # WebSocket + API server
```

## Testing

### WebSocket Test
Use the included `test-pair-programming.html` file to test WebSocket connections:

1. Open `test-pair-programming.html` in a browser
2. Enter different user IDs and names
3. Connect multiple instances to test real-time communication
4. Send code changes and chat messages

### Manual Testing
1. Start both servers
2. Open multiple browser tabs to `http://localhost:5173/pair-programming`
3. Verify real-time synchronization works
4. Test code execution and chat functionality

## Future Enhancements

### Planned Features
- **User cursors** - See where other users are typing
- **Code highlighting** - Highlight changes made by specific users
- **Voice chat** - WebRTC integration for voice communication
- **Screen sharing** - Share screens during collaboration
- **Multiple problems** - Expand beyond Two Sum

### Technical Improvements
- **Persistent sessions** - Save code state between sessions
- **User authentication** - Real user accounts instead of random names
- **Room management** - Create multiple rooms for different problems
- **Code versioning** - Track changes and allow rollbacks

## Troubleshooting

### Common Issues

**WebSocket Connection Failed**
- Ensure backend server is running on port 3002
- Check firewall settings
- Verify WebSocket URL format

**Code Not Syncing**
- Check browser console for WebSocket errors
- Verify all users are connected to the same room
- Refresh the page to reconnect

**Chat Not Working**
- Ensure WebSocket connection is established
- Check message format in browser console
- Verify backend message handling

### Debug Commands
```bash
# Check if servers are running
curl http://localhost:3001/api/health
curl http://localhost:5173

# Check WebSocket connection
# Use browser dev tools Network tab to monitor WebSocket traffic
```

## API Endpoints

### WebSocket
- `ws://localhost:3002/pair-programming` - Main pair programming room

### HTTP API
- `POST /api/execute-code` - Execute code with Judge0 CE API
- `GET /api/health` - Server health check

## Environment Variables

```bash
# Required for code execution
JUDGE0_API_KEY=your-rapidapi-key-here

# Optional
PORT=3001
NODE_ENV=development
```

---

**Note**: This is a demo implementation designed for testing and showcasing real-time collaboration features. For production use, additional security, authentication, and scalability measures would be required. 