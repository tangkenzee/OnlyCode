
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Play, RotateCcw, HelpCircle, Clock, AlertTriangle, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CollaborativeSolve from "@/components/CollaborativeSolve";
import type { Problem } from "@/lib/types";

const SAMPLE_PROBLEM: Problem = {
  id: "1",
  title: "Two Sum",
  difficulty: "Easy",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  tags: ["Array", "Hash Table"],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const ProblemSolver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(`function twoSum(nums, target) {
    // Your code here
    
}`);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [canRequestHelp, setCanRequestHelp] = useState(false);
  const [isCollaborativeOpen, setIsCollaborativeOpen] = useState(false);

  // Mock current user data
  const currentUser = {
    id: "current-user",
    name: "You",
    avatar: "U",
    rating: 4.5,
    xp: 1200
  };

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => {
        const newTime = prev + 1;
        if (newTime >= 300) { // 5 minutes
          setCanRequestHelp(true);
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const runCode = () => {
    setIsRunning(true);
    setAttempts(prev => {
      const newAttempts = prev + 1;
      if (newAttempts >= 3) {
        setCanRequestHelp(true);
      }
      return newAttempts;
    });

    // Simulate code execution
    setTimeout(() => {
      try {
        // Simple test execution simulation
        const testCases = [
          { input: [[2,7,11,15], 9], expected: [0,1] },
          { input: [[3,2,4], 6], expected: [1,2] },
          { input: [[3,3], 6], expected: [0,1] }
        ];
        
        const testResult = testCases.map((test, index) => {
          return `Test Case ${index + 1}: Input ${JSON.stringify(test.input)} -> Expected ${JSON.stringify(test.expected)}`;
        }).join('\n');
        
        setOutput(`Running tests...\n\n${testResult}\n\nPlease implement your solution to see actual results.`);
        toast({
          title: "Code executed",
          description: "Check the output panel for results."
        });
      } catch (error) {
        setOutput(`Error: ${error}`);
        toast({
          title: "Execution failed",
          description: "Check your code for syntax errors.",
          variant: "destructive"
        });
      }
      setIsRunning(false);
    }, 1000);
  };

  const resetCode = () => {
    setCode(`function twoSum(nums, target) {
    // Your code here
    
}`);
    setOutput("");
    toast({
      title: "Code reset",
      description: "Starter code has been restored."
    });
  };

  const requestHelp = () => {
    navigate(`/help-request/${id}`, { state: { code, attempts, timeElapsed } });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Problems
              </Button>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-foreground">{SAMPLE_PROBLEM.title}</h1>
                <Badge className={getDifficultyColor(SAMPLE_PROBLEM.difficulty)}>
                  {SAMPLE_PROBLEM.difficulty}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {formatTime(timeElapsed)}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4" />
                Attempts: {attempts}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Problem Description */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Problem Description</CardTitle>
                <div className="flex gap-2">
                  {SAMPLE_PROBLEM.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm text-foreground mb-4">
                  {SAMPLE_PROBLEM.description}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Examples:</h4>
                  {SAMPLE_PROBLEM.examples.map((example, index) => (
                    <div key={index} className="bg-muted p-3 rounded-md">
                      <div className="text-sm">
                        <div><strong>Input:</strong> {example.input}</div>
                        <div><strong>Output:</strong> {example.output}</div>
                        <div><strong>Explanation:</strong> {example.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help and Collaboration Cards */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Get Help & Collaborate</CardTitle>
                <CardDescription>
                  Work with peers or get help when you're stuck
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => setIsCollaborativeOpen(true)}
                  className="w-full"
                  variant="outline"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Collaborate with Peers
                </Button>
                {canRequestHelp && (
                  <Button onClick={requestHelp} className="w-full">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Request Help from Peer
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Code Editor and Output */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Code Editor</CardTitle>
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
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="font-mono text-sm min-h-[300px] resize-none"
                  placeholder="Write your solution here..."
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

      {/* Collaborative Solve Modal */}
      <CollaborativeSolve
        isOpen={isCollaborativeOpen}
        onClose={() => setIsCollaborativeOpen(false)}
        problem={SAMPLE_PROBLEM}
        currentUser={currentUser}
      />
    </div>
  );
};

export default ProblemSolver;
