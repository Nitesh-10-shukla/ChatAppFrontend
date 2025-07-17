"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { io, type Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useChatStore } from "@/store/chat-store";
import type { Message, TypingIndicator, User } from "@/lib/types";

interface OnlineUser {
  userId: string;
}

interface SocketContextType {
  sendMessage: (content: string, receiverId: string) => void;
  startTyping: (receiverId: string) => void;
  stopTyping: (receiverId: string) => void;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string , content:string) => void;
  isConnected: boolean;
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({
  sendMessage: () => {},
  startTyping: () => {},
  stopTyping: () => {},
  deleteMessage: () => {},
  editMessage: () => {},
  isConnected: false,
  socket: null,
});

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const { data } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const {
    users,
    setUsers,
    setTypingUser,
    setConnectionStatus,
    currentUser,
    setMessages,
    messages,
  } = useChatStore();

  useEffect(() => {
    if (!data?.accessToken || !currentUser || socketRef.current) return;

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

    const socket = io(backendUrl, {
      auth: {
        token: data.accessToken,
      },
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
      setConnectionStatus(true);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
      setConnectionStatus(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket error:", err);
      setIsConnected(false);
      setConnectionStatus(false);
    });

    socket.on("users", (usersFromServer: User[]) => {
      setUsers(usersFromServer);
    });

    socket.on("onlineUsers", (onlineList: OnlineUser[]) => {
      const onlineIds = new Set(onlineList.map((u) => u.userId));
      setUsers(
        users.map((user) => ({
          ...user,
          isOnline: onlineIds.has(user.id),
        }))
      );
    });

    socket.on("message:new", (message: Message) => {
      useChatStore.getState().addMessage(message);
    });

    socket.on("typing:start", (data: TypingIndicator) => {
      setTypingUser({ ...data, isTyping: true });
    });

    socket.on("typing:stop", (data: TypingIndicator) => {
      setTypingUser({ ...data, isTyping: false });
    });

    socket.on("message:edited", (updatedMessage: Message) => {
      const currentMessages = useChatStore.getState().messages;
      const updatedMessages = currentMessages.map((msg) =>
        msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
      );
      useChatStore.getState().setMessages(updatedMessages);
    });

    socket.on("message:deleted", (updatedMessage: Message) => {
      const currentMessages = useChatStore.getState().messages;
      const updatedMessages = currentMessages.map((msg) =>
        msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
      );
      useChatStore.getState().setMessages(updatedMessages);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setConnectionStatus(false);
    };
  }, [data?.accessToken, currentUser]);

  const sendMessage = (content: string, receiverId: string) => {
    const socket = socketRef.current;
    if (socket && currentUser) {
      socket.emit("sendMessage", {
        content,
        recipientId: receiverId,
      });
    }
  };

  const startTyping = (receiverId: string) => {
    const socket = socketRef.current;
    if (socket && currentUser) {
      socket.emit("typing:start", {
        recipientId: receiverId,
      });
    }
  };

  const stopTyping = (receiverId: string) => {
    const socket = socketRef.current;
    if (socket && currentUser) {
      socket.emit("typing:stop", {
        recipientId: receiverId,
      });
    }
  };

  const deleteMessage = (messageId: string) => {
    const socket = socketRef.current;
    if (socket && currentUser) {
      socket.emit("deleteMessage", {
        messageId: messageId,
      });
    }
  };

  const editMessage = (messageId: string, content: string) => {
    const socket = socketRef.current;
    if (socket && currentUser) {
      socket.emit("editMessage", {
        messageId,
        content,
      });
    }
  };

  return (
    <SocketContext.Provider
      value={{
        sendMessage,
        startTyping,
        stopTyping,
        deleteMessage,
        editMessage,
        isConnected,
        socket: socketRef.current,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
