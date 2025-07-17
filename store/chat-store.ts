import { create } from "zustand";
import type { ChatState, User, Message, TypingIndicator } from "@/lib/types";

interface ChatStore extends ChatState {
  setUsers: (users: User[]) => void;
  setMessages: (messages: Message[]) => void;
  setMessage: (message: Message) => void;
  addMessage: (message: Message) => void;
  setActiveUser: (userId: string | null) => void;
  setCurrentUser: (user: User | null) => void;
  updateUserStatus: (userId: string, isOnline: boolean) => void;
  setTypingUser: (typing: TypingIndicator) => void;
  setConnectionStatus: (isConnected: boolean) => void;
  getMessagesForActiveUser: () => Message[];
}

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  messages: [],
  activeUserId: null,
  currentUser: null,
  typingUsers: [],
  isConnected: false,
  message:null,
  setUsers: (users) => set({ users }),
  setMessage:(message) => set({message}),
  setMessages: (messages) => set({ messages }),

  addMessage: (newMessage) =>
    set((state) => {
      // Check for existing message by ID or tempId
      const existsById = state.messages.some((m) => m.id === newMessage.id);
      const existsByTempId = newMessage.tempId
        ? state.messages.some((m) => m.tempId === newMessage.tempId)
        : false;

      if (existsById || existsByTempId) {
        // Update existing message
        return {
          messages: state.messages.map((m) =>
            m.id === newMessage.id || m.tempId === newMessage.tempId
              ? { ...m, ...newMessage }
              : m
          ),
        };
      }

      // Add new message
      return {
        messages: [...state.messages, newMessage],
      };
    }),

  setActiveUser: (userId) => set({ activeUserId: userId }),

  setCurrentUser: (user) => set({ currentUser: user }),

  updateUserStatus: (userId, isOnline) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId ? { ...user, isOnline } : user
      ),
    })),

  setTypingUser: ({ userId, isTyping }) =>
    set((state) => ({
      typingUsers: isTyping
        ? [...state.typingUsers.filter((id) => id !== userId), userId]
        : state.typingUsers.filter((id) => id !== userId),
    })),

  setConnectionStatus: (isConnected) => set({ isConnected }),

  getMessagesForActiveUser: () => {
    const { messages, activeUserId, currentUser } = get();
    if (!activeUserId || !currentUser) return [];

    return messages
      .filter(
        (message) =>
          (message.senderId === currentUser.id &&
            message.receiverId === activeUserId) ||
          (message.senderId === activeUserId &&
            message.receiverId === currentUser.id)
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );
  },
}));
