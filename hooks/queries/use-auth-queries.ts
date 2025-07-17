"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { authApi } from "@/lib/api/auth"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "next-auth/react"

export const useAuthQueries = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Get user profile
  const useProfile = () => {
    return useQuery({
      queryKey: ["auth", "profile"],
      queryFn: authApi.getProfile,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })
  }

  // Login mutation
  const useLogin = () => {
    return useMutation({
      mutationFn: authApi.login,
      onSuccess: (data) => {
        queryClient.setQueryData(["auth", "profile"], data)
        toast({
          title: "Success",
          description: "Logged in successfully!",
        })
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Login failed",
          variant: "destructive",
        })
      },
    })
  }

  // Register mutation
  const useRegister = () => {
    return useMutation({
      mutationFn: authApi.register,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Account created successfully! Please sign in.",
        })
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Registration failed",
          variant: "destructive",
        })
      },
    })
  }

  // Logout mutation
  const useLogout = () => {
    return useMutation({
      mutationFn: authApi.logout,
      onSuccess: () => {
        queryClient.clear()
        signOut({ callbackUrl: "/login" })
        toast({
          title: "Success",
          description: "Logged out successfully!",
        })
      },
      onError: (error: any) => {
        // Still sign out even if API call fails
        queryClient.clear()
        signOut({ callbackUrl: "/login" })
        toast({
          title: "Warning",
          description: "Logged out locally, but server logout may have failed",
          variant: "destructive",
        })
      },
    })
  }

  return {
    useProfile,
    useLogin,
    useRegister,
    useLogout,
  }
}
