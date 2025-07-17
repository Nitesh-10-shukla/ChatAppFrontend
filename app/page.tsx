"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center mb-8">
        <MessageCircle className="h-16 w-16 text-primary mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Welcome to Chat App</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          A real-time chat application built with Next.js, Socket.io, and MongoDB
        </p>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => router.push("/login")} size="lg">
          Sign In
        </Button>
        <Button onClick={() => router.push("/register")} variant="outline" size="lg">
          Create Account
        </Button>
      </div>
    </div>
  )
}
