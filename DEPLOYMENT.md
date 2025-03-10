# PropulsionSociety Live - Deployment Checklist

This document provides a comprehensive checklist to ensure smooth deployment of the PropulsionSociety Live platform. Following these steps will help you avoid common issues that can occur during deployment.

## Environment Variables

- [ ] Copy `.env.example` to `.env` and fill in all required values
- [ ] Ensure `DATABASE_URL` includes connection pooling parameters:
  ```
  DATABASE_URL=postgresql://username:password@hostname/database?sslmode=require&pgbouncer=true&connection_limit=10&pool_timeout=20
  ```
- [ ] Set `NEXTAUTH_URL` to your production domain (with https://)
- [ ] Generate a strong `NEXTAUTH_SECRET` (run `openssl rand -base64 32`)
- [ ] Configure OAuth providers (GitHub, Google) with correct callback URLs
- [ ] Set up email provider credentials for authentication emails

## Database Setup

- [ ] Run `npx prisma db push` to ensure your database schema is up to date
- [ ] Verify database connection works from your deployment environment
- [ ] Consider setting up database backups for production

## Image Configuration

- [ ] Update `next.config.js` if you need to allow images from additional domains
- [ ] Ensure your deployment platform can access the image domains specified

## Authentication

- [ ] Test login with all configured providers (credentials, OAuth)
- [ ] Verify email verification flow if enabled
- [ ] Test password reset functionality if enabled

## API Routes

- [ ] Ensure all API routes are working correctly in production
- [ ] Check for any hardcoded URLs that might need to be updated
- [ ] Verify CORS settings if your API will be accessed from other domains

## Performance Optimization

- [ ] Run `npm run build` locally to check for any build errors
- [ ] Review and optimize large dependencies
- [ ] Consider implementing caching strategies for frequently accessed data

## Security Checks

- [ ] Verify security headers are properly configured
- [ ] Ensure sensitive environment variables are properly protected
- [ ] Check for any exposed API keys or secrets in the codebase

## Common Deployment Issues and Solutions

### Database Connection Issues

**Problem**: Connection errors or timeouts when connecting to the database.

**Solution**:
- Ensure your database connection string is correct
- Add connection pooling parameters to prevent connection exhaustion
- Check if your deployment platform requires specific network configuration

### Authentication Failures

**Problem**: Users unable to log in or sessions expiring too quickly.

**Solution**:
- Verify `NEXTAUTH_URL` matches your production domain
- Ensure `NEXTAUTH_SECRET` is set correctly
- Check that OAuth callback URLs are configured correctly in provider dashboards

### Image Loading Failures

**Problem**: Images not loading in production.

**Solution**:
- Update `next.config.js` to include all required image domains
- Ensure image URLs are using the correct protocol (https)

### API Route Errors

**Problem**: API routes returning 500 errors in production.

**Solution**:
- Check server logs for detailed error messages
- Verify environment variables required by API routes are set
- Ensure database queries are optimized for production

### Build Failures

**Problem**: Next.js build failing during deployment.

**Solution**:
- Run `npm run build` locally to identify issues
- Check for TypeScript errors or missing dependencies
- Ensure all required environment variables are available during build

## Deployment Platforms

### Vercel

- [ ] Connect your GitHub repository
- [ ] Configure environment variables in the Vercel dashboard
- [ ] Set up preview deployments for pull requests
- [ ] Configure custom domain and SSL

### Railway

- [ ] Set up PostgreSQL database service
- [ ] Configure environment variables
- [ ] Set up automatic deployments from GitHub
- [ ] Configure custom domain

### AWS

- [ ] Set up RDS for PostgreSQL database
- [ ] Configure Elastic Beanstalk or ECS for application hosting
- [ ] Set up environment variables through AWS Parameter Store
- [ ] Configure load balancing and auto-scaling

## Post-Deployment Verification

- [ ] Test user registration and login
- [ ] Verify messaging functionality
- [ ] Test post creation and sharing
- [ ] Check group creation and management
- [ ] Verify all images and assets are loading correctly
- [ ] Test application on mobile devices

By following this checklist, you can avoid most common deployment issues and ensure a smooth launch of your PropulsionSociety Live instance. 