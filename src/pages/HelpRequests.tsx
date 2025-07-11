
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, User, MessageCircle, Star, Trophy } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useHelpRequests, useAcceptHelpRequest, useCurrentUser } from "@/hooks/use-simple-api";
import type { HelpRequest } from "@/lib/api-simple";

const SAMPLE_REQUESTS = [
  {
    id: 1,
    problemTitle: "Two Sum",
    difficulty: "Easy",
    requesterName: "Alex Johnson",
    timeStuck: "8 minutes",
    attempts: 4,
    message: "I'm getting a time limit exceeded error. I think my nested loop approach isn't efficient enough.",
    tags: ["Array", "Hash Table"],
    urgent: false
  },
  {
    id: 2,
    problemTitle: "Longest Palindromic Substring",
    difficulty: "Medium",
    requesterName: "Emma Davis",
    timeStuck: "15 minutes",
    attempts: 6,
    message: "Having trouble with the dynamic programming approach. My solution works for small inputs but fails for larger ones.",
    tags: ["String", "Dynamic Programming"],
    urgent: true
  },
  {
    id: 3,
    problemTitle: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    requesterName: "Mike Wilson",
    timeStuck: "12 minutes",
    attempts: 3,
    message: "I understand BFS conceptually but struggling with the implementation in JavaScript.",
    tags: ["Tree", "BFS"],
    urgent: false
  }
];

const HelpRequests = () => {
  const navigate = useNavigate();
  const [activeHelps, setActiveHelps] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [fetchRequests, setFetchRequests] = useState(false);
  const [helpRequests, setHelpRequests] = useState<HelpRequest[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: currentUser } = useCurrentUser();
  const { acceptRequest, loading: acceptingRequest } = useAcceptHelpRequest();

  const acceptHelpRequest = async (requestId: string) => {
    try {
      const session = await acceptRequest(requestId);
      setActiveHelps(prev => [...prev, requestId]);
      toast({
        title: "Help request accepted!",
        description: "You're now connected with the person who needs help."
      });
      navigate(`/help-session/${session.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept help request. Please try again.",
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

  const handleLoadRequests = async () => {
    setLoading(true);
    setError(null);
    setFetchRequests(true);
    try {
      // Use the API client directly to fetch help requests
      const { apiClient } = await import("@/lib/api-simple");
      const data = await apiClient.getHelpRequests({
        status: 'open',
        difficulty: filter === 'All' ? undefined : filter
      });
      setHelpRequests(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load help requests');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = helpRequests || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-2xl font-semibold text-foreground">Help Others</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Your XP: <span className="font-semibold text-foreground">{currentUser?.currentXP || 0}</span>
              </div>
              <Button variant="outline" onClick={() => navigate('/profile')}>
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{SAMPLE_REQUESTS.length}</div>
              <p className="text-xs text-muted-foreground">People need help</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Your Active Helps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeHelps.length}</div>
              <p className="text-xs text-muted-foreground">Currently helping</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Helped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">47</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1">
                <div className="text-2xl font-bold text-foreground">4.8</div>
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <p className="text-xs text-muted-foreground">Average rating</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {["All", "Easy", "Medium", "Hard"].map((difficulty) => (
            <Button
              key={difficulty}
              variant={filter === difficulty ? "default" : "outline"}
              onClick={() => setFilter(difficulty)}
              className="text-sm"
            >
              {difficulty}
            </Button>
          ))}
        </div>

        {/* Help Requests */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground">Open Help Requests</h3>
            <div className="text-sm text-muted-foreground">
              {filteredRequests.length} requests available
            </div>
          </div>

          {/* Only show the button if helpRequests is null or not loaded */}
          {!fetchRequests && (
            <div className="text-center py-8">
              <Button onClick={handleLoadRequests}>
                Load Open Requests
              </Button>
            </div>
          )}

          {fetchRequests && loading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading help requests...</div>
            </div>
          ) : fetchRequests && error ? (
            <div className="text-center py-8">
              <div className="text-destructive">Error loading help requests: {error}</div>
              <Button onClick={handleLoadRequests} className="mt-2">Retry</Button>
            </div>
          ) : fetchRequests && filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">No help requests available</div>
            </div>
          ) : fetchRequests && filteredRequests.length > 0 ? (
            filteredRequests.map((request: HelpRequest) => (
              <Card key={request.id} className={`hover:shadow-md transition-shadow ${
                request.urgent ? 'border-red-200 bg-red-50' : ''
              }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-foreground">
                        {request.problemTitle}
                      </h4>
                      <Badge className={getDifficultyColor(request.difficulty)}>
                        {request.difficulty}
                      </Badge>
                      {request.urgent && (
                        <Badge variant="destructive" className="text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {request.requesterName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Stuck for {request.timeStuck}
                      </div>
                      <div>
                        {request.attempts} attempts
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-3 text-sm">
                      "{request.message}"
                    </p>

                    <div className="flex gap-2">
                      {request.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="ml-6 flex flex-col gap-2">
                    <Button 
                      onClick={() => acceptHelpRequest(request.id)}
                      disabled={activeHelps.includes(request.id) || acceptingRequest}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {activeHelps.includes(request.id) ? "Helping..." : acceptingRequest ? "Accepting..." : "Help"}
                    </Button>
                    <div className="text-xs text-center text-muted-foreground">
                      +{request.difficulty === 'Easy' ? '10' : request.difficulty === 'Medium' ? '20' : '30'} XP
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          ) : null}
        </div>

        {/* Helper Tips */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Trophy className="h-5 w-5" />
              Helper Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h4 className="font-semibold mb-2">Earn More XP:</h4>
                <ul className="space-y-1">
                  <li>• Guide them to discover the solution themselves</li>
                  <li>• Explain concepts clearly</li>
                  <li>• Be patient and encouraging</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Best Practices:</h4>
                <ul className="space-y-1">
                  <li>• Ask what they've tried first</li>
                  <li>• Give hints rather than direct answers</li>
                  <li>• Help them understand the approach</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HelpRequests;
