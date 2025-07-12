import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Trophy, Star, Medal, Crown, Award, Zap, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LeaderboardEntry {
  id: number;
  name: string;
  avatar: string;
  xp: number;
  helpCount: number;
  rating: number;
  badges: string[];
  rank: number;
  change: number;
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
}

const Leaderboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [timeFrame, setTimeFrame] = useState<string>("All Time");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load leaderboard data
  useEffect(() => {
    const loadLeaderboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be an API call
        // For now, we'll create the data inline since we can't import JSON files directly
        let mockData: LeaderboardData;
        
        // Generate different data based on time frame
        if (timeFrame === "This Week") {
          mockData = {
            leaderboard: [
              {
                id: 2,
                name: "David Kumar",
                avatar: "DK",
                xp: 420,
                helpCount: 28,
                rating: 4.9,
                badges: ["Tree Expert", "Problem Solver", "Weekly Champion"],
                rank: 1,
                change: 3
              },
              {
                id: 6,
                name: "Alex Thompson",
                avatar: "AT",
                xp: 390,
                helpCount: 26,
                rating: 4.7,
                badges: ["String Master", "Quick Helper"],
                rank: 2,
                change: 5
              },
              {
                id: 1,
                name: "Sarah Chen",
                avatar: "SC",
                xp: 380,
                helpCount: 25,
                rating: 4.8,
                badges: ["Algorithm Master", "Quick Responder"],
                rank: 3,
                change: -2
              },
              {
                id: 8,
                name: "Priya Patel",
                avatar: "PP",
                xp: 350,
                helpCount: 23,
                rating: 4.6,
                badges: ["DP Dynamo", "Rising Star"],
                rank: 4,
                change: 4
              },
              {
                id: 3,
                name: "Emma Rodriguez",
                avatar: "ER",
                xp: 320,
                helpCount: 21,
                rating: 4.8,
                badges: ["Dynamic Programming Pro", "Kind Helper"],
                rank: 5,
                change: -2
              },
              {
                id: 7,
                name: "Mike Wilson",
                avatar: "MW",
                xp: 310,
                helpCount: 20,
                rating: 4.5,
                badges: ["Tree Tactician", "Graph Helper"],
                rank: 6,
                change: 1
              },
              {
                id: 4,
                name: "Michael Johnson",
                avatar: "MJ",
                xp: 290,
                helpCount: 19,
                rating: 4.4,
                badges: ["Graph Theory Guru"],
                rank: 7,
                change: -3
              },
              {
                id: 9,
                name: "John Lee",
                avatar: "JL",
                xp: 280,
                helpCount: 18,
                rating: 4.3,
                badges: ["Stack Savant", "Newcomer"],
                rank: 8,
                change: 2
              },
              {
                id: 5,
                name: "Lisa Wang",
                avatar: "LW",
                xp: 270,
                helpCount: 17,
                rating: 4.6,
                badges: ["Array Specialist"],
                rank: 9,
                change: -4
              },
              {
                id: 10,
                name: "Linda Nguyen",
                avatar: "LN",
                xp: 250,
                helpCount: 16,
                rating: 4.7,
                badges: ["Hash Table Hero", "Consistent Helper"],
                rank: 10,
                change: 0
              }
            ]
          };
        } else if (timeFrame === "This Month") {
          mockData = {
            leaderboard: [
              {
                id: 1,
                name: "Sarah Chen",
                avatar: "SC",
                xp: 1850,
                helpCount: 123,
                rating: 4.9,
                badges: ["Algorithm Master", "Quick Responder", "Monthly Champion"],
                rank: 1,
                change: 1
              },
              {
                id: 3,
                name: "Emma Rodriguez",
                avatar: "ER",
                xp: 1720,
                helpCount: 114,
                rating: 4.8,
                badges: ["Dynamic Programming Pro", "Kind Helper", "Rising Star"],
                rank: 2,
                change: 2
              },
              {
                id: 2,
                name: "David Kumar",
                avatar: "DK",
                xp: 1680,
                helpCount: 109,
                rating: 4.7,
                badges: ["Tree Expert", "Problem Solver"],
                rank: 3,
                change: -2
              },
              {
                id: 6,
                name: "Alex Thompson",
                avatar: "AT",
                xp: 1520,
                helpCount: 98,
                rating: 4.6,
                badges: ["String Master", "Helpful", "Consistent"],
                rank: 4,
                change: 3
              },
              {
                id: 4,
                name: "Michael Johnson",
                avatar: "MJ",
                xp: 1450,
                helpCount: 89,
                rating: 4.5,
                badges: ["Graph Theory Guru", "Fast Helper"],
                rank: 5,
                change: 0
              },
              {
                id: 5,
                name: "Lisa Wang",
                avatar: "LW",
                xp: 1380,
                helpCount: 85,
                rating: 4.7,
                badges: ["Array Specialist", "Clear Explainer"],
                rank: 6,
                change: -1
              },
              {
                id: 7,
                name: "Mike Wilson",
                avatar: "MW",
                xp: 1290,
                helpCount: 78,
                rating: 4.4,
                badges: ["Tree Tactician", "Steady Helper"],
                rank: 7,
                change: 1
              },
              {
                id: 10,
                name: "Linda Nguyen",
                avatar: "LN",
                xp: 1180,
                helpCount: 71,
                rating: 4.6,
                badges: ["Hash Table Hero", "Team Player"],
                rank: 8,
                change: 2
              },
              {
                id: 8,
                name: "Priya Patel",
                avatar: "PP",
                xp: 1120,
                helpCount: 67,
                rating: 4.3,
                badges: ["DP Dynamo", "Learner"],
                rank: 9,
                change: -2
              },
              {
                id: 9,
                name: "John Lee",
                avatar: "JL",
                xp: 1050,
                helpCount: 62,
                rating: 4.2,
                badges: ["Stack Savant", "Dedicated"],
                rank: 10,
                change: 0
              }
            ]
          };
        } else {
          // All Time data
          mockData = {
            leaderboard: [
              {
                id: 1,
                name: "Sarah Chen",
                avatar: "SC",
                xp: 3420,
                helpCount: 234,
                rating: 4.9,
                badges: ["Algorithm Master", "Quick Responder", "Patience Award"],
                rank: 1,
                change: 0
              },
              {
                id: 2,
                name: "David Kumar",
                avatar: "DK",
                xp: 3180,
                helpCount: 198,
                rating: 4.8,
                badges: ["Tree Expert", "Problem Solver", "Mentor"],
                rank: 2,
                change: 1
              },
              {
                id: 3,
                name: "Emma Rodriguez",
                avatar: "ER",
                xp: 2950,
                helpCount: 176,
                rating: 4.9,
                badges: ["Dynamic Programming Pro", "Kind Helper"],
                rank: 3,
                change: -1
              },
              {
                id: 4,
                name: "Michael Johnson",
                avatar: "MJ",
                xp: 2780,
                helpCount: 165,
                rating: 4.7,
                badges: ["Graph Theory Guru", "Fast Helper"],
                rank: 4,
                change: 2
              },
              {
                id: 5,
                name: "Lisa Wang",
                avatar: "LW",
                xp: 2650,
                helpCount: 142,
                rating: 4.8,
                badges: ["Array Specialist", "Clear Explainer"],
                rank: 5,
                change: 0
              },
              {
                id: 6,
                name: "Alex Thompson",
                avatar: "AT",
                xp: 2480,
                helpCount: 134,
                rating: 4.6,
                badges: ["String Master", "Helpful"],
                rank: 6,
                change: -2
              },
              {
                id: 7,
                name: "Mike Wilson",
                avatar: "MW",
                xp: 2320,
                helpCount: 121,
                rating: 4.7,
                badges: ["Tree Tactician", "Patient Teacher"],
                rank: 7,
                change: 1
              },
              {
                id: 8,
                name: "Priya Patel",
                avatar: "PP",
                xp: 2180,
                helpCount: 108,
                rating: 4.5,
                badges: ["DP Dynamo", "Dedicated Helper"],
                rank: 8,
                change: -1
              },
              {
                id: 9,
                name: "John Lee",
                avatar: "JL",
                xp: 2050,
                helpCount: 95,
                rating: 4.4,
                badges: ["Stack Savant", "Reliable"],
                rank: 9,
                change: 0
              },
              {
                id: 10,
                name: "Linda Nguyen",
                avatar: "LN",
                xp: 1920,
                helpCount: 87,
                rating: 4.6,
                badges: ["Hash Table Hero", "Team Player"],
                rank: 10,
                change: 1
              }
            ]
          };
        }
        
        setLeaderboardData(mockData.leaderboard);
        
        toast({
          title: "Leaderboard loaded",
          description: `Loaded ${mockData.leaderboard.length} users successfully.`
        });
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard data');
        toast({
          title: "Error loading leaderboard",
          description: "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboardData();
  }, [timeFrame]); // Reload when timeFrame changes

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2: return <Medal className="h-6 w-6 text-gray-400" />;
      case 3: return <Award className="h-6 w-6 text-amber-600" />;
      default: return <div className="text-lg font-bold text-muted-foreground">#{rank}</div>;
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
      case 2: return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
      case 3: return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200";
      default: return "bg-card border-border";
    }
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) return <div className="text-green-600 text-sm">↑{change}</div>;
    if (change < 0) return <div className="text-red-600 text-sm">↓{Math.abs(change)}</div>;
    return <div className="text-muted-foreground text-sm">—</div>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                <div className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <h1 className="text-2xl font-semibold text-foreground">Leaderboard</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading leaderboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
                <div className="flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-500" />
                  <h1 className="text-2xl font-semibold text-foreground">Leaderboard</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load leaderboard</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <h1 className="text-2xl font-semibold text-foreground">Leaderboard</h1>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/profile')}>
              View My Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{leaderboardData.length}</div>
              <p className="text-xs text-muted-foreground">Active helpers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Helper</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-foreground">{leaderboardData[0]?.name || "Loading..."}</div>
              <p className="text-xs text-muted-foreground">{leaderboardData[0]?.xp.toLocaleString() || "0"} XP</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {leaderboardData.length > 0 
                  ? (leaderboardData.reduce((sum, user) => sum + user.rating, 0) / leaderboardData.length).toFixed(1)
                  : "0.0"
                }
              </div>
              <p className="text-xs text-muted-foreground">Community average</p>
            </CardContent>
          </Card>
        </div>

        {/* Time Frame Filter */}
        <div className="flex gap-2 mb-6">
          {["All Time", "This Month", "This Week"].map((period) => (
            <Button
              key={period}
              variant={timeFrame === period ? "default" : "outline"}
              onClick={() => setTimeFrame(period)}
              className="text-sm"
            >
              {period}
            </Button>
          ))}
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {leaderboardData.slice(0, 3).map((user) => (
            <Card key={user.id} className={`${getRankBg(user.rank)} text-center`}>
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-2">
                  {getRankIcon(user.rank)}
                </div>
                <Avatar className="mx-auto w-16 h-16 mb-2">
                  <AvatarFallback className="text-lg font-semibold">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <CardTitle 
                  className="text-lg cursor-pointer hover:text-primary transition-colors" 
                  onClick={() => navigate(`/profiles/${user.id}`)}
                >
                  {user.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-2xl font-bold text-primary">{user.xp.toLocaleString()} XP</div>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    {user.helpCount}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {user.rating}
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {user.badges.slice(0, 2).map((badge, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle>Complete Rankings</CardTitle>
            <CardDescription>
              Top helpers ranked by XP earned from helping others solve problems. Updated in real-time.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12">
                      {getRankIcon(user.rank)}
                    </div>
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="font-semibold">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div 
                        className="font-semibold text-foreground cursor-pointer hover:text-primary transition-colors" 
                        onClick={() => navigate(`/profiles/${user.id}`)}
                      >
                        {user.name}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          {user.helpCount} helped
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {user.rating}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex flex-wrap gap-1">
                      {user.badges.slice(0, 3).map((badge, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-foreground">
                        {user.xp.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">XP</div>
                    </div>
                    <div className="w-8 text-center">
                      {getChangeIndicator(user.change)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges Guide */}
        <Card className="mt-8 border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Award className="h-5 w-5" />
              Badge System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-purple-900 mb-2">Skill Badges:</h4>
                <ul className="space-y-1 text-purple-800">
                  <li>• Algorithm Master (50+ helps)</li>
                  <li>• Tree Expert (Tree problems)</li>
                  <li>• Dynamic Programming Pro</li>
                  <li>• Graph Theory Guru</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 mb-2">Behavior Badges:</h4>
                <ul className="space-y-1 text-purple-800">
                  <li>• Quick Responder (&lt;2min avg)</li>
                  <li>• Patience Award (high ratings)</li>
                  <li>• Kind Helper (positive feedback)</li>
                  <li>• Clear Explainer (good reviews)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-purple-900 mb-2">Achievement Badges:</h4>
                <ul className="space-y-1 text-purple-800">
                  <li>• Mentor (100+ helps)</li>
                  <li>• Problem Solver (versatile)</li>
                  <li>• Fast Helper (quick solutions)</li>
                  <li>• Top Contributor (monthly)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;