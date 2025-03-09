import type { SessionStrategy } from 'next-auth';

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

export default env;