import axios from "axios"
import { getSession } from "next-auth/react"
import { PUBLIC_PATHS } from "./constant"

export const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const session = await getSession()
      if (session?.user?.id) {
        config.headers.Authorization = `Bearer ${session.accessToken}`
      }
    } catch (error) {
      console.error("Error getting session:", error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const currentPath = window.location.pathname;

    const isLoginCall = originalRequest.url?.includes("/auth/login");
    const isOnPublicRoute = PUBLIC_PATHS.some((path) =>
      currentPath.startsWith(path)
    );

    if (error.response?.status === 401 && !isLoginCall && !isOnPublicRoute) {
      console.warn("Session expired or unauthorized. Redirecting to login.");

      // Optionally clear any stored auth
      localStorage.removeItem("token"); // or reset Zustand store

      window.location.href = "/login";
    }

    if (error.response?.status >= 500) {
      console.error("Server error:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default api
