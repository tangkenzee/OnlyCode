import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, ArrowLeft, Play, RotateCcw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Editor from "@monaco-editor/react";

interface User {
  id: string;
  name: string;
}

const PairProgramming = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>({ id: `user-${Date.now()}`, name: `User ${Math.floor(Math.random() * 1000)}` });

  // Connect to WebSocket
  useEffect(() => {
    const wsUrl = `ws://localhost:3002/pair-programming?type=pair-programming&userId=${currentUser.id}&userName=${encodeURIComponent(currentUser.name)}`;
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      setIsConnected(true);
      toast({
        title: "Connected to pair programming room!",
        description: "You can now collaborate with other users in real-time."
      });
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'room-joined':
          setUsers(data.users);
          setCode(data.code);
          break;
        case 'user-joined':
          setUsers(prev => [...prev, data.user]);
          toast({
            title: `${data.user.name} joined the room`,
            description: "They can now see your code and collaborate with you."
          });
          break;
        case 'user-left':
          setUsers(prev => prev.filter(u => u.id !== data.userId));
          toast({
            title: `${data.userName} left the room`,
            description: "They are no longer collaborating."
          });
          break;
        case 'code-updated':
          setCode(data.code);
          toast({
            title: `${data.userName} updated the code`,
            description: "The code has been synchronized."
          });
          break;
      }
    };

    websocket.onclose = () => {
      setIsConnected(false);
      toast({
        title: "Disconnected from pair programming room",
        description: "You can reconnect by refreshing the page.",
        variant: "destructive"
      });
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection error",
        description: "Failed to connect to pair programming room.",
        variant: "destructive"
      });
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [currentUser]);

  // Send code changes to other users
  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || "";
    setCode(newCode);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'code-change',
        code: newCode
      }));
    }
  };

  // Run code
  const runCode = async () => {
    if (!code.trim()) return;
    setIsRunning(true);
    setOutput("Running code...");
    try {
      const response = await fetch('http://localhost:3001/api/execute-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
          language: 'javascript',
          testCases: [
            {
              input: "[[2,7,11,15], 9]",
              expected: "[0,1]"
            },
            {
              input: "[[3,2,4], 6]",
              expected: "[1,2]"
            },
            {
              input: "[[3,3], 6]",
              expected: "[0,1]"
            }
          ]
        })
      });
      const result = await response.json();
      if (result.success) {
        setOutput(result.output);
        toast({
          title: "Code executed successfully!",
          description: "Check the output panel for results."
        });
      } else {
        setOutput(`Error: ${result.status}\n${result.error || ''}`);
        toast({
          title: "Code execution failed",
          description: result.status,
          variant: "destructive"
        });
      }
    } catch (error) {
      setOutput(`Error: ${error}`);
      toast({
        title: "Execution error",
        description: "Failed to run the code.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Reset code to initial state
  const resetCode = () => {
    const initialCode = `function twoSum(nums, target) {
  // Your code here
  
}

// Test the function
console.log(twoSum([2, 7, 11, 15], 9)); // Should output [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Should output [1, 2]
console.log(twoSum([3, 3], 6)); // Should output [0, 1]`;
    setCode(initialCode);
    handleCodeChange(initialCode);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Problems
              </Button>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-foreground">Pair Programming Demo</h1>
                <Badge variant={isConnected ? "default" : "destructive"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                {users.length} users online
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Problem Description */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Two Sum Problem</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">Array</Badge>
                  <Badge variant="secondary" className="text-xs">Hash Table</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm text-foreground mb-4">
                  Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Examples:</h4>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-sm">
                      <div><strong>Input:</strong> nums = [2,7,11,15], target = 9</div>
                      <div><strong>Output:</strong> [0,1]</div>
                      <div><strong>Explanation:</strong> Because nums[0] + nums[1] == 9, we return [0, 1].</div>
                    </div>
                  </div>
                  <div className="bg-muted p-3 rounded-md">
                    <div className="text-sm">
                      <div><strong>Input:</strong> nums = [3,2,4], target = 6</div>
                      <div><strong>Output:</strong> [1,2]</div>
                      <div><strong>Explanation:</strong> Because nums[1] + nums[2] == 6, we return [1, 2].</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Online Users */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Online Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{user.name}</span>
                      {user.id === currentUser.id && (
                        <Badge variant="outline" className="text-xs">You</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Editor and Output */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Collaborative Code Editor</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={resetCode}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                    <Button size="sm" onClick={runCode} disabled={isRunning}>
                      <Play className="h-4 w-4 mr-2" />
                      {isRunning ? "Running..." : "Run Code"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Editor
                  height="300px"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={handleCodeChange}
                  theme="vs-light"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on'
                  }}
                />
              </CardContent>
            </Card>

            {/* Output Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-3 rounded-md min-h-[150px]">
                  <pre className="text-sm text-foreground whitespace-pre-wrap">
                    {output || "Run your code to see output here..."}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PairProgramming; 