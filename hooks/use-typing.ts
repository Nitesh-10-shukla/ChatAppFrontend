"use client"

import { useSocket } from "@/context/SocketContext"
import { useCallback, useRef } from "react"

export function useTyping(receiverId: string | null) {
  const { startTyping, stopTyping } = useSocket()
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleTyping = useCallback(() => {
    if (!receiverId) return

    startTyping(receiverId)

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout to stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping(receiverId)
    }, 2000)
  }, [receiverId, startTyping, stopTyping])

  const handleStopTyping = useCallback(() => {
    if (!receiverId) return

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
    stopTyping(receiverId)
  }, [receiverId, stopTyping])

  return {
    handleTyping,
    handleStopTyping,
  }
}
