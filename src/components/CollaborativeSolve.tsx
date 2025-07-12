import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Users, MessageCircle, Star, Clock, Target, Send, X, CheckCircle } from "lucide-react";
import type { Problem } from "@/lib/types";

interface CollaborativeSolveProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
  currentUser?: {
    id: string;
    name: string;
    avatar: string;
    rating: number;
    xp: number;
  };
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'code' | 'hint';
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  xp: number;
  isOnline: boolean;
  lastSeen: Date;
  skills: string[];
  tagSkillLevels?: Record<string, number>;
}

const CollaborativeSolve = ({ isOpen, onClose, problem, currentUser }: CollaborativeSolveProps) => {
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [sharedCode, setSharedCode] = useState("");

  // Mock data for collaborators with similar scores
  const availableCollaborators: Collaborator[] = [
    {
      id: "1",
      name: "Alex Chen",
      avatar: "AC",
      rating: 4.8,
      xp: 1250,
      isOnline: true,
      lastSeen: new Date(),
      skills: ["Array", "Hash Table", "Dynamic Programming"]
    },
    {
      id: "2", 
      name: "Sarah Kim",
      avatar: "SK",
      rating: 4.6,
      xp: 1180,
      isOnline: true,
      lastSeen: new Date(),
      skills: ["String", "Two Pointers", "Stack"]
    },
    {
      id: "3",
      name: "Mike Johnson", 
      avatar: "MJ",
      rating: 4.7,
      xp: 1320,
      isOnline: false,
      lastSeen: new Date(Date.now() - 300000), // 5 minutes ago
      skills: ["Tree", "Graph", "BFS"]
    },
    {
      id: "4",
      name: "Emma Davis",
      avatar: "ED", 
      rating: 4.5,
      xp: 1100,
      isOnline: true,
      lastSeen: new Date(),
      skills: ["Array", "Binary Search", "Sorting"]
    }
  ];

  const startCollaboration = () => {
    if (selectedCollaborators.length === 0) return;
    
    setSessionActive(true);
    setSessionProgress(0);
    
    // Add initial session message
    const collaborators = availableCollaborators.filter(c => selectedCollaborators.includes(c.id));
    const names = collaborators.map(c => c.name).join(", ");
    
    setChatMessages([
      {
        id: "1",
        sender: "system",
        message: `Collaborative session started! Working with ${names} on "${problem.title}". Let's solve this together!`,
        timestamp: new Date(),
        type: 'text'
      }
    ]);

    // Simulate collaborators joining
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          id: "2",
          sender: collaborators[0].name,
          message: "Hi everyone! I've been working on this problem too. What approach are you thinking?",
          timestamp: new Date(),
          type: 'text'
        }
      ]);
    }, 1000);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: currentUser?.name || "You",
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate collaborator responses
    setTimeout(() => {
      const responses = [
        "That's a good approach! Have you considered the edge cases?",
        "I think we can optimize that further. What about using a hash map?",
        "Let me share my solution and we can compare approaches.",
        "Great idea! Let's test it with the example cases first."
      ];
      
      const randomCollaborator = availableCollaborators.find(c => selectedCollaborators.includes(c.id));
      if (randomCollaborator) {
        setChatMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: randomCollaborator.name,
            message: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            type: 'text'
          }
        ]);
      }
    }, 2000 + Math.random() * 3000);
  };

  const toggleCollaborator = (collaboratorId: string) => {
    setSelectedCollaborators(prev => 
      prev.includes(collaboratorId) 
        ? prev.filter(id => id !== collaboratorId)
        : [...prev, collaboratorId]
    );
  };

  const getSkillMatch = (collaborator: Collaborator) => {
    const commonSkills = problem.tags.filter(tag => collaborator.skills.includes(tag));
    return (commonSkills.length / problem.tags.length) * 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="overflow-y-auto max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Collaborative Problem Solving
            </DialogTitle>
            <DialogDescription>
              Work with peers who have similar skill levels to solve "{problem.title}" together
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[70vh]">
            {/* Left Panel - Collaborator Selection */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Available Collaborators</CardTitle>
                  <CardDescription>
                    Select 1-3 peers to collaborate with. Choose users with similar skill levels for the best experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-72 overflow-y-auto">
                  {availableCollaborators.map((collaborator) => {
                    const isSelected = selectedCollaborators.includes(collaborator.id);
                    const skillMatch = getSkillMatch(collaborator);
                    
                    return (
                      <Card 
                        key={collaborator.id} 
                        className={`cursor-pointer transition-all ${
                          isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => toggleCollaborator(collaborator.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback>{collaborator.avatar}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h4 className="font-semibold">{collaborator.name}</h4>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm">{collaborator.rating}</span>
                                  </div>
                                  <div className={`w-2 h-2 rounded-full ${collaborator.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {collaborator.xp} XP • {skillMatch.toFixed(0)}% skill match
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            )}
                          </div>
                          
                          <div className="mt-3 flex gap-1">
                            {problem.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag} Level: {collaborator.tagSkillLevels?.[tag] ?? 0}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Chat */}
            {/* Replace chat panel with session info section */}
            {selectedCollaborators.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Selected Collaborators:</span>
                      <span className="font-semibold">{selectedCollaborators.length}/3</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Problem Difficulty:</span>
                      <Badge variant="outline">{problem.difficulty}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Session Progress:</span>
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${sessionProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={startCollaboration}
                    disabled={selectedCollaborators.length === 0 || sessionActive}
                    className="w-full mt-4"
                  >
                    {sessionActive ? "Session Active" : "Start Collaboration"}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborativeSolve;