
import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, User, Clock, MessageCircle, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const HelpRequest = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { code, attempts, timeElapsed } = location.state || {};
  
  const [helpMessage, setHelpMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchedHelper, setMatchedHelper] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [helpSessionActive, setHelpSessionActive] = useState(false);

  // Simulate finding a helper
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
    
    const message = {
      id: chatMessages.length + 1,
      sender: "user",
      message: newMessage,
      timestamp: new Date(),
      senderName: "You"
    };
    
    setChatMessages(prev => [...prev, message]);
    setNewMessage("");
    
    // Simulate helper response
    setTimeout(() => {
      const responses = [
        "That's a good start! Have you considered using a hash map to store the values you've seen?",
        "The time complexity can be improved from O(n²) to O(n). Think about what data structure could help you look up values quickly.",
        "Try iterating through the array once and for each element, check if (target - current_element) exists in your hash map."
      ];
      
      const helperResponse = {
        id: chatMessages.length + 2,
        sender: "helper",
        message: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        senderName: "Sarah Chen"
      };
      
      setChatMessages(prev => [...prev, helperResponse]);
    }, 1000 + Math.random() * 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
              <h1 className="text-xl font-semibold text-foreground">Help Session</h1>
            </div>
            {matchedHelper && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                  {matchedHelper.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium">{matchedHelper.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {matchedHelper.rating} • {matchedHelper.helpCount} helped
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat with Helper
              </CardTitle>
              <div className="flex gap-2">
                {matchedHelper?.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${
                      msg.sender === 'user' 
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
                ))}
              </div>

              {/* Message Input */}
              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
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
        </div>
      </div>
    </div>
  );
};

export default HelpRequest;
