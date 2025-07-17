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
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">
            Loading messages...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-destructive">Failed to load messages</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 bg-transparent"
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
      className="flex-1 p-4 h-[calc(100vh-50px)]" // Fixed height
    >
      <div className="space-y-4">
        {hasNextPage && (
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
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
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Start the conversation!
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
