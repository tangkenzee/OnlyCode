import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Send, User, Clock, MessageCircle, Star, Code, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const HelpRequest = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { code, attempts, timeElapsed, isHelper, requesterName, problemTitle } = location.state || {};
  
  const [helpMessage, setHelpMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchedHelper, setMatchedHelper] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [helpSessionActive, setHelpSessionActive] = useState(isHelper || false);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [rating, setRating] = useState(0);

  // If this is a helper view, set up the session immediately
  useEffect(() => {
    if (isHelper && !matchedHelper) {
      // Set up helper data
      setMatchedHelper({
        id: 'current-helper',
        name: 'You (Helper)',
        avatar: 'H',
        rating: 4.8,
        helpCount: 47,
        tags: ["Array", "Hash Table", "Dynamic Programming"],
        responseTime: "2 min avg"
      });

      // Add initial helper message
      setChatMessages([
        {
          id: 1,
          sender: "helper",
          message: `Hi ${requesterName || 'there'}! I see you're working on ${problemTitle || 'this problem'}. I've helped many people with similar issues. Can you tell me what approach you've tried so far?`,
          timestamp: new Date(),
          senderName: "You"
        }
      ]);
    }
  }, [isHelper, requesterName, problemTitle]);

  // Simulate finding a helper (for requester view)
  const requestHelp = async () => {
    setIsSubmitting(true);
    
    // Simulate matching with a helper
    setTimeout(() => {
      const helper = {
        id: 1,
        name: "Sarah Chen",
        avatar: "SC",
        rating: 4.9,
        helpCount: 234,
        tags: ["Array", "Hash Table", "Dynamic Programming"],
        responseTime: "2 min avg"
      };
      
      setMatchedHelper(helper);
      setHelpSessionActive(true);
      setIsSubmitting(false);
      
      // Add initial helper message
      setChatMessages([
        {
          id: 1,
          sender: "helper",
          message: "Hi! I see you're working on the Two Sum problem. I've helped many people with this one. Can you tell me what approach you've tried so far?",
          timestamp: new Date(),
          senderName: "Sarah Chen"
        }
      ]);
      
      toast({
        title: "Helper found!",
        description: "Sarah Chen is here to help you with this problem."
      });
    }, 2000);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const senderType = isHelper ? "helper" : "user";
    const senderName = isHelper ? "You" : "You";
    
    const message = {
      id: chatMessages.length + 1,
      sender: senderType,
      message: newMessage,
      timestamp: new Date(),
      senderName: senderName
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage("");
    
    // Simulate response from the other party
    setTimeout(() => {
      const responses = isHelper ? [
        "Thanks for the hint! Let me try that approach.",
        "I see what you mean. Should I use a hash map for this?",
        "That makes sense! I was overcomplicating it.",
        "Could you help me understand why that's more efficient?"
      ] : [
        "That's a good start! Have you considered using a hash map to store the values you've seen?",
        "The time complexity can be improved from O(n²) to O(n). Think about what data structure could help you look up values quickly.",
        "Try iterating through the array once and for each element, check if (target - current_element) exists in your hash map.",
        "Great progress! You're on the right track. What do you think the next step should be?"
      ];
      
      const otherPartyResponse = {
        id: chatMessages.length + 2,
        sender: isHelper ? "user" : "helper",
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        senderName: isHelper ? requesterName || "Student" : matchedHelper?.name || "Helper"
      };
      
      setChatMessages(prev => [...prev, otherPartyResponse]);
    }, 1000 + Math.random() * 2000);
  };

  const completeSession = () => {
    setSessionComplete(true);
    toast({
      title: "Session completed!",
      description: isHelper ? "Thanks for helping!" : "Hope that helped you solve the problem!"
    });
  };

  const submitRating = () => {
    if (rating === 0) {
      toast({
        title: "Please rate the session",
        description: "Your feedback helps us improve the experience.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Thank you for your feedback!",
      description: `You rated this session ${rating} stars.`
    });

    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Session completion view
  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Session Complete</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Session Completed!</CardTitle>
                <CardDescription>
                  {isHelper 
                    ? "Thank you for helping a fellow coder!"
                    : "We hope you found the help session useful!"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isHelper && (
                  <>
                    <div>
                      <h4 className="font-semibold mb-3">How was your help session?</h4>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            className={`p-1 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                          >
                            <Star className={`h-8 w-8 ${rating >= star ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <Button onClick={submitRating} className="w-full">
                      Submit Rating & Return Home
                    </Button>
                  </>
                )}

                {isHelper && (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">You earned XP!</h4>
                      <div className="text-green-700">
                        <div>+25 XP for helping with this problem</div>
                        <div>+5 XP bonus for clear explanations</div>
                      </div>
                    </div>
                    <Button onClick={() => navigate('/help-requests')} className="w-full">
                      Help More People
                    </Button>
                    <Button variant="outline" onClick={() => navigate('/')} className="w-full">
                      Back to Home
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Request help view (for students who need help)
  if (!helpSessionActive) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(`/problem/${id}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Problem
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Request Help</h1>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Request Help with Two Sum</CardTitle>
                <CardDescription>
                  Get connected with a peer who has solved this problem and can help guide you through it.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Session Stats */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{formatTime(timeElapsed || 0)}</div>
                    <div className="text-sm text-muted-foreground">Time Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{attempts || 0}</div>
                    <div className="text-sm text-muted-foreground">Attempts Made</div>
                  </div>
                </div>

                {/* Current Code Preview */}
                {code && (
                  <div>
                    <h4 className="font-semibold mb-2">Your Current Code:</h4>
                    <div className="bg-muted p-3 rounded-md">
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                        {code}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Help Request Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Describe what you're struggling with (optional):
                  </label>
                  <Textarea
                    value={helpMessage}
                    onChange={(e) => setHelpMessage(e.target.value)}
                    placeholder="e.g., I'm not sure how to optimize my solution, or I'm getting a wrong answer for certain test cases..."
                    className="min-h-[100px]"
                  />
                </div>

                <Button 
                  onClick={requestHelp} 
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? "Finding a helper..." : "Request Help"}
                </Button>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">How it works:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• We'll match you with someone who has solved this problem</li>
                      <li>• Chat with them to get hints and guidance</li>
                      <li>• Rate the help quality when you're done</li>
                      <li>• Helpers earn points for good assistance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Active help session view (for both helpers and students)
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(`/problem/${id}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Problem
              </Button>
              <h1 className="text-xl font-semibold text-foreground">
                {isHelper ? "Helping Session" : "Help Session"}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {matchedHelper && (
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-sm font-semibold">
                      {matchedHelper.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">
                      {isHelper ? `Helping: ${requesterName || "Student"}` : matchedHelper.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {matchedHelper.rating} • {matchedHelper.helpCount} helped
                    </div>
                  </div>
                </div>
              )}
              <Button onClick={completeSession} variant="outline" size="sm">
                {isHelper ? "End Help Session" : "Mark as Complete"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  {isHelper ? "Help Chat" : "Chat with Helper"}
                </CardTitle>
                {isHelper && (
                  <Badge variant="secondary" className="text-xs">
                    You're the Helper
                  </Badge>
                )}
              </div>
              <CardDescription>
                {isHelper 
                  ? `You're helping ${requesterName || "a student"} with ${problemTitle || "their problem"}. Guide them to discover the solution.`
                  : "Chat with your helper to get guidance on solving this problem."
                }
              </CardDescription>
              
              {matchedHelper?.tags && (
                <div className="flex gap-2">
                  {matchedHelper.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
                {chatMessages.map((msg) => {
                  const isCurrentUser = (isHelper && msg.sender === 'helper') || (!isHelper && msg.sender === 'user');
                  
                  return (
                    <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        isCurrentUser
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-foreground'
                      }`}>
                        <div className="text-sm font-medium mb-1">{msg.senderName}</div>
                        <div className="text-sm">{msg.message}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isHelper ? "Guide them with hints and questions..." : "Ask for help or share your thoughts..."}
                  className="flex-1 min-h-[60px] max-h-[120px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Helper Guidelines */}
          {isHelper && (
            <Card className="mt-6 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-900">
                  <User className="h-5 w-5" />
                  Helper Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-800">
                  <div>
                    <h4 className="font-semibold mb-2">Do:</h4>
                    <ul className="space-y-1">
                      <li>• Ask what they've tried first</li>
                      <li>• Give hints, not direct answers</li>
                      <li>• Explain the reasoning behind approaches</li>
                      <li>• Be patient and encouraging</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Avoid:</h4>
                    <ul className="space-y-1">
                      <li>• Giving away the complete solution</li>
                      <li>• Being condescending or impatient</li>
                      <li>• Rushing through explanations</li>
                      <li>• Ignoring their questions</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpRequest;