import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Code, Clock } from "lucide-react";

interface CollaborationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollaborationModal = ({ isOpen, onClose }: CollaborationModalProps) => {
  const navigate = useNavigate();
  const [isAccepting, setIsAccepting] = useState(false);

  const handleAccept = async () => {
    setIsAccepting(true);
    
    // Simulate accepting collaboration
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Navigate to collaborative session
    const sessionId = Math.random().toString(36).substring(7);
    navigate(`/collaborative-solve/${sessionId}`);
    
    onClose();
    setIsAccepting(false);
  };

  const handleDecline = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Collaboration Request
          </DialogTitle>
          <DialogDescription>
            Someone wants to collaborate with you on a coding problem!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-4 py-4">
          {/* User Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                AT
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold text-foreground">Alex Thompson</div>
              <div className="text-sm text-muted-foreground">Rank #6 • 4.6★</div>
            </div>
          </div>

          {/* Problem Info */}
          <div className="bg-muted/50 rounded-lg p-4 w-full text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Code className="h-4 w-4 text-green-600" />
              <span className="font-medium text-foreground">Two Sum Problem</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Difficulty: Easy • Array, Hash Table
            </div>
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>This request expires in 30 seconds</span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full">
            <Button 
              variant="outline" 
              onClick={handleDecline}
              className="flex-1"
              disabled={isAccepting}
            >
              Decline
            </Button>
            <Button 
              onClick={handleAccept}
              className="flex-1"
              disabled={isAccepting}
            >
              {isAccepting ? "Joining..." : "Accept & Collaborate"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollaborationModal;