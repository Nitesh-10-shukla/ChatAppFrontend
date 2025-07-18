"use client";

import { useState } from "react";
import { useChatStore } from "@/store/chat-store";
import { useSocket } from "@/context/SocketContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatTime } from "@/lib/utils";
import { MoreVertical, Edit3, Trash2, Reply, Copy } from "lucide-react";
import type { Message } from "@/lib/types";

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
}

export function MessageItem({ message, isOwn }: MessageItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const { users, currentUser, setMessage } = useChatStore();
  const { editMessage, deleteMessage } = useSocket();

  const sender = users.find((user) => user.id === message.senderId) || currentUser;

  const handleEdit = () => {
    if (editContent.trim() && editContent !== message.content) {
      editMessage(message.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteMessage(message.id);
  };

  const handleEditClick = () => {
    setMessage({
      ...message,
      content: message.content,
    });
    setIsEditing(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditContent(message.content);
    }
  };

  if (message.isDeleted) {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
        <div className="max-w-xs lg:max-w-md">
          <div className="bg-muted/50 text-muted-foreground italic px-4 py-2 rounded-lg text-sm">
            This message was deleted
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4 group`}>
      <div className={`flex ${isOwn ? "flex-row-reverse" : "flex-row"} items-end space-x-2 max-w-xs lg:max-w-md`}>
        {!isOwn && (
          <Avatar className="h-8 w-8 mb-1">
            <AvatarImage src={sender?.avatar} />
            <AvatarFallback className="text-xs">
              {sender?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        
        <div className={`relative ${isOwn ? "mr-2" : "ml-2"}`}>
          {!isOwn && (
            <p className="text-xs text-muted-foreground mb-1 px-1">
              {sender?.username}
            </p>
          )}
          
          <div
            className={`relative px-4 py-2 rounded-2xl shadow-sm ${
              isOwn
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-background border rounded-bl-md"
            }`}
          >
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="text-sm border-0 p-0 h-auto bg-transparent focus-visible:ring-0"
                  autoFocus
                />
                <div className="flex justify-end space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2 text-xs"
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(message.content);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={handleEdit}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                {message.id && (
                  <p className="text-xs opacity-70 mt-1">
                    {formatTime(message.timestamp)}
                    {message.isRead && isOwn && (
                      <span className="ml-1 text-blue-400">✓✓</span>
                    )}
                  </p>
                )}
              </>
            )}
          </div>

          {/* Message Actions */}
          {isOwn && !isEditing && (
            <div className="absolute -top-2 -left-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 bg-background border shadow-sm hover:bg-muted"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-32">
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Edit3 className="mr-2 h-3 w-3" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="mr-2 h-3 w-3" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={handleDelete}
                    className="text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-3 w-3" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {!isOwn && !isEditing && (
            <div className="absolute -top-2 -right-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 bg-background border shadow-sm hover:bg-muted"
                  >
                    <MoreVertical className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="mr-2 h-3 w-3" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Reply className="mr-2 h-3 w-3" />
                    Reply
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}