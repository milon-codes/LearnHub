import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // ========================================
    // Credentials Login
    // ========================================
    Credentials({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        await connectDB();

        const user = await User.findOne({
          email: email.toLowerCase(),
        }).select("+password");

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    // ========================================
    // Google Login
    // ========================================
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // ========================================
    // Google User → MongoDB
    // ========================================
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connectDB();

          const email = user.email?.toLowerCase();

          if (!email) {
            return false;
          }

          // Check existing user
          let existingUser = await User.findOne({ email });

          // Create new user if not exists
          if (!existingUser) {
            existingUser = await User.create({
              name: user.name || "Google User",
              email,
              role: "student",
              avatar: user.image || "",
            });
          }

          // Store database user ID for JWT
          user.id = existingUser._id.toString();

          // Store role
          user.role = existingUser.role;

          return true;
        } catch (error) {
          console.error("Google Sign-In Error:", error);
          return false;
        }
      }

      return true;
    },

    // ========================================
    // JWT
    // ========================================
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }

      return token;
    },

    // ========================================
    // Session
    // ========================================
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.role = token.role;
      }

      return session;
    },
  },
});
