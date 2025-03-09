# PropulsionSociety Live

A Next.js SaaS platform with authentication, messaging, posting, and group creation features.

## Features

- 🔐 Authentication with NextAuth.js
  - Email/Password
  - Social Login (GitHub, Google)
- 💬 Messaging System
  - Real-time private messaging
  - Conversation management
  - Read receipts
- 📝 Posting System
  - Create and manage posts
  - Comments and reactions
  - File attachments
- 👥 Group Creation
  - Create and join groups
  - Public and private groups
  - Role-based permissions
- 🌐 Modern Landing Page
  - Responsive design
  - Conversion-focused sections
  - Interactive elements
- 🛠️ Built with modern technologies
  - Next.js 13+ (App Router)
  - Tailwind CSS
  - Prisma ORM
  - Neon Database (PostgreSQL)

## Getting Started

### Prerequisites

- Node.js 16+
- Neon Database account (or PostgreSQL)

### Database Setup

1. Create a [Neon](https://neon.tech) account
2. Create a new PostgreSQL database
3. Get your connection string from the Neon dashboard
4. Update the `DATABASE_URL` in your `.env` file with the connection string

Example connection string format:
```
postgresql://user:password@ep-cool-forest-123456.us-east-2.aws.neon.tech/propulsion-society?sslmode=require
```

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Update the environment variables in `.env`
   - Set up your Neon Database connection string
   - Configure authentication providers
4. Run database migrations
   ```bash
   npx prisma db push
   ```
5. Start the development server
   ```bash
   npm run dev
   ```

## Environment Variables

Key environment variables:

- `DATABASE_URL`: Neon Database connection string
- `NEXTAUTH_URL`: URL of your application
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `SMTP_*`: SMTP settings for email
- `GITHUB_ID` and `GITHUB_SECRET`: GitHub OAuth credentials
- `GOOGLE_ID` and `GOOGLE_SECRET`: Google OAuth credentials

## Project Structure

```
PropulsionSocietyLive/
├── app/                  # Next.js App Router
│   ├── api/              # API routes
│   │   ├── messages/     # Messaging API
│   │   ├── posts/        # Posting API
│   │   └── groups/       # Groups API
│   ├── (auth)/           # Authentication pages
│   ├── (dashboard)/      # Dashboard pages
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── layout/           # Layout components
│   ├── landing/          # Landing page components
│   └── ui/               # UI components
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication utilities
│   └── prisma.ts         # Prisma client
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## Development Roadmap

### Week 1
- ✅ Project setup with Next.js 13+ App Router
- ✅ Configure Neon database connection
- ✅ Extend Prisma schema with new models
- ✅ Set up authentication with NextAuth.js
- ✅ Create basic layout and navigation
- ✅ Implement landing page

### Week 2
- [ ] Implement authentication pages (login, register, forgot password)
- [ ] Create user profile pages
- [ ] Set up dashboard layout
- [ ] Implement basic messaging UI

### Week 3
- [ ] Complete messaging system
- [ ] Implement real-time features
- [ ] Create post creation and viewing UI
- [ ] Implement comments and reactions

### Week 4
- [ ] Implement group creation and management
- [ ] Create group discovery page
- [ ] Add file upload functionality
- [ ] Implement search functionality

## License

MIT