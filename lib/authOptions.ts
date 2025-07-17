import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { serverApi } from "@/lib/axios";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          const { data } = await serverApi.post("/api/auth/login", {
            username: credentials.username,
            password: credentials.password,
          });
                     
          if (!data?.token || !data?.user) return null;

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.username,
            token: data.token,
          };
        } catch (error: any) {
            console.log("Login error:", error);
          throw new Error(error?.response?.data?.message || "Login failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
        token.name = user.name ?? undefined;
        token.accessToken = (user as any).token;
      }

      if (account?.provider === "google") {
        token.accessToken = account.access_token;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id ?? "";
      session.user.email = token.email ?? "";
      session.user.name = token.name ?? "";
      session.accessToken = token.accessToken;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET!,
};
