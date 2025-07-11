const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample data
const users = {
  user1: {
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
  }
};

const helpRequests = [
  {
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
  },
  {
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
  }
];

const leaderboard = [
  { rank: 1, userId: 'user1', name: 'Alex Thompson', avatar: 'AT', xp: 2480, totalHelped: 134, rating: 4.6 },
  { rank: 2, userId: 'user2', name: 'Sarah Chen', avatar: 'SC', xp: 1890, totalHelped: 89, rating: 4.9 },
  { rank: 3, userId: 'user5', name: 'Mike Wilson', avatar: 'MW', xp: 1650, totalHelped: 67, rating: 4.7 }
];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/user/me', (req, res) => {
  const userId = req.headers['user-id'] || 'user1';
  const user = users[userId];
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

app.get('/api/help-requests', (req, res) => {
  const { difficulty, status } = req.query;
  let filteredRequests = helpRequests;
  
  if (difficulty && difficulty !== 'All') {
    filteredRequests = filteredRequests.filter(req => req.difficulty === difficulty);
  }
  
  if (status) {
    filteredRequests = filteredRequests.filter(req => req.status === status);
  }
  
  res.json(filteredRequests);
});

app.post('/api/help-requests/:requestId/accept', (req, res) => {
  const { requestId } = req.params;
  const helpRequest = helpRequests.find(req => req.id === requestId);
  
  if (!helpRequest) {
    return res.status(404).json({ error: 'Help request not found' });
  }
  
  if (helpRequest.status !== 'open') {
    return res.status(400).json({ error: 'Help request is not available' });
  }
  
  const sessionId = `session_${Date.now()}`;
  const session = {
    id: sessionId,
    requestId,
    requesterId: helpRequest.requesterId,
    helperId: req.headers['user-id'] || 'user1',
    status: 'active',
    messages: [],
    startedAt: new Date().toISOString()
  };
  
  helpRequest.status = 'matched';
  
  res.json(session);
});

app.get('/api/leaderboard', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(leaderboard.slice(0, limit));
});

app.get('/api/stats/global', (req, res) => {
  res.json({
    totalUsers: Object.keys(users).length,
    totalSessions: 0,
    activeSessions: 0,
    problemsSolved: Object.values(users).reduce((sum, user) => sum + user.stats.problemsSolved, 0)
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app; 