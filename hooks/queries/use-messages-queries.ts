"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { messagesApi, MessagesResponse } from "@/lib/api/messages";
import { useToast } from "@/hooks/use-toast";

export const useMessagesQueries = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

function useMessages(userId: string) {
  return useInfiniteQuery<MessagesResponse, Error>({
    queryKey: ["messages", userId],
    queryFn: ({ pageParam }:any) =>
      messagesApi.getMessages(userId, pageParam), 
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!userId,
    staleTime: 60 * 1000,
    initialPageParam: undefined,
  });
}

  // Send message mutation
  const useSendMessage = () => {
    return useMutation({
      mutationFn: messagesApi.sendMessage,
      onSuccess: (newMessage) => {
        // Add the new message to the cache
        queryClient.setQueryData(
          ["messages", newMessage.receiverId],
          (oldData: any) => {
            if (!oldData) return oldData;

            const firstPage = oldData.pages[0];
            if (firstPage) {
              firstPage.messages.push(newMessage);
            }

            return oldData;
          }
        );

        // Also update the opposite direction (for the receiver)
        queryClient.setQueryData(
          ["messages", newMessage.senderId],
          (oldData: any) => {
            if (!oldData) return oldData;

            const firstPage = oldData.pages[0];
            if (firstPage) {
              firstPage.messages.push(newMessage);
            }

            return oldData;
          }
        );

        // Invalidate unread count
        queryClient.invalidateQueries({
          queryKey: ["messages", "unread-count"],
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to send message",
          variant: "destructive",
        });
      },
    });
  };

  // Mark messages as read
  const useMarkAsRead = () => {
    return useMutation({
      mutationFn: messagesApi.markAsRead,
      onSuccess: () => {
        // Invalidate unread count
        queryClient.invalidateQueries({
          queryKey: ["messages", "unread-count"],
        });
      },
      onError: (error: any) => {
        console.error("Failed to mark messages as read:", error);
      },
    });
  };

  // Delete message
  const useDeleteMessage = () => {
    return useMutation({
      mutationFn: messagesApi.deleteMessage,
      onSuccess: (_, messageId) => {
        // Remove message from all relevant caches
        queryClient.setQueriesData(
          { queryKey: ["messages"] },
          (oldData: any) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page: any) => ({
                ...page,
                messages: page.messages.filter(
                  (msg: any) => msg.id !== messageId
                ),
              })),
            };
          }
        );

        toast({
          title: "Success",
          description: "Message deleted successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error.response?.data?.message || "Failed to delete message",
          variant: "destructive",
        });
      },
    });
  };

  // Get unread count
  const useUnreadCount = () => {
    return useQuery({
      queryKey: ["messages", "unread-count"],
      queryFn: messagesApi.getUnreadCount,
      refetchInterval: 30 * 1000, // Refetch every 30 seconds
      staleTime: 15 * 1000, // 15 seconds
    });
  };

  return {
    useMessages,
    useSendMessage,
    useMarkAsRead,
    useDeleteMessage,
    useUnreadCount,
  };
};
