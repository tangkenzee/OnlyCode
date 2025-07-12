import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { apiClient } from "@/lib/api.ts";

interface CollaborativeSolveProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem;
  currentUser?: Collaborator;
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

const CollaborativeSolve = ({ isOpen, onClose, problem, currentUser, starterCode }: CollaborativeSolveProps & { starterCode?: string }) => {
  const [selectedCollaborators, setSelectedCollaborators] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionProgress, setSessionProgress] = useState(0);
  const [sharedCode, setSharedCode] = useState("");
  const [availableCollaborators, setAvailableCollaborators] = useState<Collaborator[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      apiClient.getCurrentUser().then(() => {
        apiClient.getProblems().then((problems) => {
          // You may want to use problems for context, or remove this if not needed
        });
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && availableCollaborators.length === 0) {
      apiClient.getUsers()
        .then((users: Collaborator[]) => {
          // Exclude the current user from the list of available collaborators
          const filtered = currentUser ? users.filter(u => u.id !== currentUser.id) : users;
          setAvailableCollaborators(filtered);
        })
        .catch((err) => {
          console.error('Failed to load collaborators:', err);
          setAvailableCollaborators([]);
        });
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    if (isOpen && currentUser) {
      console.log('Current user tagSkillLevels:', currentUser.tagSkillLevels);
    }
    if (isOpen && availableCollaborators.length > 0) {
      availableCollaborators.forEach((collab) => {
        console.log(`Collaborator ${collab.name} tagSkillLevels:`, collab.tagSkillLevels);
      });
    }
  }, [isOpen, currentUser, availableCollaborators]);

  const startCollaboration = () => {
    if (selectedCollaborators.length === 0) return;
    // Generate a session ID (could be random or based on timestamp)
    const sessionId = Date.now().toString();
    const collaborators = availableCollaborators.filter(c => selectedCollaborators.includes(c.id));
    // Navigate to the collaborative session page, passing problem, collaborators, and starterCode as state
    navigate(`/collaborative-solve/${sessionId}`, {
      state: {
        problem,
        collaborators,
        currentUser,
        starterCode
      }
    });
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
    if (!currentUser || !currentUser.tagSkillLevels || !collaborator.tagSkillLevels) return 0;
    const allTags = Array.from(new Set([
      ...Object.keys(currentUser.tagSkillLevels),
      ...Object.keys(collaborator.tagSkillLevels)
    ]));
    let total = 0;
    let count = 0;
    for (const tag of allTags) {
      const myLevel = Number(currentUser.tagSkillLevels[tag] ?? 0);
      const theirLevel = Number(collaborator.tagSkillLevels[tag] ?? 0);
      if (myLevel === 0 && theirLevel === 0) continue;
      if (myLevel === 0 || theirLevel === 0) {
        // If one user has no skill, treat as no match for this tag
        total += 0;
        count++;
        continue;
      }
      const maxLevel = Math.max(myLevel, theirLevel, 1);
      const closeness = 1 - Math.abs(myLevel - theirLevel) / maxLevel;
      total += closeness;
      count++;
    }
    if (count === 0) return 0;
    return Math.round((total / count) * 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-6 w-full flex flex-col" style={{ minHeight: '60vh', height: 'auto', maxHeight: '80vh' }}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Collaborative Problem Solving
            </DialogTitle>
            <DialogDescription>
              Work with peers who have similar skill levels to solve "{problem.title}" together
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 flex flex-col lg:flex-row gap-6 w-full" style={{ minHeight: '40vh', height: '100%' }}>
            <div className="flex-1">
              {/* Available Collaborators Card */}
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">Available Collaborators</CardTitle>
                  <CardDescription>
                    Select 1-3 peers to collaborate with. Choose users with similar skill levels for the best experience.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 max-h-72 overflow-y-auto">
                  {availableCollaborators
                    .sort((a, b) => getSkillMatch(b) - getSkillMatch(a))
                    .map((collaborator) => {
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
            {selectedCollaborators.length > 0 && (
              <div className="flex-1">
                {/* Session Info Card */}
                <Card className="h-full flex flex-col">
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
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborativeSolve;