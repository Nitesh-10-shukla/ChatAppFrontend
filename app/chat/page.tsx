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
    <div className="h-screen flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 lg:w-96 border-r bg-white shadow-sm flex-shrink-0">
        <UserList />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeUserId ? (
          <>
            <ChatHeader />
            <div className="flex-1 overflow-hidden bg-gray-50">
              <MessageList />
            </div>
            <MessageInput />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <Card className="p-12 text-center max-w-md mx-4 shadow-lg border-0">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-gray-900">Welcome to Chat!</h2>
              <p className="text-gray-600 mb-6">
                Select a user from the sidebar to start chatting
              </p>
              <div className="flex items-center justify-center">
                <div
                  className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                    isConnected
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <div
                    className={`w-2.5 h-2.5 rounded-full mr-2 ${
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
