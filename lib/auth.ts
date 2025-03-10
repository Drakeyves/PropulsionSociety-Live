import bcrypt from 'bcryptjs';
import env from './env';
import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import prisma from './prisma';

// Extend the Session type to include user.id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

export const hashPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
};

export const isAuthProviderEnabled = (provider: string) => {
  const providers = env.authProviders?.split(',') || [];

  if (provider === 'credentials') {
    return providers.includes('credentials');
  }

  if (provider === 'email') {
    return providers.includes('email');
  }

  if (provider === 'github') {
    return (
      providers.includes('github') &&
      env.github.clientId &&
      env.github.clientSecret
    );
  }

  if (provider === 'google') {
    return (
      providers.includes('google') &&
      env.google.clientId &&
      env.google.clientSecret
    );
  }

  return false;
};

export const getEnabledAuthProviders = () => {
  const providers: string[] = [];

  if (isAuthProviderEnabled('credentials')) {
    providers.push('credentials');
  }

  if (isAuthProviderEnabled('email')) {
    providers.push('email');
  }

  if (isAuthProviderEnabled('github')) {
    providers.push('github');
  }

  if (isAuthProviderEnabled('google')) {
    providers.push('google');
  }

  return providers;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image
        };
      }
    }),
    GithubProvider({
      clientId: env.github.clientId || '',
      clientSecret: env.github.clientSecret || ''
    }),
    GoogleProvider({
      clientId: env.google.clientId || '',
      clientSecret: env.google.clientSecret || ''
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  session: {
    strategy: 'database',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    }
  }
};