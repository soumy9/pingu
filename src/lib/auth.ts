import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "./db";

import GoogleProvider from "next-auth/providers/google";

function getGoolgeCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
	//console.log({clientId,clientSecret});
	
  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }
  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: getGoolgeCredentials().clientId,
      clientSecret: getGoolgeCredentials().clientSecret,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
			console.log({ token, user });
      const dbUser = (await db.get(`user:${token.id}`)) as User | null;
			console.log({dbUser});

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
          image: token.picture,
        };
      }
      return session;
    },
    redirect() {
      return "/dashboard";
    },
  },
};
