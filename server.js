const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load data from db.json
const dbPath = path.join(__dirname, 'db.json');
let db = { users: {}, helpRequests: [], leaderboard: [] };
try {
  const dbRaw = fs.readFileSync(dbPath, 'utf-8');
  db = JSON.parse(dbRaw);
} catch (err) {
  console.error('Failed to load db.json:', err);
}

const users = db.users;
const helpRequests = db.helpRequests;
const leaderboard = db.leaderboard;

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