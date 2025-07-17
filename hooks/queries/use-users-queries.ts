"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { usersApi } from "@/lib/api/users"
import { useToast } from "@/hooks/use-toast"

export const useUsersQueries = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Get all users
  const useUsers = () => {
    return useQuery({
      queryKey: ["users"],
      queryFn: usersApi.getUsers,
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 30 * 1000, // Refetch every 30 seconds for online status
    })
  }

  // Get user by ID
  const useUser = (userId: string) => {
    return useQuery({
      queryKey: ["users", userId],
      queryFn: () => usersApi.getUserById(userId),
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  // Search users
  const useSearchUsers = (query: string) => {
    return useQuery({
      queryKey: ["users", "search", query],
      queryFn: () => usersApi.searchUsers(query),
      enabled: query.length > 2,
      staleTime: 1 * 60 * 1000, // 1 minute
    })
  }

  // Update user status
  const useUpdateUserStatus = () => {
    return useMutation({
      mutationFn: ({ userId, isOnline }: { userId: string; isOnline: boolean }) =>
        usersApi.updateUserStatus(userId, isOnline),
      onSuccess: (updatedUser) => {
        // Update the users list cache
        queryClient.setQueryData(["users"], (oldData: any) => {
          if (!oldData) return oldData
          return {
            ...oldData,
            users: oldData.users.map((user: any) => (user.id === updatedUser.id ? updatedUser : user)),
          }
        })

        // Update individual user cache
        queryClient.setQueryData(["users", updatedUser.id], updatedUser)
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to update user status",
          variant: "destructive",
        })
      },
    })
  }

  return {
    useUsers,
    useUser,
    useSearchUsers,
    useUpdateUserStatus,
  }
}
