# SaaS Starter Kit (Streamlined)

A simplified and streamlined version of the SaaS Starter Kit, focusing on core functionality without the extra features.

## Features

- 🔐 Authentication with NextAuth.js
  - Email/Password
  - Magic Link
  - Social Login (GitHub, Google)
- 👥 Team Management
  - Create and manage teams
  - Invite team members
  - Role-based permissions
- 🔄 User Management
  - User profiles
  - Password reset
  - Email verification
- 🛠️ Built with modern technologies
  - Next.js
  - Tailwind CSS
  - Prisma ORM
  - PostgreSQL

## Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Copy the example environment file
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables in `.env`
5. Run database migrations
   ```bash
   npx prisma migrate dev
   ```
6. Start the development server
   ```bash
   npm run dev
   ```

## Environment Variables

Key environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: URL of your application
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `SMTP_*`: SMTP settings for email
- `GITHUB_ID` and `GITHUB_SECRET`: GitHub OAuth credentials (optional)
- `GOOGLE_ID` and `GOOGLE_SECRET`: Google OAuth credentials (optional)

## License

MIT