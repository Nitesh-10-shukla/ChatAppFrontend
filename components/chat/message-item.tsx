"use client";

import { useState } from "react";
import type { Message } from "@/lib/types";
import { formatTime } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore } from "@/store/chat-store";
import { useSocket } from "@/context/SocketContext";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
}

export function MessageItem({ message, isOwn }: MessageItemProps) {
  const { users, currentUser, setMessage } = useChatStore();
  const { deleteMessage } = useSocket();
  const [isHovered, setIsHovered] = useState(false);

  const sender = isOwn
    ? currentUser
    : users.find((user) => user.id === message.senderId);

  const handleDelete = () => {
    if (!isOwn) return;
    deleteMessage(message.id);
    toast.success("Message deleted");
  };

  const handleEdit = () => {
    setMessage(message);
    toast.success("Edit feature coming soon!");
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex items-start space-x-3 py-3 group ${
        isOwn ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={sender?.avatar || ""} />
          <AvatarFallback>
            {sender?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Message Content */}
      <div
        className={`flex flex-col ${
          isOwn ? "items-end" : "items-start"
        } max-w-xs lg:max-w-md xl:max-w-lg relative`}
      >
        {/* Message Bubble */}
        <div
          className={`relative rounded-2xl px-4 py-2 shadow-sm ${
            isOwn 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-foreground"
          } ${
            isOwn ? "rounded-br-md" : "rounded-bl-md"
          }`}
        >
          <p className="text-sm">
            {message?.isDeleted ? (
              <i className="text-muted-foreground italic">
                {isOwn
                  ? "You deleted this message"
                  : "This message was deleted"}
              </i>
            ) : (
              message.content
            )}
          </p>

          {/* Message Actions */}
          {isOwn && !message?.isDeleted && (
            <div
              className={`absolute ${
                isOwn ? "-left-8" : "-right-8"
              } top-1/2 transform -translate-y-1/2 transition-opacity duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors">
                 <button className="p-1 rounded-full bg-background border shadow-sm hover:bg-muted transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side={isOwn ? "left" : "right"}
                  align="center"
                  className="w-40"
                >
                  <DropdownMenuItem
                    onClick={handleEdit}
                    className="cursor-pointer"
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className={`text-xs mt-1 ${
          "text-muted-foreground"
        }`}>
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
