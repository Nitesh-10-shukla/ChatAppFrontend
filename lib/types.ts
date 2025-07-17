export interface User {
  id: string;
  username: string;
  name?: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  token?: string; // Optional token for authentication
}

export interface Message {
  tempId?: any;
  id:string
  content: string;
  senderId: string;
  receiverId: string;
  timestamp: Date;
  isRead?: boolean;
  isDeleted?:boolean
}

export interface ChatState {
  users: User[];
  messages: Message[];
  activeUserId: string | null;
  currentUser: User | null;
  typingUsers: string[];
  message:Message| null;
  isConnected: boolean;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
}
