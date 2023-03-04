import NextAuth, { type Session, type NextAuthOptions } from "next-auth";

import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

interface ExtendedSession extends Session {
  user: {
    id: string;
    admin: boolean;
  };
}

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    newUser: "/auth/login",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        const extendedSession = {
          ...session,
          user: {
            ...session.user,
            id: user.id,
            admin: user.admin,
          },
        } as ExtendedSession;
        return extendedSession;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID,
      clientSecret: env.GOOGLE_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
