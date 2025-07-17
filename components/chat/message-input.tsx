"use client";

import React from "react";
import { useChatStore } from "@/store/chat-store";
import { useSocket } from "@/context/SocketContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useTyping } from "@/hooks/use-typing";

export function MessageInput() {
  const { activeUserId, message, setMessage } = useChatStore();
  const content = message?.content || "";
  const { sendMessage, editMessage, isConnected } = useSocket();
  const { handleTyping, handleStopTyping } = useTyping(activeUserId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = content.trim();
    if (!trimmed || !activeUserId || !message) return;

    const isEdit = Boolean(message.id); // Consider as edit if id is set

    if (isEdit) {
      editMessage(message.id, trimmed);
    } else {
      sendMessage(trimmed, activeUserId);
    }

    // Reset message after send or edit
    setMessage({
      id: "",
      content: "",
      senderId: "",
      receiverId: activeUserId,
      timestamp: new Date(),
      isRead: false,
      isDeleted: false,
    });

    handleStopTyping();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!activeUserId) return;

    const baseMessage = message ?? {
      id: "", // empty means it's a new message
      content: "",
      senderId: "",
      receiverId: activeUserId,
      timestamp: new Date(),
      isRead: false,
      isDeleted: false,
    };

    setMessage({ ...baseMessage, content: value });

    if (value) {
      handleTyping();
    } else {
      handleStopTyping();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={content}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1"
          disabled={!activeUserId || !isConnected}
        />
        <Button
          type="submit"
          size="icon"
          disabled={
            !content.trim() || !activeUserId || !isConnected || !message
          }
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
