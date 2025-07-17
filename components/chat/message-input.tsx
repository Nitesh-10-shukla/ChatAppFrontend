"use client";

import React from "react";
import { useChatStore } from "@/store/chat-store";
import { useSocket } from "@/context/SocketContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useTyping } from "@/hooks/use-typing";
import { EmojiPicker } from "./emoji-picker";
import { FileUpload } from "./file-upload";
import { VoiceRecorder } from "./voice-recorder";

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

  const handleEmojiSelect = (emoji: string) => {
    if (!activeUserId) return;

    const baseMessage = message ?? {
      id: "",
      content: "",
      senderId: "",
      receiverId: activeUserId,
      timestamp: new Date(),
      isRead: false,
      isDeleted: false,
    };

    setMessage({ ...baseMessage, content: content + emoji });
  };

  const handleFileSelect = (file: File, type: string) => {
    console.log("File selected:", file, type);
    // Handle file upload logic here
  };

  const handleVoiceMessage = (audioBlob: Blob, duration: number) => {
    console.log("Voice message:", audioBlob, duration);
    // Handle voice message logic here
  };
  return (
    <div className="border-t bg-background p-4 shadow-sm">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex space-x-1">
          <FileUpload onFileSelect={handleFileSelect} />
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />
        </div>
        
        <Input
          value={content}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 rounded-full"
          disabled={!activeUserId || !isConnected}
        />
        
        <div className="flex space-x-1">
          {content.trim() ? (
            <Button
              type="submit"
              size="sm"
              className="h-9 w-9 p-0 rounded-full"
              disabled={
                !content.trim() || !activeUserId || !isConnected || !message
              }
            >
              <Send className="h-4 w-4" />
            </Button>
          ) : (
            <VoiceRecorder onVoiceMessage={handleVoiceMessage} />
          )}
        </div>
      </form>
    </div>
  );
}
