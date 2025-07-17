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

export class AuthApi {
  static async login(credentials: LoginFormData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>(
      "/api/auth/login",
      credentials
    );
    return data;
  }

  static async register(userData: RegisterFormData): Promise<RegisterResponse> {
    const { data } = await api.post("/api/auth/register", userData);
    return data;
  }

  static async getProfile(): Promise<AuthResponse> {
    const { data } = await api.get("/api/auth/profile");
    return data;
  }

  static async logout(): Promise<void> {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
}
