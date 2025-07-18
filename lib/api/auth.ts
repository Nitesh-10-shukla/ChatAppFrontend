import api from "@/lib/axios";
import type { LoginFormData, RegisterFormData } from "@/lib/validations";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

export interface RegisterResponse extends AuthResponse {}

export const authApi = {
  async login(credentials: LoginFormData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      "/api/auth/login",
      credentials
    );
    return data;
  },

  async register(userData: RegisterFormData): Promise<RegisterResponse> {
    const { data } = await api.post("/api/auth/register", userData);
    return data;
  },

  async getProfile(): Promise<AuthResponse> {
    const { data } = await api.get("/api/auth/profile");
    return data;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },
};

// Legacy class-based API for backward compatibility
export class AuthApi {
  static async login(credentials: LoginFormData): Promise<AuthResponse> {
    return authApi.login(credentials);
  }

  static async register(userData: RegisterFormData): Promise<RegisterResponse> {
    return authApi.register(userData);
  }

  static async getProfile(): Promise<AuthResponse> {
    return authApi.getProfile();
  }

  static async logout(): Promise<void> {
    return authApi.logout();
  }
}