"use client";

import { useChatStore } from "@/store/chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function ChatHeader() {
  const { users, activeUserId, typingUsers } = useChatStore();

  const activeUser = users.find((user) => user.id === activeUserId);
  const isTyping = activeUserId && typingUsers.includes(activeUserId);
  if (!activeUser) return null;

  return (
    <div className="border-b bg-white p-4">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar>
            <AvatarImage src={activeUser.avatar || ""} />
            <AvatarFallback>
              {activeUser?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div
            className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
              activeUser.isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>
        <div className="flex-1">
          <h2 className="font-semibold">{activeUser?.username}</h2>
          <div className="flex items-center space-x-2">
            <Badge
              variant={activeUser.isOnline ? "default" : "secondary"}
              className="text-xs"
            >
              {activeUser.isOnline ? "Online" : "Offline"}
            </Badge>
            {isTyping && (
              <span className="text-sm text-muted-foreground animate-pulse">
                typing...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
