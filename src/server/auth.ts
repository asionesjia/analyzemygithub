import NextAuth, { DefaultSession } from 'next-auth'
import GitHub from 'next-auth/providers/github'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from '~/server/db'
import { accounts, sessions, users, verificationTokens } from '~/server/db/schema'
import { envServer } from '~/env/server'
import 'next-auth/jwt'

declare module 'next-auth' {
  interface User {}

  interface Account {
    access_token: string
    token_type: string
    scope: string
    provider: string
    providerAccountId: string
  }

  interface Session {
    user: {
      githubAccessToken?: string
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    githubAccessToken?: string
  }
}

/**
 * Returned by `useSession`, `auth`, contains information about the active session.
 */

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: envServer.AUTH_GITHUB_ID,
      clientSecret: envServer.AUTH_GITHUB_SECRET,
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  secret: envServer.AUTH_JWT_SECRET,
  session: { strategy: 'jwt' },
  debug: envServer.NODE_ENV === 'development',
  callbacks: {
    session: async ({ session, token, user }) => {
      console.log('session', session, 'token', token)
      session.user.githubAccessToken = token?.githubAccessToken
      return {
        ...session,
      }
    },
    jwt: async ({ token, account, user }) => {
      if (account) {
        return {
          ...token,
          githubAccessToken: account?.access_token,
        }
      }
      return token
    },
  },
})
