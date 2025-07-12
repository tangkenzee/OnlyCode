// API client for OnlyCode backend
const API_BASE_URL =
    import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface User {
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

export interface Badge {
  id: string;
  name: string;
  description: string;
  earned: string;
  icon?: string;
}

export interface UserStats {
  problemsSolved: number;
  helpStreak: number;
  avgResponseTime: string;
  favoriteTopics: string[];
}

export interface HelpRequest {
  id: string;
  problemTitle: string;
  difficulty: 'Easy'|'Medium'|'Hard';
  requesterId: string;
  requesterName: string;
  timeStuck: string;
  attempts: number;
  message: string;
  tags: string[];
  urgent: boolean;
  status: 'open'|'matched'|'completed';
  createdAt: string;
  code?: string;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text'|'code'|'hint';
}

export interface HelpSession {
  id: string;
  requestId: string;
  requesterId: string;
  helperId: string;
  status: 'active'|'completed'|'cancelled';
  messages: ChatMessage[];
  startedAt: string;
  endedAt?: string;
  rating?: number;
  feedback?: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy'|'Medium'|'Hard';
  description: string;
  tags: string[];
  testCases: TestCase[];
  solution?: string;
}

export interface TestCase {
  input: string;
  output: string;
  description?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  totalHelped: number;
  rating: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}):
      Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'user-id': 'user1',  // Default user for development
        'user-name': 'Alex Thompson',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log(`Making API request to: ${url}`);
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API Error ${response.status}: ${errorText}`);
        throw new Error(`HTTP error! status: ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log(`API response from ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);

      // Return mock data for development if backend is not available
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.warn('Backend not available, using mock data');
        return this.getMockData<T>(endpoint);
      }

      throw error;
    }
  }

  private getMockData<T>(endpoint: string): T {
    // Mock data for development when backend is not running
    const mockData: Record<string, any> = {
      '/user/me': {
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
          {
            id: 'badge1',
            name: 'String Master',
            description: 'Helped 25+ people with string problems',
            earned: '2024-01-15'
          },
          {
            id: 'badge2',
            name: 'Helpful',
            description: 'Maintained 4.5+ rating for 30 days',
            earned: '2024-02-20'
          }
        ],
        stats: {
          problemsSolved: 89,
          helpStreak: 12,
          avgResponseTime: '2.3 min',
          favoriteTopics: ['Strings', 'Arrays', 'Trees']
        }
      },
      '/help-requests': [
        {
          id: 'req1',
          problemTitle: 'Two Sum',
          difficulty: 'Easy',
          requesterId: 'user3',
          requesterName: 'Alex Johnson',
          timeStuck: '8 minutes',
          attempts: 4,
          message:
              'I\'m getting a time limit exceeded error. I think my nested loop approach isn\'t efficient enough.',
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
          message:
              'Having trouble with the dynamic programming approach. My solution works for small inputs but fails for larger ones.',
          tags: ['String', 'Dynamic Programming'],
          urgent: true,
          status: 'open',
          createdAt: new Date().toISOString()
        }
      ],
      '/leaderboard': [
        {
          rank: 1,
          userId: 'user1',
          name: 'Alex Thompson',
          avatar: 'AT',
          xp: 2480,
          totalHelped: 134,
          rating: 4.6
        },
        {
          rank: 2,
          userId: 'user2',
          name: 'Sarah Chen',
          avatar: 'SC',
          xp: 1890,
          totalHelped: 89,
          rating: 4.9
        },
        {
          rank: 3,
          userId: 'user5',
          name: 'Mike Wilson',
          avatar: 'MW',
          xp: 1650,
          totalHelped: 67,
          rating: 4.7
        }
      ]
    };

    return mockData[endpoint] || [];
  }

  // User Management
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/user/me');
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
    return this.request<User>(`/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Help Requests
  async getHelpRequests(
      filters?: {difficulty?: string; status?: string; tags?: string[];}):
      Promise<HelpRequest[]> {
    const params = new URLSearchParams();
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.tags) params.append('tags', filters.tags.join(','));

    return this.request<HelpRequest[]>(`/help-requests?${params.toString()}`);
  }

  async createHelpRequest(data: {
    problemTitle: string; difficulty: string; message: string; tags: string[];
    code?: string; attempts: number; timeStuck: string;
  }): Promise<HelpRequest> {
    return this.request<HelpRequest>('/help-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async acceptHelpRequest(requestId: string): Promise<HelpSession> {
    return this.request<HelpSession>(`/help-requests/${requestId}/accept`, {
      method: 'POST',
    });
  }

  // Chat & Sessions
  async getHelpSession(sessionId: string): Promise<HelpSession> {
    return this.request<HelpSession>(`/sessions/${sessionId}`);
  }

  async sendMessage(sessionId: string, message: string): Promise<ChatMessage> {
    return this.request<ChatMessage>(`/sessions/${sessionId}/messages`, {
      method: 'POST',
      body: JSON.stringify({message}),
    });
  }

  async endSession(sessionId: string, rating?: number, feedback?: string):
      Promise<HelpSession> {
    return this.request<HelpSession>(`/sessions/${sessionId}/end`, {
      method: 'PUT',
      body: JSON.stringify({rating, feedback}),
    });
  }

  // Problems
  async getProblems(filters?: {difficulty?: string; tags?: string[];}):
      Promise<Problem[]> {
    const params = new URLSearchParams();
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.tags) params.append('tags', filters.tags.join(','));

    return this.request<Problem[]>(`/problems?${params.toString()}`);
  }

  async getProblem(problemId: string): Promise<Problem> {
    return this.request<Problem>(`/problems/${problemId}`);
  }

  // Leaderboard
  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    return this.request<LeaderboardEntry[]>(`/leaderboard?limit=${limit}`);
  }

  // Real-time updates (WebSocket)
  subscribeToSession(
      sessionId: string, onMessage: (message: ChatMessage) => void) {
    const ws = new WebSocket(
        `${this.baseUrl.replace('http', 'ws')}/sessions/${sessionId}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    return {
      send: (message: string) => ws.send(JSON.stringify({message})),
      close: () => ws.close(),
    };
  }

  // Statistics
  async getUserStats(userId: string): Promise<UserStats> {
    return this.request<UserStats>(`/user/${userId}/stats`);
  }

  async getGlobalStats(): Promise<{
    totalUsers: number; totalSessions: number; activeSessions: number;
    problemsSolved: number;
  }> {
    return this.request('/stats/global');
  }
}

export const apiClient = new ApiClient();
export default apiClient;