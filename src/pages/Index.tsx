import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Trophy, Code, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ApiStatus } from "@/components/ApiStatus";
import CollaborativeSolve from "@/components/CollaborativeSolve";
import { apiClient } from "@/lib/api.ts";
import type { Problem } from "@/lib/types";

const Index = () => {
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All");
  const [isCollaborativeOpen, setIsCollaborativeOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    apiClient.getProblems().then((data) => {
      // Ensure all problems have createdAt and updatedAt fields
      const problemsWithDates = data.map((p: any) => ({
        ...p,
        createdAt: p.createdAt || new Date().toISOString(),
        updatedAt: p.updatedAt || new Date().toISOString(),
      }));
      setProblems(problemsWithDates);
    });
    apiClient.getCurrentUser().then((user) => {
      setCurrentUser(user);
    });
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredProblems = selectedDifficulty === "All"
    ? problems
    : problems.filter(p => p.difficulty === selectedDifficulty);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">OnlyCode</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/help-requests')}>
                <Users className="h-4 w-4 mr-2" />
                Help Others
              </Button>
              <Button variant="ghost" onClick={() => navigate('/leaderboard')}>
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
              <Button onClick={() => navigate('/profile')}>
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Master Algorithms with Peer Support
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Solve coding problems, get help from peers, and help others while earning points and building your reputation.
          </p>

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Helpers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">127</div>
              <p className="text-xs text-muted-foreground">Ready to help now</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Problems Solved Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">1,234</div>
              <p className="text-xs text-muted-foreground">Across all difficulties</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Help Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">89</div>
              <p className="text-xs text-muted-foreground">Active right now</p>
            </CardContent>
          </Card>
          <ApiStatus />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
            <Button
              key={difficulty}
              variant={selectedDifficulty === difficulty ? "default" : "outline"}
              onClick={() => setSelectedDifficulty(difficulty)}
              className="text-sm"
            >
              {difficulty}
            </Button>
          ))}
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-foreground mb-4">Coding Problems</h3>
          {filteredProblems.map((problem) => (
            <Card key={problem.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-foreground">{problem.title}</h4>
                      <Badge className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {problem.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        {problem.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {(problem.testCases?.length || 0)} solved
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => navigate(`/problem/${problem.id}`)}
                      variant="outline"
                      size="sm"
                    >
                      Solve
                    </Button>
                    <Button 
                      onClick={() => {
                        setSelectedProblem({
                          id: problem.id.toString(),
                          title: problem.title,
                          difficulty: problem.difficulty as 'Easy' | 'Medium' | 'Hard',
                          description: problem.description,
                          tags: problem.tags,
                          createdAt: new Date().toISOString(),
                          updatedAt: new Date().toISOString()
                        });
                        setIsCollaborativeOpen(true);
                      }}
                      size="sm"
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Collaborate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Floating Collaborative Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg"
          onClick={() => {
            setSelectedProblem({
              id: "1",
              title: "Two Sum",
              difficulty: "Easy",
              description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
              tags: ["Array", "Hash Table"],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
            setIsCollaborativeOpen(true);
          }}
        >
          <Users className="h-6 w-6" />
        </Button>
      </div>

      {/* Collaborative Solve Modal */}
      {selectedProblem && (
        <CollaborativeSolve
          isOpen={isCollaborativeOpen}
          onClose={() => {
            setIsCollaborativeOpen(false);
            setSelectedProblem(null);
          }}
          problem={selectedProblem}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Index;
