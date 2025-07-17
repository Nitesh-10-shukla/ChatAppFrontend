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
      className={`relative flex items-start space-x-3 py-1 mt-24 group ${
        isOwn ? "flex-row-reverse space-x-reverse" : ""
      }`}
    >
      {/* Avatar with dropdown menu positioned above */}
      <div className="relative">
        <Avatar className="h-8 w-8">
          <AvatarImage src={sender?.avatar || ""} />
          <AvatarFallback>
            {sender?.name?.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Dropdown menu positioned above avatar */}
        {isOwn && !message?.isDeleted && (
          <div
            className={`absolute -top-2 ${isOwn ? "-left-2" : "-right-2"} z-10`}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`p-1.5 rounded-full bg-background border border-border shadow-sm hover:bg-muted transition-all duration-200 ${
                    isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
                  }`}
                >
                  <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side={isOwn ? "left" : "right"}
                align="start"
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

      {/* Message + Time */}
      <div
        className={`flex flex-col ${
          isOwn ? "items-end" : "items-start"
        } max-w-xs lg:max-w-md`}
      >
        <div
          className={`rounded-lg px-3 py-2 ${
            isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          <p className="text-sm">
            {message?.isDeleted ? (
              <i className="text-muted-foreground">
                {isOwn
                  ? "You deleted this message"
                  : "This message was deleted"}
              </i>
            ) : (
              message.content
            )}
          </p>
        </div>

        <span className="text-xs text-muted-foreground mt-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
