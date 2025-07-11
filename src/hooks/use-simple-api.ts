import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api-simple';
import type { User, HelpRequest, LeaderboardEntry } from '@/lib/api-simple';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useSimpleApi<T>(
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
      console.error('API error:', error);
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

// Specific hooks
export function useCurrentUser() {
  return useSimpleApi(() => apiClient.getCurrentUser(), []);
}

export function useHelpRequests(filters?: {
  difficulty?: string;
  status?: string;
}) {
  return useSimpleApi(() => apiClient.getHelpRequests(filters), [filters]);
}

export function useLeaderboard(limit: number = 50) {
  return useSimpleApi(() => apiClient.getLeaderboard(limit), [limit]);
}

// Mutation hooks
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