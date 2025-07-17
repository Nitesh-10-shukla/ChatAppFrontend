"use client";

import { useCallback, useEffect, useRef } from "react";
import { useChatStore } from "@/store/chat-store";
import { useMessagesQueries } from "@/hooks/queries/use-messages-queries";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { MessageItem } from "./message-item";
import { Loader2 } from "lucide-react";

export function MessageList() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { activeUserId, currentUser, setMessages, getMessagesForActiveUser } =
    useChatStore();
  const { useMessages } = useMessagesQueries();

  // Always call useMessages with a stable string (empty string if no activeUserId)
  const activeId = activeUserId || "";

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessages(activeId);

  useEffect(() => {
    if (data && activeUserId && currentUser?.id) {
      const allMessages = data.pages.flatMap((page) => page.data);
      console.log("Fetched messages:", allMessages);
      setMessages(allMessages);
    }
  }, [data, activeUserId, currentUser, setMessages]);

  const chatMessages = getMessagesForActiveUser();
  console.log("Chat messages for active user:", chatMessages);
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [chatMessages.length]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, scrollToBottom]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-3 text-sm text-gray-600">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-sm text-red-600 mb-3">Failed to load messages</p>
          <Button
            variant="outline"
            size="sm"
            className="bg-background"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="flex-1 h-[calc(100vh-140px)]" // Fixed height
    >
      <div className="p-4 space-y-2">
        {hasNextPage && (
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              className="bg-background shadow-sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                "Load more messages"
              )}
            </Button>
          </div>
        )}

        {chatMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-muted-foreground text-lg font-medium">No messages yet</p>
            <p className="text-muted-foreground/70 text-sm mt-1">Start the conversation!</p>
          </div>
        ) : (
          chatMessages.map((message) => (
            <MessageItem
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUser?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
