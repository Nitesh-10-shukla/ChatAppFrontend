import api from "@/lib/axios"
import type { Message } from "@/lib/types"

export interface MessagesResponse {
  data: Message[]
  nextCursor: string | null
  hasNextPage: boolean
}

export interface SendMessageRequest {
  content: string
  receiverId: string
}

export const messagesApi = {
  // Get messages between two users
  getMessages: async (userId: string, query:string): Promise<MessagesResponse> => {
    const { data } = await api.get(`/api/chat/chats/${userId}?${query ?? ""}`)
    return data
  },

  // Send a message
  sendMessage: async (messageData: SendMessageRequest): Promise<Message> => {
    const { data } = await api.post("/api/messages", messageData)
    return data
  },

  // Mark messages as read
  markAsRead: async (messageIds: string[]): Promise<void> => {
    await api.patch("/api/messages/read", { messageIds })
  },

  // Delete a message
  deleteMessage: async (messageId: string): Promise<void> => {
    await api.delete(`/api/messages/${messageId}`)
  },

  // Get unread message count
  getUnreadCount: async (): Promise<{ count: number }> => {
    const { data } = await api.get("/api/messages/unread-count")
    return data
  },
}
