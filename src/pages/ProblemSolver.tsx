
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ArrowLeft, Play, RotateCcw, HelpCircle, Clock, AlertTriangle, Users, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import CollaborativeSolve from "@/components/CollaborativeSolve";
import type { Problem } from "@/lib/types";
import { api } from "@/lib/api-simple";
import type { CodeExecutionResult } from "@/lib/api-simple";
import { useCreateHelpRequest, useCurrentUser } from "@/hooks/use-simple-api";
import Editor from "@monaco-editor/react";

const SAMPLE_PROBLEM: Problem & { examples: Array<{ input: string; output: string; explanation: string }> } = {
  id: "1",
  title: "Two Sum",
  difficulty: "Easy",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
  tags: ["Array", "Hash Table"],
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 6, we return [0, 1]."
    }
  ],
  testCases: [
    { input: [[2,7,11,15], 9], expected: [0,1] },
    { input: [[3,2,4], 6], expected: [1,2] },
    { input: [[3,3], 6], expected: [0,1] }
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const ProblemSolver = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState(`function twoSum(nums, target) {
    // Your code here
    
}

// Test the function
console.log(twoSum([2, 7, 11, 15], 9)); // Should output [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Should output [1, 2]
console.log(twoSum([3, 3], 6)); // Should output [0, 1]`);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [canRequestHelp, setCanRequestHelp] = useState(false);
  const [isCollaborativeOpen, setIsCollaborativeOpen] = useState(false);
  const [isHelpRequestOpen, setIsHelpRequestOpen] = useState(false);
  const [helpMessage, setHelpMessage] = useState("");
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);

  // Get current user data
  const { data: currentUser } = useCurrentUser();
  const { createRequest, loading: creatingRequest } = useCreateHelpRequest();

  // Create a collaborator object from current user for the collaborative component
  const collaboratorUser = currentUser ? {
    id: currentUser.id,
    name: currentUser.name,
    avatar: currentUser.avatar,
    rating: currentUser.rating,
    xp: currentUser.currentXP,
    isOnline: true,
    lastSeen: new Date(),
    skills: SAMPLE_PROBLEM.tags
  } : null;

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

  const runCode = async () => {
    setIsRunning(true);
    setAttempts(prev => {
      const newAttempts = prev + 1;
      if (newAttempts >= 3) {
        setCanRequestHelp(true);
      }
      return newAttempts;
    });

    try {
      const testCases = SAMPLE_PROBLEM.testCases || [
        { input: [[2,7,11,15], 9], expected: [0,1] },
        { input: [[3,2,4], 6], expected: [1,2] },
        { input: [[3,3], 6], expected: [0,1] }
      ];

      const result = await api.executeCode({
        code,
        language: 'javascript',
        testCases: testCases.map(test => ({
          input: JSON.stringify(test.input),
          expected: JSON.stringify(test.expected)
        }))
      });

      setExecutionResult(result);
      
      // Format output for display
      let outputText = `Status: ${result.status}\n`;
      outputText += `Time: ${result.time}ms\n`;
      outputText += `Memory: ${result.memory}KB\n\n`;
      
      if (result.output) {
        outputText += `Output:\n${result.output}\n\n`;
      }
      
      if (result.error) {
        outputText += `Error:\n${result.error}\n\n`;
      }
      
      if (result.compileOutput) {
        outputText += `Compilation Output:\n${result.compileOutput}\n\n`;
      }
      
      outputText += `Test Cases:\n`;
      result.testCases.forEach((testCase, index) => {
        outputText += `Test ${index + 1}: ${testCase.passed ? '✅ PASSED' : '❌ FAILED'}\n`;
        outputText += `  Input: ${testCase.input}\n`;
        outputText += `  Expected: ${testCase.expected}\n`;
        outputText += `  Actual: ${testCase.actual}\n\n`;
      });

      setOutput(outputText);

      if (result.success) {
        toast({
          title: "Code executed successfully!",
          description: "All test cases passed.",
        });
      } else {
        toast({
          title: "Code execution failed",
          description: result.status,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Code execution error:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      toast({
        title: "Execution failed",
        description: "Check your code for syntax errors.",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(`function twoSum(nums, target) {
    // Your code here

}

// Test the function
console.log(twoSum([2, 7, 11, 15], 9)); // Should output [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Should output [1, 2]
console.log(twoSum([3, 3], 6)); // Should output [0, 1]`);
    setOutput("");
    setExecutionResult(null);
    toast({
      title: "Code reset",
      description: "Starter code has been restored."
    });
  };

  const requestHelp = () => {
    setIsHelpRequestOpen(true);
  };

  const submitHelpRequest = async () => {
    if (!helpMessage.trim() || !currentUser) {
      toast({
        title: "Error",
        description: "Please enter a help message.",
        variant: "destructive"
      });
      return;
    }

    try {
      await createRequest({
        problemTitle: SAMPLE_PROBLEM.title,
        difficulty: SAMPLE_PROBLEM.difficulty,
        message: helpMessage,
        tags: SAMPLE_PROBLEM.tags,
        code: code,
        attempts: attempts,
        timeStuck: `${Math.floor(timeElapsed / 60)} minutes`
      });

      toast({
        title: "Help request created!",
        description: "Your request has been posted and helpers will be notified."
      });

      setIsHelpRequestOpen(false);
      setHelpMessage("");
      
      // Navigate to help requests page to see the request
      navigate('/help-requests');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create help request. Please try again.",
        variant: "destructive"
      });
    }
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
                {/*This is the Monaco Editor */}
                <Editor
                  height="300px"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(value) => setCode(value || "")}
                  theme="vs-light"
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
        currentUser={collaboratorUser}
        starterCode={code}
      />

      {/* Help Request Dialog */}
      <Dialog open={isHelpRequestOpen} onOpenChange={setIsHelpRequestOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Help with {SAMPLE_PROBLEM.title}</DialogTitle>
            <DialogDescription>
              Describe what you're stuck on and what you've tried so far. This will help others understand how to best assist you.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Help Message</label>
              <Textarea
                value={helpMessage}
                onChange={(e) => setHelpMessage(e.target.value)}
                placeholder="Describe what you're stuck on, what you've tried, and any specific questions you have..."
                className="mt-1"
                rows={4}
              />
            </div>
            
            <div className="text-sm text-muted-foreground space-y-2">
              <div><strong>Problem:</strong> {SAMPLE_PROBLEM.title}</div>
              <div><strong>Difficulty:</strong> {SAMPLE_PROBLEM.difficulty}</div>
              <div><strong>Time spent:</strong> {formatTime(timeElapsed)}</div>
              <div><strong>Attempts:</strong> {attempts}</div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsHelpRequestOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitHelpRequest} 
              disabled={!helpMessage.trim() || creatingRequest}
            >
              {creatingRequest ? "Creating..." : "Submit Help Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProblemSolver;
