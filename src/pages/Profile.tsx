
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Star, Trophy, Zap, Target, Clock, Award, TrendingUp, Calendar } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-simple-api";

const PROFILE_DATA = {
  name: "Alex Thompson",
  avatar: "AT",
  joinDate: "March 2024",
  currentXP: 2480,
  nextLevelXP: 3000,
  rank: 6,
  totalHelped: 134,
  rating: 4.6,
  badges: [
    { name: "String Master", description: "Helped 25+ people with string problems", earned: "2024-01-15" },
    { name: "Helpful", description: "Maintained 4.5+ rating for 30 days", earned: "2024-02-20" },
    { name: "Quick Responder", description: "Average response time under 3 minutes", earned: "2024-03-10" },
    { name: "Problem Solver", description: "Helped with 10+ different problem types", earned: "2024-03-25" }
  ],
  recentActivity: [
    { date: "2024-04-10", action: "Helped with Two Sum", xp: 15, rating: 5 },
    { date: "2024-04-09", action: "Helped with Binary Tree Traversal", xp: 25, rating: 4 },
    { date: "2024-04-08", action: "Helped with Dynamic Programming", xp: 30, rating: 5 },
    { date: "2024-04-07", action: "Helped with Merge Sort", xp: 20, rating: 4 },
    { date: "2024-04-06", action: "Helped with Graph BFS", xp: 25, rating: 5 }
  ],
  stats: {
    problemsSolved: 89,
    helpStreak: 12,
    avgResponseTime: "2.3 min",
    favoriteTopics: ["Strings", "Arrays", "Trees"]
  }
};

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: user, loading, error } = useCurrentUser();
  
  const progressToNextLevel = user ? ((user.currentXP - 2000) / (user.nextLevelXP - 2000)) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <h1 className="text-2xl font-semibold text-foreground">My Profile</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">Loading profile...</div>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <div className="text-destructive">Error loading profile: {error}</div>
                  </div>
                ) : user ? (
                  <>
                    <Avatar className="w-24 h-24">
                      <AvatarFallback className="text-2xl font-bold">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h2 className="text-3xl font-bold text-foreground mb-2">{user.name}</h2>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {user.joinDate}
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          Rank #{user.rank}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          {user.rating} rating
                        </div>
                      </div>
                      
                      {/* XP Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Level Progress</span>
                          <span className="text-sm text-muted-foreground">
                            {user.currentXP} / {user.nextLevelXP} XP
                          </span>
                        </div>
                        <Progress value={progressToNextLevel} className="h-2" />
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-foreground">{user.totalHelped}</div>
                          <div className="text-sm text-muted-foreground">People Helped</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">{user.currentXP}</div>
                          <div className="text-sm text-muted-foreground">Total XP</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">{user.badges.length}</div>
                          <div className="text-sm text-muted-foreground">Badges Earned</div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">No user data available</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="stats">Statistics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Problems Solved</span>
                      <span className="font-semibold">{PROFILE_DATA.stats.problemsSolved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Help Streak</span>
                      <span className="font-semibold">{PROFILE_DATA.stats.helpStreak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Response Time</span>
                      <span className="font-semibold">{PROFILE_DATA.stats.avgResponseTime}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Favorite Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Favorite Topics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {PROFILE_DATA.stats.favoriteTopics.map((topic) => (
                        <Badge key={topic} variant="secondary">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Badges */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recent Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PROFILE_DATA.badges.slice(-2).map((badge, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                        <Award className="h-8 w-8 text-yellow-500" />
                        <div>
                          <div className="font-semibold text-foreground">{badge.name}</div>
                          <div className="text-sm text-muted-foreground">{badge.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Badges ({PROFILE_DATA.badges.length})</CardTitle>
                  <CardDescription>
                    Badges you've earned for your contributions to the community.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PROFILE_DATA.badges.map((badge, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 rounded-lg border">
                        <Award className="h-10 w-10 text-yellow-500 flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-foreground mb-1">{badge.name}</div>
                          <div className="text-sm text-muted-foreground mb-2">{badge.description}</div>
                          <div className="text-xs text-muted-foreground">
                            Earned on {new Date(badge.earned).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent help sessions and XP earned.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {PROFILE_DATA.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <div className="font-medium text-foreground">{activity.action}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{activity.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <Zap className="h-4 w-4" />
                            <span className="text-sm font-semibold">+{activity.xp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{PROFILE_DATA.rating}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Response Time</span>
                      <span className="font-semibold">{PROFILE_DATA.stats.avgResponseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Help Success Rate</span>
                      <span className="font-semibold">94%</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Sessions</span>
                      <span className="font-semibold">{PROFILE_DATA.totalHelped}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Current Streak</span>
                      <span className="font-semibold">{PROFILE_DATA.stats.helpStreak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">This Month</span>
                      <span className="font-semibold">23 helped</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;