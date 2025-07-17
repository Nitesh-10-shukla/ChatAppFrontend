import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { PUBLIC_PATHS } from "./constant"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(date: Date | string) {
  const messageDate = new Date(date)
  const now = new Date()
  const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return messageDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } else if (diffInHours < 48) {
    return "Yesterday"
  } else {
    return messageDate.toLocaleDateString()
  }
}

export function isPublicRoute(path: string): boolean {
  return PUBLIC_PATHS.some((publicPath) => path.startsWith(publicPath));
}