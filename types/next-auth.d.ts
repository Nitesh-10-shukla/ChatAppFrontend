import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
interface Session {
  user: {
    id: string;
    name?: string | null;
    email: string;
  } & DefaultSession["user"];
  accessToken?: string;
}

  interface User extends DefaultUser {
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    name?: string;
    email?: string;
    accessToken?: string;
  }
}
