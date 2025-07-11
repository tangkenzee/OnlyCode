import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import type { User, HelpRequest, HelpSession, Problem, LeaderboardEntry } from '@/lib/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
    } catch (error) {
      console.error('Hook error:', error);
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'An error occurred' 
      });
    }
  }, [apiCall]);

  useEffect(() => {
    execute();
  }, dependencies);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { ...state, refetch };
}

// Specific hooks for common API calls
export function useCurrentUser() {
  return useApi(() => apiClient.getCurrentUser(), []);
}

export function useHelpRequests(filters?: {
  difficulty?: string;
  status?: string;
  tags?: string[];
}) {
  return useApi(() => apiClient.getHelpRequests(filters), [filters]);
}

export function useProblems(filters?: {
  difficulty?: string;
  tags?: string[];
}) {
  return useApi(() => apiClient.getProblems(filters), [filters]);
}

export function useProblem(problemId: string) {
  return useApi(() => apiClient.getProblem(problemId), [problemId]);
}

export function useHelpSession(sessionId: string) {
  return useApi(() => apiClient.getHelpSession(sessionId), [sessionId]);
}

export function useLeaderboard(limit: number = 50) {
  return useApi(() => apiClient.getLeaderboard(limit), [limit]);
}

// Mutation hooks for actions that modify data
export function useCreateHelpRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = useCallback(async (data: {
    problemTitle: string;
    difficulty: string;
    message: string;
    tags: string[];
    code?: string;
    attempts: number;
    timeStuck: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.createHelpRequest(data);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create help request');
      setLoading(false);
      throw err;
    }
  }, []);

  return { createRequest, loading, error };
}

export function useAcceptHelpRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptRequest = useCallback(async (requestId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.acceptHelpRequest(requestId);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to accept help request');
      setLoading(false);
      throw err;
    }
  }, []);

  return { acceptRequest, loading, error };
}

export function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (sessionId: string, message: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.sendMessage(sessionId, message);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      setLoading(false);
      throw err;
    }
  }, []);

  return { sendMessage, loading, error };
}

export function useEndSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const endSession = useCallback(async (sessionId: string, rating?: number, feedback?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiClient.endSession(sessionId, rating, feedback);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to end session');
      setLoading(false);
      throw err;
    }
  }, []);

  return { endSession, loading, error };
} 