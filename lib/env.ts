import type { SessionStrategy } from 'next-auth';
import { z } from 'zod';

const env = {
  databaseUrl: `${process.env.DATABASE_URL}`,
  appUrl: `${process.env.APP_URL || process.env.NEXTAUTH_URL}`,
  redirectIfAuthenticated: process.env.REDIRECT_IF_AUTHENTICATED || '/dashboard',
  securityHeadersEnabled: process.env.SECURITY_HEADERS_ENABLED === 'true',
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM,
  },
  nextAuth: {
    secret: process.env.NEXTAUTH_SECRET,
    sessionStrategy: (process.env.NEXTAUTH_SESSION_STRATEGY || 'jwt') as SessionStrategy,
  },
  authProviders: process.env.AUTH_PROVIDERS || 'email,credentials',
  confirmEmail: process.env.CONFIRM_EMAIL === 'true',
  github: {
    clientId: process.env.GITHUB_ID || '',
    clientSecret: process.env.GITHUB_SECRET || '',
  },
  google: {
    clientId: process.env.GOOGLE_ID || '',
    clientSecret: process.env.GOOGLE_SECRET || '',
  },
  teamFeatures: {
    enabled: process.env.TEAM_FEATURES_ENABLED !== 'false',
    inviteFlow: process.env.TEAM_INVITE_FLOW_ENABLED !== 'false',
    teamRole: process.env.TEAM_ROLE_ENABLED !== 'false',
    teamPermissions: process.env.TEAM_PERMISSIONS_ENABLED !== 'false',
  },
  passwordResetEnabled: process.env.PASSWORD_RESET_ENABLED !== 'false',
  emailChangeEnabled: process.env.EMAIL_CHANGE_ENABLED !== 'false',
  passwordChangeEnabled: process.env.PASSWORD_CHANGE_ENABLED !== 'false',
  debug: process.env.DEBUG === 'true',
  groupPrefix: process.env.GROUP_PREFIX,
  maxLoginAttempts: Number(process.env.MAX_LOGIN_ATTEMPTS) || 5,
  maxLoginAttemptsWindow: Number(process.env.MAX_LOGIN_ATTEMPTS_WINDOW) || 60 * 60 * 24,
};

/**
 * Environment variable validation schema
 * This ensures all required environment variables are present and correctly formatted
 */
const envSchema = z.object({
  // Application settings
  APP_URL: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(1),
  
  // Database settings
  DATABASE_URL: z.string().min(1),
  
  // Authentication settings
  AUTH_PROVIDERS: z.string().optional(),
  CONFIRM_EMAIL: z.enum(['true', 'false']).optional().default('false'),
  
  // Session strategy
  NEXTAUTH_SESSION_STRATEGY: z.enum(['jwt', 'database']).optional().default('database'),
});

/**
 * Validate environment variables
 * Throws an error if any required variables are missing or invalid
 */
export function validateEnv() {
  try {
    envSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables. Check server logs for more details.');
  }
}

/**
 * Get validated environment variables
 * Use this function to access environment variables in a type-safe way
 */
export function getEnv() {
  return envSchema.parse(process.env);
}

export default env;