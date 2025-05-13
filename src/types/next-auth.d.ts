import "next-auth";
import { DefaultSession } from "next-auth";

// here we are overiding the interfaces from next-auth module
declare module "next-auth" {
  interface User {
    _id?: string;
    username: string;
    isVerified?: boolean;
    isAcceptingMessages: boolean;
  }

  interface Session {
    user: {
      _id?: string;
      username: string;
      isVerified?: boolean;
      isAcceptingMessages: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username: string;
    isVerified?: boolean;
    isAcceptingMessages: boolean;
  }
}
