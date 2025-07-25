const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const {WebSocketServer} = require('ws');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Judge0 CE API Configuration
const JUDGE0_API_KEY = process.env.JUDGE0_API_KEY;
const JUDGE0_BASE_URL =
    process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Load data from db.json
const dbPath = path.join(__dirname, '../db.json');
let db = {users: {}, helpRequests: [], leaderboard: [], problems: []};
try {
  const dbRaw = fs.readFileSync(dbPath, 'utf-8');
  db = JSON.parse(dbRaw);
} catch (err) {
  console.error('Failed to load db.json:', err);
}

const users = db.users;
const helpRequests = db.helpRequests;
const leaderboard = db.leaderboard;
const problems = db.problems || [];

// WebSocket server for real-time chat and pair programming
const wss = new WebSocketServer({port: 3002});
const sessions = new Map();  // sessionId -> Set of WebSocket connections

// Global pair programming room state
const globalPairProgrammingRoom = {
  id: 'global-pair-programming',
  users: new Set(),  // Set of user objects
  code: `function twoSum(nums, target) {
  // Your code here
  
}

// Test the function
console.log(twoSum([2, 7, 11, 15], 9)); // Should output [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Should output [1, 2]
console.log(twoSum([3, 3], 6)); // Should output [0, 1]`,
  problem: {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    description:
        `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    tags: ['Array', 'Hash Table'],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      }
    ]
  }
};

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, 'http://localhost');
  const sessionId = url.pathname.split('/').pop();
  const isPairProgramming = url.searchParams.get('type') === 'pair-programming';

  if (isPairProgramming) {
    // Handle pair programming room
    const userId = url.searchParams.get('userId') || 'anonymous';
    const userName = url.searchParams.get('userName') || 'Anonymous';

    // Add user to global room
    const user = {id: userId, name: userName, ws};
    globalPairProgrammingRoom.users.add(user);

    // Send current room state to new user
    ws.send(JSON.stringify({
      type: 'room-joined',
      users: Array.from(globalPairProgrammingRoom.users)
                 .map(u => ({id: u.id, name: u.name})),
      code: globalPairProgrammingRoom.code,
      problem: globalPairProgrammingRoom.problem
    }));

    // Notify other users about new participant
    globalPairProgrammingRoom.users.forEach(client => {
      if (client.ws !== ws && client.ws.readyState === 1) {
        client.ws.send(JSON.stringify(
            {type: 'user-joined', user: {id: userId, name: userName}}));
      }
    });

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data);

        if (message.type === 'code-change') {
          // Update global code
          globalPairProgrammingRoom.code = message.code;

          // Broadcast code change to all users
          globalPairProgrammingRoom.users.forEach(client => {
            if (client.ws !== ws && client.ws.readyState === 1) {
              client.ws.send(JSON.stringify({
                type: 'code-updated',
                code: message.code,
                userId: userId,
                userName: userName
              }));
            }
          });
        } else if (message.type === 'chat-message') {
          // Handle chat messages
          const chatMessage = {
            id: uuidv4(),
            senderId: userId,
            senderName: userName,
            message: message.message,
            timestamp: new Date().toISOString(),
            type: 'text'
          };

          // Broadcast chat message to all users
          globalPairProgrammingRoom.users.forEach(client => {
            if (client.ws.readyState === 1) {
              client.ws.send(
                  JSON.stringify({type: 'chat-message', ...chatMessage}));
            }
          });
        }
      } catch (error) {
        console.error('Error processing pair programming message:', error);
      }
    });

    ws.on('close', () => {
      // Remove user from global room
      globalPairProgrammingRoom.users.forEach(client => {
        if (client.ws === ws) {
          globalPairProgrammingRoom.users.delete(client);
        }
      });

      // Notify other users about departure
      globalPairProgrammingRoom.users.forEach(client => {
        if (client.ws.readyState === 1) {
          client.ws.send(JSON.stringify(
              {type: 'user-left', userId: userId, userName: userName}));
        }
      });
    });
  } else {
    // Handle regular chat sessions (existing logic)
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
          if (client.readyState === 1) {  // WebSocket.OPEN
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
  }
});

// API Routes

// User routes
app.get('/api/user/me', (req, res) => {
  // In a real app, this would check authentication
  const userId = req.headers['user-id'] || 'user1';
  const user = users[userId];

  if (!user) {
    return res.status(404).json({error: 'User not found'});
  }

  res.json(user);
});

// New endpoint for skill-based matchmaking
app.get('/api/matchmaking/skills', (req, res) => {
  const {skills, limit = 10} = req.query;

  if (!skills) {
    return res.status(400).json({error: 'Skills parameter is required'});
  }

  const requiredSkills = skills.split(',').map(skill => skill.trim());
  const availableUsers = Object.values(users).filter(
      user => user.id !== (req.headers['user-id'] || 'user1'));

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

    const averageSkillRating =
        matchedSkills > 0 ? totalSkillScore / matchedSkills : 0;
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
      isOnline: Math.random() > 0.3,  // Mock online status
      responseTime: `${Math.floor(Math.random() * 5) + 1} min`
    };
  });

  // Sort by skill match percentage, then by average skill rating
  const sortedMatches =
      userMatches
          .filter(
              match => match.skillMatch >
                  0)  // Only include users with some skill match
          .sort((a, b) => {
            if (b.skillMatch !== a.skillMatch) {
              return b.skillMatch - a.skillMatch;
            }
            return b.averageSkillRating - a.averageSkillRating;
          })
          .slice(0, parseInt(limit));

  res.json(sortedMatches);
});

app.put('/api/user/:userId', (req, res) => {
  const {userId} = req.params;
  const user = users[userId];

  if (!user) {
    return res.status(404).json({error: 'User not found'});
  }

  const updatedUser = {...user, ...req.body};
  users[userId] = updatedUser;

  res.json(updatedUser);
});

app.get('/api/user/:userId/stats', (req, res) => {
  const {userId} = req.params;
  const user = users[userId];

  if (!user) {
    return res.status(404).json({error: 'User not found'});
  }

  res.json(user.stats);
});

// Users route
app.get('/api/users', (req, res) => {
  res.json(Object.values(users));
});

// Help requests routes
app.get('/api/help-requests', (req, res) => {
  const {difficulty, status, tags} = req.query;
  let filteredRequests = helpRequests;

  if (difficulty) {
    filteredRequests =
        filteredRequests.filter(req => req.difficulty === difficulty);
  }

  if (status) {
    filteredRequests = filteredRequests.filter(req => req.status === status);
  }

  if (tags) {
    const tagArray = tags.split(',');
    filteredRequests = filteredRequests.filter(
        req => tagArray.some(tag => req.tags.includes(tag)));
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

  helpRequests.push(helpRequest);
  res.status(201).json(helpRequest);
});

app.post('/api/help-requests/:requestId/accept', (req, res) => {
  const {requestId} = req.params;
  const helpRequest = helpRequests.find(req => req.id === requestId);

  if (!helpRequest) {
    return res.status(404).json({error: 'Help request not found'});
  }

  if (helpRequest.status !== 'open') {
    return res.status(400).json({error: 'Help request is not available'});
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

  // In a real app, you'd save this session to a Map or DB
  // For now, we'll just return it

  helpRequest.status = 'matched';

  res.json(session);
});

// Session routes
app.get('/api/sessions/:sessionId', (req, res) => {
  const {sessionId} = req.params;
  // In a real app, you'd fetch this session from a Map or DB
  const session = sessions.get(sessionId);  // This will be undefined

  if (!session) {
    return res.status(404).json({error: 'Session not found'});
  }

  res.json(session);
});

app.post('/api/sessions/:sessionId/messages', (req, res) => {
  const {sessionId} = req.params;
  const {message} = req.body;
  // In a real app, you'd fetch this session from a Map or DB
  const session = sessions.get(sessionId);  // This will be undefined

  if (!session) {
    return res.status(404).json({error: 'Session not found'});
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
  // In a real app, you'd save this session to a Map or DB

  res.json(chatMessage);
});

app.put('/api/sessions/:sessionId/end', (req, res) => {
  const {sessionId} = req.params;
  const {rating, feedback} = req.body;
  // In a real app, you'd fetch this session from a Map or DB
  const session = sessions.get(sessionId);  // This will be undefined

  if (!session) {
    return res.status(404).json({error: 'Session not found'});
  }

  session.status = 'completed';
  session.endedAt = new Date().toISOString();
  session.rating = rating;
  session.feedback = feedback;

  // In a real app, you'd save this session to a Map or DB

  res.json(session);
});

// Problems routes
app.get('/api/problems', (req, res) => {
  const {difficulty, tags} = req.query;
  let filteredProblems = problems;
  if (difficulty) {
    filteredProblems =
        filteredProblems.filter(prob => prob.difficulty === difficulty);
  }
  if (tags) {
    const tagArray = tags.split(',');
    filteredProblems = filteredProblems.filter(
        prob => tagArray.some(tag => prob.tags.includes(tag)));
  }
  res.json(filteredProblems);
});

app.get('/api/problems/:problemId', (req, res) => {
  const {problemId} = req.params;
  const problem = problems.find(p => p.id === problemId);
  if (!problem) {
    return res.status(404).json({error: 'Problem not found'});
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
    totalUsers: Object.keys(users).length,
    totalSessions: sessions.size,
    activeSessions:
        Array.from(sessions.values()).filter(s => s.status === 'active').length,
    problemsSolved: Object.values(users).reduce(
        (sum, user) => sum + user.stats.problemsSolved, 0)
  });
});

const USE_JUDGE0 = process.env.USE_JUDGE0 !== 'false';

// Code execution endpoint using Judge0 CE API
app.post('/api/execute-code', async (req, res) => {
  const {code, language = 'javascript', testCases = []} = req.body;

  if (!code) {
    return res.status(400).json({error: 'Code is required'});
  }

  if (!USE_JUDGE0) {
    // Judge0 is disabled: always return wrong answer
    const response = {
      success: false,
      status: 'Wrong Answer',
      output: '',
      error: '',
      compileOutput: '',
      time: 0,
      memory: 0,
      language,
      testCases: testCases.map(testCase => ({
                                 input: testCase.input,
                                 expected: testCase.expected,
                                 actual: '',
                                 passed: false
                               }))
    };
    return res.json(response);
  }

  try {
    // Language ID mapping for Judge0
    const languageMap = {
      'javascript': 63,  // Node.js
      'python': 71,      // Python 3
      'java': 62,        // Java
      'cpp': 54,         // C++17
      'c': 50,           // C
      'csharp': 51,      // C#
      'php': 68,         // PHP
      'ruby': 72,        // Ruby
      'swift': 83,       // Swift
      'go': 60,          // Go
      'rust': 73,        // Rust
      'kotlin': 78,      // Kotlin
      'scala': 81,       // Scala
      'r': 80,           // R
      'dart': 69,        // Dart
      'elixir': 57,      // Elixir
      'erlang': 58,      // Erlang
      'clojure': 86,     // Clojure
      'fsharp': 87,      // F#
      'fortran': 54,     // Fortran
      'assembly': 45,    // Assembly
      'bash': 46,        // Bash
      'basic': 47,       // Basic
      'cobol': 49,       // COBOL
      'lisp': 64,        // Common Lisp
      'lua': 70,         // Lua
      'nim': 88,         // Nim
      'objectivec': 79,  // Objective-C
      'ocaml': 81,       // OCaml
      'pascal': 67,      // Pascal
      'perl': 85,        // Perl
      'prolog': 66,      // Prolog
      'sql': 82,         // SQL
      'typescript': 74,  // TypeScript
      'vb': 84,          // Visual Basic
    };

    const languageId =
        languageMap[language.toLowerCase()] || 63;  // Default to JavaScript

    // Submit code for compilation
    const submitResponse = await axios.post(
        `${JUDGE0_BASE_URL.replace(/\/+$/, '')}/submissions`, {
          source_code: code,
          language_id: languageId,
          stdin: testCases.length > 0 ? testCases[0].input : '',
          expected_output: testCases.length > 0 ? testCases[0].expected : '',
          cpu_time_limit: 5,
          memory_limit: 512000,
          enable_network: false
        },
        {
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
      await new Promise(resolve => setTimeout(resolve, 1000));  // Wait 1 second

      const statusResponse = await axios.get(
          `${JUDGE0_BASE_URL.replace(/\/+$/, '')}/submissions/${
              submissionToken}`,
          {
            headers: {
              'X-RapidAPI-Key': JUDGE0_API_KEY,
              'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            }
          });

      result = statusResponse.data;

      if (result.status.id > 2) {  // Status > 2 means processing is complete
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
      testCases: testCases.map((testCase, index) => {
        let passed = false;
        if (index === 0 && result.status.id === 3) {
          let actual = result.stdout?.trim();
          let expected = testCase.expected?.toString();
          try {
            const actualJson = JSON.parse(actual);
            const expectedJson = JSON.parse(expected);
            passed =
                JSON.stringify(actualJson) === JSON.stringify(expectedJson);
          } catch {
            // Compare as arrays of CSV values
            const extractCSV = (str) => str.replace(/\[|\]|\s|\n/g, '').trim();
            const actualCSV = extractCSV(actual).split(',');
            const expectedCSV = extractCSV(expected).split(',');
            console.log('DEBUG:', {actual, expected, actualCSV, expectedCSV});
            if (actual && expected && actualCSV.length === expectedCSV.length &&
                actualCSV.every((v, i) => v === expectedCSV[i])) {
              passed = true;
            } else {
              // Fallback to whitespace-insensitive string comparison
              passed =
                  actual?.replace(/\s+/g, '') === expected?.replace(/\s+/g, '');
            }
          }
        }
        return {
          input: testCase.input,
          expected: testCase.expected,
          actual: index === 0 ? result.stdout : 'Not executed',
          passed
        };
      })
    };

    res.json(response);

  } catch (error) {
    console.error('Code execution error:', error);
    if (error.response) {
      console.error('Judge0 API error response:', error.response.data);
    }
    res.status(500).json({
      success: false,
      error: 'Code execution failed',
      details: error.message,
      judge0: error.response ? error.response.data : undefined
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({status: 'ok', timestamp: new Date().toISOString()});
});

// Initialize sample data
// This function is no longer needed as data is loaded from db.json

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server running on ws://localhost:3002`);
  console.log(`📊 API available at http://localhost:${PORT}/api`);
  console.log(
      'JUDGE0_API_KEY loaded:',
      process.env.JUDGE0_API_KEY ? '[HIDDEN]' : 'undefined');
});

module.exports = app;