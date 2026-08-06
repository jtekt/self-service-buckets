import NextAuth, { type DefaultSession } from "next-auth";
import { type OIDCConfig } from "next-auth/providers";

declare module "next-auth" {
  interface Session {
    user: {
      preferredUsername: string;
    } & DefaultSession["user"];
  }
}

const OIDC = {
  id: "oidc",
  name: "OIDC",
  type: "oidc",
} satisfies OIDCConfig<Record<string, unknown>>;

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [OIDC],
  trustHost: true,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.preferredUsername = profile.preferred_username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.preferredUsername = token.preferredUsername as string;
      return session;
    },
  },
});
