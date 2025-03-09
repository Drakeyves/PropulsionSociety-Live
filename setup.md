# PropulsionSocietyLive Setup Guide

This document provides step-by-step instructions for setting up the PropulsionSocietyLive project, a Next.js SaaS starter kit with authentication, team management, and user management features.

## Prerequisites

- Node.js 16+ installed
- Docker Desktop installed (for PostgreSQL database)
- Git (for cloning the repository)

## Setup Steps

### 1. Environment Variables

The project requires several environment variables to be set up in the `.env` file. A template is provided in `.env.example`.

Key environment variables:
- `NEXTAUTH_SECRET`: A random string for NextAuth.js security
- `DATABASE_URL`: PostgreSQL connection string
- SMTP settings (for email functionality)
- OAuth credentials (for social login)

To generate a secure `NEXTAUTH_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Database Setup

The project uses PostgreSQL, which can be run using Docker:

1. Start Docker Desktop
2. Run the PostgreSQL container:
   ```bash
   cd PropulsionSocietyLive
   docker-compose up -d
   ```

3. Push the Prisma schema to the database:
   ```bash
   npm run db:push
   ```

4. (Optional) To explore the database using Prisma Studio:
   ```bash
   npm run db:studio
   ```

### 3. Install Dependencies

Install all required dependencies:

```bash
cd PropulsionSocietyLive
npm install
```

### 4. Start Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:
- Ensure Docker Desktop is running
- Check if the PostgreSQL container is running: `docker ps`
- Verify the `DATABASE_URL` in your `.env` file matches the configuration in `docker-compose.yml`

### Authentication Provider Issues

For social login (GitHub, Google):
- Ensure you have set up the OAuth applications and added the correct credentials to your `.env` file
- For development, set the callback URL to `http://localhost:3000/api/auth/callback/{provider}`

## Project Structure

- `/prisma`: Database schema and migrations
- `/lib`: Utility functions and configuration
- `/pages`: Next.js pages and API routes
- `/components`: React components
- `/public`: Static assets

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) 