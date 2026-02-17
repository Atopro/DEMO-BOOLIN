import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db, users } from "./db";
import { verifyPassword } from "./auth-helpers";
import { eq } from "drizzle-orm";

export const authOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.username, credentials.username as string))
            .limit(1);

          if (user.length === 0) {
            return null;
          }

          const isValid = await verifyPassword(
            credentials.password as string,
            user[0].password
          );

          if (!isValid) {
            return null;
          }

          return {
            id: user[0].id.toString(),
            username: user[0].username,
            role: user[0].role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt" as const,
  },
};

export default NextAuth(authOptions);

// Helper function to get session in server components
export async function getServerSession() {
  const { getServerSession } = await import("next-auth/next");
  return getServerSession(authOptions);
}
