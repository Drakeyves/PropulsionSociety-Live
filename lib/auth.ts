import bcrypt from 'bcryptjs';
import env from './env';

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