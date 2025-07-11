import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ApiStatusProps {
  className?: string;
}

export function ApiStatus({ className }: ApiStatusProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkApiStatus = async () => {
    setStatus('checking');
    try {
      const response = await fetch('http://localhost:3001/api/health');
      if (response.ok) {
        setStatus('online');
      } else {
        setStatus('offline');
      }
    } catch (error) {
      console.error('API health check failed:', error);
      setStatus('offline');
    }
    setLastCheck(new Date());
  };

  useEffect(() => {
    checkApiStatus();
  }, []);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          API Status
          {status === 'checking' && <RefreshCw className="h-4 w-4 animate-spin" />}
          {status === 'online' && <Wifi className="h-4 w-4 text-green-500" />}
          {status === 'offline' && <WifiOff className="h-4 w-4 text-red-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div>
            <Badge 
              variant={status === 'online' ? 'default' : status === 'offline' ? 'destructive' : 'secondary'}
            >
              {status === 'checking' ? 'Checking...' : status === 'online' ? 'Online' : 'Offline'}
            </Badge>
            {lastCheck && (
              <div className="text-xs text-muted-foreground mt-1">
                Last check: {lastCheck.toLocaleTimeString()}
              </div>
            )}
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={checkApiStatus}
            disabled={status === 'checking'}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Check
          </Button>
        </div>
        
        {status === 'offline' && (
          <div className="mt-2 text-xs text-muted-foreground">
            <div>Backend server is not running.</div>
            <div>Run <code className="bg-muted px-1 rounded">./start-backend.sh</code> to start it.</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 