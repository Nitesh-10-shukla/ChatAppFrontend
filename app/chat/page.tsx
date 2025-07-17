"use client";

import { useEffect } from "react";
import { useChatStore } from "@/store/chat-store";
import { UserList } from "@/components/chat/user-list";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { Card } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useSocket } from "@/context/SocketContext";

export default function ChatPage() {
  const { activeUserId, setCurrentUser } = useChatStore();
  const { isConnected } = useSocket();
  const { data } = useSession();

  useEffect(() => {
    if(!data) return;
    // Set mock current user
    setCurrentUser({
      ...data?.user,
      name: data?.user?.name ?? undefined,
      avatar: "/placeholder.svg?height=32&width=32",
      isOnline: true,
      token: data?.accessToken || "",
      id: data?.user?.id,
      username: data?.user?.name || data?.user?.email || "Anonymous",
    });

  }, [setCurrentUser,data]);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 border-r bg-white">
        <UserList />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeUserId ? (
          <>
            <ChatHeader />
            <div className="flex-1 overflow-hidden">
              <MessageList />
            </div>
            <MessageInput />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <Card className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-2">Welcome to Chat!</h2>
              <p className="text-muted-foreground">
                Select a user from the sidebar to start chatting
              </p>
              <div className="mt-4">
                <div
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    isConnected
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  {isConnected ? "Connected" : "Disconnected"}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
