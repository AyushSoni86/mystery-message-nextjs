import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { User } from "next-auth";

// Define interfaces for credentials
interface Credentials {
  identifier: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        // Cast credentials to our interface or return null if they don't exist
        const creds = credentials as Credentials | undefined;
        if (!creds) return null;
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [{ email: creds.identifier }, { username: creds.identifier }],
          });

          if (!user) {
            throw new Error(
              `No user found with this email: ${creds.identifier}`
            );
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account before login");
          }

          const isPasswordCorrect = await bcrypt.compare(
            creds.password,
            user.password
          );

          if (isPasswordCorrect) {
            // Convert Mongoose document to a plain object compatible with NextAuth User type
            const userObject = {
              _id: user._id,
              username: user.username,
              email: user.email,
              isVerified: user.isVerified,
              isAcceptingMessages: user.isAcceptingMessages,
            } as User;
            return userObject;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (error) {
          // More specific error handling without using "any"
          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unknown error occurred";
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
