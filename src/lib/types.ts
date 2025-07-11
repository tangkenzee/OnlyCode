export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  solution?: string;
  tags: string[];
  testCases?: any;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rating: number;
  xp: number;
  joinDate: string;
  isOnline: boolean;
  lastSeen: Date;
  skills: string[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'code' | 'hint';
}

export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  xp: number;
  isOnline: boolean;
  lastSeen: Date;
  skills: string[];
} 