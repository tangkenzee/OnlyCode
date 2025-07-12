// Simple API client for OnlyCode
const API_BASE_URL = 'http://localhost:3001/api';

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

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  xp: number;
  problemsSolved: number;
  helpGiven: number;
}

export interface CodeExecutionResult {
  success: boolean;
  status: string;
  output: string;
  error: string;
  compileOutput: string;
  time: number;
  memory: number;
  language: string;
  testCases: Array<{
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
  }>;
}

export interface CodeExecutionRequest {
  code: string;
  language?: string;
  testCases?: Array<{
    input: string;
    expected: string;
  }>;
}

class SimpleApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    try {
      console.log(`API request: ${url}`);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'user1',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`API response:`, data);
      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // User Management
  async getCurrentUser(): Promise<User> {
    return this.request<User>('/user/me');
  }

  // Help Requests
  async getHelpRequests(filters?: {difficulty?: string; status?: string;}):
      Promise<HelpRequest[]> {
    const params = new URLSearchParams();
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.status) params.append('status', filters.status);

    const query = params.toString();
    const endpoint = query ? `/help-requests?${query}` : '/help-requests';
    return this.request<HelpRequest[]>(endpoint);
  }

  async acceptHelpRequest(requestId: string): Promise<any> {
    const url = `${this.baseUrl}/help-requests/${requestId}/accept`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'user1',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Accept help request failed:', error);
      throw error;
    }
  }

  async createHelpRequest(data: {
    problemTitle: string;
    difficulty: string;
    message: string;
    tags: string[];
    code?: string;
    attempts: number;
    timeStuck: string;
  }): Promise<HelpRequest> {
    const url = `${this.baseUrl}/help-requests`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': 'user1',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Create help request failed:', error);
      throw error;
    }
  }

  // Leaderboard
  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    return this.request<LeaderboardEntry[]>(`/leaderboard?limit=${limit}`);
  }

  // Health check
  async healthCheck(): Promise<{status: string; timestamp: string}> {
    return this.request<{status: string; timestamp: string}>('/health');
  }

  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResult> {
    const response = await fetch(`${API_BASE_URL}/execute-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Code execution failed: ${response.statusText}`);
    }

    return response.json();
  }
}

export const api = {
  // User Management
  async getCurrentUser(): Promise<User> {
    return apiClient.getCurrentUser();
  },

  // Help Requests
  async getHelpRequests(filters?: {
    difficulty?: string;
    status?: string;
  }): Promise<HelpRequest[]> {
    return apiClient.getHelpRequests(filters);
  },

  async acceptHelpRequest(requestId: string): Promise<any> {
    return apiClient.acceptHelpRequest(requestId);
  },

  async createHelpRequest(data: {
    problemTitle: string;
    difficulty: string;
    message: string;
    tags: string[];
    code?: string;
    attempts: number;
    timeStuck: string;
  }): Promise<HelpRequest> {
    return apiClient.createHelpRequest(data);
  },

  // Leaderboard
  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    return apiClient.getLeaderboard(limit);
  },

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return apiClient.healthCheck();
  },

  // Code execution
  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResult> {
    return apiClient.executeCode(request);
  }
};

export const apiClient = new SimpleApiClient();
export default apiClient;