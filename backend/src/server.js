const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// In-memory data storage (replace with database in production)
const users = new Map();
const helpRequests = new Map();
const helpSessions = new Map();
const problems = new Map();
const leaderboard = [];

// Initialize sample data
function initializeSampleData() {
  // Sample users
  users.set('user1', {
    id: 'user1',
    name: 'Alex Thompson',
    avatar: 'AT',
    email: 'alex@example.com',
    joinDate: '2024-03-01',
    currentXP: 2480,
    nextLevelXP: 3000,
    rank: 6,
    totalHelped: 134,
    rating: 4.6,
    badges: [
      { id: 'badge1', name: 'String Master', description: 'Helped 25+ people with string problems', earned: '2024-01-15' },
      { id: 'badge2', name: 'Helpful', description: 'Maintained 4.5+ rating for 30 days', earned: '2024-02-20' }
    ],
    stats: {
      problemsSolved: 89,
      helpStreak: 12,
      avgResponseTime: '2.3 min',
      favoriteTopics: ['Strings', 'Arrays', 'Trees']
    }
  });

  users.set('user2', {
    id: 'user2',
    name: 'Sarah Chen',
    avatar: 'SC',
    email: 'sarah@example.com',
    joinDate: '2024-02-15',
    currentXP: 1890,
    nextLevelXP: 2000,
    rank: 12,
    totalHelped: 89,
    rating: 4.9,
    badges: [
      { id: 'badge3', name: 'Quick Responder', description: 'Average response time under 3 minutes', earned: '2024-03-10' }
    ],
    stats: {
      problemsSolved: 67,
      helpStreak: 8,
      avgResponseTime: '1.8 min',
      favoriteTopics: ['Dynamic Programming', 'Graphs', 'Trees']
    }
  });

  // Sample help requests
  helpRequests.set('req1', {
    id: 'req1',
    problemTitle: 'Two Sum',
    difficulty: 'Easy',
    requesterId: 'user3',
    requesterName: 'Alex Johnson',
    timeStuck: '8 minutes',
    attempts: 4,
    message: 'I\'m getting a time limit exceeded error. I think my nested loop approach isn\'t efficient enough.',
    tags: ['Array', 'Hash Table'],
    urgent: false,
    status: 'open',
    createdAt: new Date().toISOString(),
    code: 'function twoSum(nums, target) {\n  // Your code here\n}'
  });

  helpRequests.set('req2', {
    id: 'req2',
    problemTitle: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    requesterId: 'user4',
    requesterName: 'Emma Davis',
    timeStuck: '15 minutes',
    attempts: 6,
    message: 'Having trouble with the dynamic programming approach. My solution works for small inputs but fails for larger ones.',
    tags: ['String', 'Dynamic Programming'],
    urgent: true,
    status: 'open',
    createdAt: new Date().toISOString()
  });

  // Sample problems
  problems.set('prob1', {
    id: 'prob1',
    title: 'Two Sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    tags: ['Array', 'Hash Table'],
    testCases: [
      { input: '[2,7,11,15], target = 9', output: '[0,1]', description: 'Basic case' },
      { input: '[3,2,4], target = 6', output: '[1,2]', description: 'Target in middle' }
    ]
  });

  problems.set('prob2', {
    id: 'prob2',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    description: 'Given a string s, return the longest palindromic substring in s.',
    tags: ['String', 'Dynamic Programming'],
    testCases: [
      { input: '"babad"', output: '"bab"', description: 'Basic palindrome' },
      { input: '"cbbd"', output: '"bb"', description: 'Even length palindrome' }
    ]
  });

  // Sample leaderboard
  leaderboard.push(
    { rank: 1, userId: 'user1', name: 'Alex Thompson', avatar: 'AT', xp: 2480, totalHelped: 134, rating: 4.6 },
    { rank: 2, userId: 'user2', name: 'Sarah Chen', avatar: 'SC', xp: 1890, totalHelped: 89, rating: 4.9 },
    { rank: 3, userId: 'user5', name: 'Mike Wilson', avatar: 'MW', xp: 1650, totalHelped: 67, rating: 4.7 }
  );
}

// WebSocket server for real-time chat
const wss = new WebSocketServer({ port: 3002 });
const sessions = new Map(); // sessionId -> Set of WebSocket connections

wss.on('connection', (ws, req) => {
  const sessionId = req.url.split('/').pop();
  
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, new Set());
  }
  sessions.get(sessionId).add(ws);

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      const chatMessage = {
        id: uuidv4(),
        sessionId,
        senderId: message.senderId || 'anonymous',
        senderName: message.senderName || 'Anonymous',
        message: message.message,
        timestamp: new Date().toISOString(),
        type: 'text'
      };

      // Broadcast to all connections in this session
      sessions.get(sessionId).forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
          client.send(JSON.stringify(chatMessage));
        }
      });
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    sessions.get(sessionId)?.delete(ws);
    if (sessions.get(sessionId)?.size === 0) {
      sessions.delete(sessionId);
    }
  });
});

// API Routes

// User routes
app.get('/api/user/me', (req, res) => {
  // In a real app, this would check authentication
  const userId = req.headers['user-id'] || 'user1';
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

app.put('/api/user/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const updatedUser = { ...user, ...req.body };
  users.set(userId, updatedUser);
  
  res.json(updatedUser);
});

app.get('/api/user/:userId/stats', (req, res) => {
  const { userId } = req.params;
  const user = users.get(userId);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user.stats);
});

// Help requests routes
app.get('/api/help-requests', (req, res) => {
  const { difficulty, status, tags } = req.query;
  let filteredRequests = Array.from(helpRequests.values());
  
  if (difficulty) {
    filteredRequests = filteredRequests.filter(req => req.difficulty === difficulty);
  }
  
  if (status) {
    filteredRequests = filteredRequests.filter(req => req.status === status);
  }
  
  if (tags) {
    const tagArray = tags.split(',');
    filteredRequests = filteredRequests.filter(req => 
      tagArray.some(tag => req.tags.includes(tag))
    );
  }
  
  res.json(filteredRequests);
});

app.post('/api/help-requests', (req, res) => {
  const requestId = uuidv4();
  const helpRequest = {
    id: requestId,
    ...req.body,
    status: 'open',
    createdAt: new Date().toISOString()
  };
  
  helpRequests.set(requestId, helpRequest);
  res.status(201).json(helpRequest);
});

app.post('/api/help-requests/:requestId/accept', (req, res) => {
  const { requestId } = req.params;
  const helpRequest = helpRequests.get(requestId);
  
  if (!helpRequest) {
    return res.status(404).json({ error: 'Help request not found' });
  }
  
  if (helpRequest.status !== 'open') {
    return res.status(400).json({ error: 'Help request is not available' });
  }
  
  const sessionId = uuidv4();
  const session = {
    id: sessionId,
    requestId,
    requesterId: helpRequest.requesterId,
    helperId: req.headers['user-id'] || 'user1',
    status: 'active',
    messages: [],
    startedAt: new Date().toISOString()
  };
  
  helpSessions.set(sessionId, session);
  helpRequest.status = 'matched';
  helpRequests.set(requestId, helpRequest);
  
  res.json(session);
});

// Session routes
app.get('/api/sessions/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const session = helpSessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  res.json(session);
});

app.post('/api/sessions/:sessionId/messages', (req, res) => {
  const { sessionId } = req.params;
  const { message } = req.body;
  const session = helpSessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  const chatMessage = {
    id: uuidv4(),
    sessionId,
    senderId: req.headers['user-id'] || 'user1',
    senderName: req.headers['user-name'] || 'Anonymous',
    message,
    timestamp: new Date().toISOString(),
    type: 'text'
  };
  
  session.messages.push(chatMessage);
  helpSessions.set(sessionId, session);
  
  res.json(chatMessage);
});

app.put('/api/sessions/:sessionId/end', (req, res) => {
  const { sessionId } = req.params;
  const { rating, feedback } = req.body;
  const session = helpSessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  session.status = 'completed';
  session.endedAt = new Date().toISOString();
  session.rating = rating;
  session.feedback = feedback;
  
  helpSessions.set(sessionId, session);
  
  res.json(session);
});

// Problems routes
app.get('/api/problems', (req, res) => {
  const { difficulty, tags } = req.query;
  let filteredProblems = Array.from(problems.values());
  
  if (difficulty) {
    filteredProblems = filteredProblems.filter(prob => prob.difficulty === difficulty);
  }
  
  if (tags) {
    const tagArray = tags.split(',');
    filteredProblems = filteredProblems.filter(prob => 
      tagArray.some(tag => prob.tags.includes(tag))
    );
  }
  
  res.json(filteredProblems);
});

app.get('/api/problems/:problemId', (req, res) => {
  const { problemId } = req.params;
  const problem = problems.get(problemId);
  
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }
  
  res.json(problem);
});

// Leaderboard route
app.get('/api/leaderboard', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(leaderboard.slice(0, limit));
});

// Global stats route
app.get('/api/stats/global', (req, res) => {
  res.json({
    totalUsers: users.size,
    totalSessions: helpSessions.size,
    activeSessions: Array.from(helpSessions.values()).filter(s => s.status === 'active').length,
    problemsSolved: Array.from(users.values()).reduce((sum, user) => sum + user.stats.problemsSolved, 0)
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize sample data
initializeSampleData();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server running on ws://localhost:3002`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
});

module.exports = app; 