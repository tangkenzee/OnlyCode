const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Judge0 CE API Configuration
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY || 'your-rapidapi-key-here';
const JUDGE0_BASE_URL = 'https://judge0-ce.p.rapidapi.com';

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

// New endpoint for skill-based matchmaking
app.get('/api/matchmaking/skills', (req, res) => {
  const { skills, limit = 10 } = req.query;
  
  if (!skills) {
    return res.status(400).json({ error: 'Skills parameter is required' });
  }
  
  const requiredSkills = skills.split(',').map(skill => skill.trim());
  const availableUsers = Object.values(users).filter(user => user.id !== (req.headers['user-id'] || 'user1'));
  
  // Calculate skill-based match scores for each user
  const userMatches = availableUsers.map(user => {
    let totalSkillScore = 0;
    let matchedSkills = 0;
    
    requiredSkills.forEach(skill => {
      if (user.skillRatings && user.skillRatings[skill]) {
        totalSkillScore += user.skillRatings[skill];
        matchedSkills++;
      }
    });
    
    const averageSkillRating = matchedSkills > 0 ? totalSkillScore / matchedSkills : 0;
    const skillMatchPercentage = (matchedSkills / requiredSkills.length) * 100;
    
    return {
      user: {
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        currentXP: user.currentXP,
        totalHelped: user.totalHelped,
        overallRating: user.overallRating,
        skillRatings: user.skillRatings
      },
      skillMatch: Math.round(skillMatchPercentage),
      averageSkillRating: Math.round(averageSkillRating * 10) / 10,
      matchedSkills: matchedSkills,
      totalRequiredSkills: requiredSkills.length,
      isOnline: Math.random() > 0.3, // Mock online status
      responseTime: `${Math.floor(Math.random() * 5) + 1} min`
    };
  });
  
  // Sort by skill match percentage, then by average skill rating
  const sortedMatches = userMatches
    .filter(match => match.skillMatch > 0) // Only include users with some skill match
    .sort((a, b) => {
      if (b.skillMatch !== a.skillMatch) {
        return b.skillMatch - a.skillMatch;
      }
      return b.averageSkillRating - a.averageSkillRating;
    })
    .slice(0, parseInt(limit));
  
  res.json(sortedMatches);
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

// Code execution endpoint using Judge0 CE API
app.post('/api/execute-code', async (req, res) => {
  const { code, language = 'javascript', testCases = [] } = req.body;
  
  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    // Language ID mapping for Judge0
    const languageMap = {
      'javascript': 63, // Node.js
      'python': 71,    // Python 3
      'java': 62,      // Java
      'cpp': 54,       // C++17
      'c': 50,         // C
      'csharp': 51,    // C#
      'php': 68,       // PHP
      'ruby': 72,      // Ruby
      'swift': 83,     // Swift
      'go': 60,        // Go
      'rust': 73,      // Rust
      'kotlin': 78,    // Kotlin
      'scala': 81,     // Scala
      'r': 80,         // R
      'dart': 69,      // Dart
      'elixir': 57,    // Elixir
      'erlang': 58,    // Erlang
      'clojure': 86,   // Clojure
      'fsharp': 87,    // F#
      'fortran': 54,   // Fortran
      'assembly': 45,  // Assembly
      'bash': 46,      // Bash
      'basic': 47,     // Basic
      'cobol': 49,     // COBOL
      'lisp': 64,      // Common Lisp
      'lua': 70,       // Lua
      'nim': 88,       // Nim
      'objectivec': 79, // Objective-C
      'ocaml': 81,     // OCaml
      'pascal': 67,    // Pascal
      'perl': 85,      // Perl
      'prolog': 66,    // Prolog
      'sql': 82,       // SQL
      'typescript': 74, // TypeScript
      'vb': 84,        // Visual Basic
    };

    const languageId = languageMap[language.toLowerCase()] || 63; // Default to JavaScript

    // Submit code for compilation
    const submitResponse = await axios.post(`${JUDGE0_BASE_URL}/submissions`, {
      source_code: code,
      language_id: languageId,
      stdin: testCases.length > 0 ? testCases[0].input : '',
      expected_output: testCases.length > 0 ? testCases[0].expected : '',
      cpu_time_limit: 5,
      memory_limit: 512000,
      enable_network: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': JUDGE0_API_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    });

    const submissionToken = submitResponse.data.token;

    // Poll for results
    let result;
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

      const statusResponse = await axios.get(`${JUDGE0_BASE_URL}/submissions/${submissionToken}`, {
        headers: {
          'X-RapidAPI-Key': JUDGE0_API_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
        }
      });

      result = statusResponse.data;
      
      if (result.status.id > 2) { // Status > 2 means processing is complete
        break;
      }
      
      attempts++;
    }

    // Process the result
    const statusMessages = {
      1: 'In Queue',
      2: 'Processing',
      3: 'Accepted',
      4: 'Wrong Answer',
      5: 'Time Limit Exceeded',
      6: 'Compilation Error',
      7: 'Runtime Error (SIGSEGV)',
      8: 'Runtime Error (SIGXFSZ)',
      9: 'Runtime Error (SIGFPE)',
      10: 'Runtime Error (SIGABRT)',
      11: 'Runtime Error (NZEC)',
      12: 'Runtime Error (Other)',
      13: 'Internal Error',
      14: 'Exec Format Error'
    };

    const response = {
      success: result.status.id === 3,
      status: statusMessages[result.status.id] || 'Unknown Status',
      output: result.stdout || '',
      error: result.stderr || '',
      compileOutput: result.compile_output || '',
      time: result.time || 0,
      memory: result.memory || 0,
      language: language,
      testCases: testCases.map((testCase, index) => ({
        input: testCase.input,
        expected: testCase.expected,
        actual: index === 0 ? result.stdout : 'Not executed',
        passed: index === 0 ? (result.status.id === 3 && result.stdout?.trim() === testCase.expected?.toString()) : false
      }))
    };

    res.json(response);

  } catch (error) {
    console.error('Code execution error:', error);
    res.status(500).json({
      success: false,
      error: 'Code execution failed',
      details: error.message
    });
  }
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