"use client";

import { useState } from "react";
import { useChatStore } from "@/store/chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Video, MoreVertical, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProfileModal } from "./user-profile-modal";

export function ChatHeader() {
  const { users, activeUserId, typingUsers } = useChatStore();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const activeUser = users.find((user) => user.id === activeUserId);
  const isTyping = activeUserId && typingUsers.includes(activeUserId);
  if (!activeUser) return null;

  return (
    <>
      <div className="border-b bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors flex-1"
            onClick={() => setShowProfileModal(true)}
          >
        <div className="relative">
              <Avatar className="h-10 w-10">
            <AvatarImage src={activeUser.avatar || ""} />
            <AvatarFallback>
              {activeUser?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div
              className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${
              activeUser.isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        </div>
        <div className="flex-1">
            <h2 className="font-semibold text-gray-900">{activeUser?.username}</h2>
          <div className="flex items-center space-x-2">
            {isTyping && (
                <span className="text-sm text-blue-600 animate-pulse font-medium">
                typing...
              </span>
            )}
            {!isTyping && (
              <span className={`text-sm ${activeUser.isOnline ? "text-green-600" : "text-gray-500"}`}>
                {activeUser.isOnline ? "Online" : "Offline"}
              </span>
            )}
          </div>
        </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Phone className="h-5 w-5 text-gray-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <Video className="h-5 w-5 text-gray-600" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setShowProfileModal(true)}>
                  <Info className="mr-2 h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <UserProfileModal
        user={activeUser}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        isOwnProfile={false}
      />
    </>
  );
}
