import api from "@/lib/axios";
import type { User } from "@/lib/types";

export interface UsersResponse {
  users: User[];
}

export const usersApi = {
  /**
   * Fetches all users with pagination info.
   */
  async getUsers(): Promise<User[]> {
    const { data } = await api.get<User[]>("/api/user/users");
    return data;
  },

  /**
   * Fetches a single user by ID.
   * @param userId - The ID of the user to fetch.
   */
  async getUserById(userId: string): Promise<User> {
    const { data } = await api.get<User>(`/api/users/${userId}`);
    return data;
  },

  /**
   * Updates a user's online status.
   * @param userId - The ID of the user to update.
   * @param isOnline - New online status to set (true/false).
   */
  async updateUserStatus(userId: string, isOnline: boolean): Promise<User> {
    const { data } = await api.patch<User>(`/api/users/${userId}/status`, {
      isOnline,
    });
    return data;
  },

  /**
   * Searches users matching the query.
   * @param query - The search string (usernames, emails, etc.).
   */
  async searchUsers(query: string): Promise<User[]> {
    const { data } = await api.get<User[]>(`/api/users/search`, {
      params: { q: query },
    });
    return data;
  },
};

// Legacy class-based API for backward compatibility
export class UsersApi {
  async getUsers(): Promise<User[]> {
    return usersApi.getUsers();
  }

  async getUserById(userId: string): Promise<User> {
    return usersApi.getUserById(userId);
  }

  async updateUserStatus(userId: string, isOnline: boolean): Promise<User> {
    return usersApi.updateUserStatus(userId, isOnline);
  }

  async searchUsers(query: string): Promise<User[]> {
    return usersApi.searchUsers(query);
  }
}