import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/shop/login",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.shopUser.findUnique({
          where: { email: credentials.email as string },
          include: { shop: true },
        });

        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password_hash
        );

        if (!passwordMatch) return null;

        // Update last login
        await prisma.shopUser.update({
          where: { id: user.id },
          data: { last_login_at: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          shopId: user.shop_id,
          shopSlug: user.shop.slug,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.role = (user as any).role;
        token.shopId = (user as any).shopId;
        token.shopSlug = (user as any).shopSlug;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        (session.user as any).role = token.role;
        (session.user as any).shopId = token.shopId;
        (session.user as any).shopSlug = token.shopSlug;
      }
      return session;
    },
  },
});
