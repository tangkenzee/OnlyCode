import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, Users } from "lucide-react";
import Editor from "@monaco-editor/react";

const CollaborativeSession = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // Get session data from location.state (problem, collaborators, starterCode, etc.)
  const { problem, collaborators, currentUser, starterCode } = location.state || {};
  const [code, setCode] = useState(starterCode || "");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [attempts, setAttempts] = useState(0);

  if (!problem) {
    return <div className="p-8">Session not found or missing data.</div>;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/")}>Back to Problems</Button>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-foreground">{problem.title}</h1>
                <Badge>{problem.difficulty}</Badge>
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
                  {problem.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm text-foreground mb-4">
                  {problem.description}
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Examples:</h4>
                  {problem.examples?.map((example: any, index: number) => (
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
            {/* Collaborators List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Collaborators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {collaborators?.map((c: any) => (
                    <Badge key={c.id} className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {c.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Code Editor and Output */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <Editor
                  height="300px"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={value => setCode(value || "")}
                  theme="vs-light"
                />
              </CardContent>
            </Card>
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

export default CollaborativeSession;
