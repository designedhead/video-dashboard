import NextAuth, { type NextAuthOptions } from "next-auth";
import type { ExtendedSession, ExtendedUser } from "src/types/auth.js";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    newUser: "/auth/login",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        const extendedUser = { ...user } as ExtendedUser;
        const extendedSession = {
          ...session,
          user: {
            ...session.user,
            id: extendedUser.id,

            admin: extendedUser.admin || false,
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
