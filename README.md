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
- 🖼️ Optimized Image Handling
  - Custom OptimizedImage component
  - Loading states and fallbacks
  - Support for multiple image formats
  - Enhanced error handling
- 🧪 Testing Infrastructure
  - Jest and React Testing Library
  - Component and utility tests
  - CI/CD with GitHub Actions
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
postgresql://username:password@hostname/database?sslmode=require
```

### Installation

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update with your credentials:
   ```bash
   cp .env.example .env
   ```
4. Update the environment variables in `.env`
   - Set up your Neon Database connection string
   - Configure authentication providers
   - Add SMTP settings for email functionality
5. Run database migrations
   ```bash
   npx prisma db push
   ```
6. Start the development server
   ```bash
   npm run dev
   ```

### Testing

Run tests with:
```bash
npm test
```

Run tests in watch mode during development:
```bash
npm run test:watch
```

Generate test coverage report:
```bash
npm run test:coverage
```

## Environment Variables

Key environment variables (see `.env.example` for detailed descriptions):

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
│       └── OptimizedImage.tsx  # Custom image component
├── lib/                  # Utility functions
│   ├── auth.ts           # Authentication utilities
│   └── prisma.ts         # Prisma client
├── prisma/               # Prisma schema and migrations
│   └── schema.prisma     # Database schema
├── public/               # Static assets
│   └── images/           # Image assets and placeholders
├── __tests__/            # Test files
│   └── components/       # Component tests
├── .github/              # GitHub configuration
│   └── workflows/        # GitHub Actions workflows
└── jest.config.js        # Jest configuration
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
- ✅ Implement authentication pages (login, register, forgot password)
- ✅ Create OptimizedImage component for better image handling
- ✅ Update landing page components with optimized images
- ✅ Implement consistent UI/UX with Tailwind
- ✅ Set up testing infrastructure with Jest
- ✅ Configure CI/CD with GitHub Actions
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

## Image Optimization

The project uses a custom `OptimizedImage` component that enhances the standard Next.js Image component with:

- Loading states to improve user experience
- Fallback images when the primary image fails to load
- Support for multiple image formats
- Enhanced error handling
- Consistent styling across the application

All landing page components have been updated to use this component:
- HeroSection
- SuccessStoriesSection
- FeaturesSection
- AccessSection
- Navbar
- SkillsSection

## Testing Strategy

The project uses Jest and React Testing Library for testing:

- **Unit Tests**: For utility functions and isolated logic
- **Component Tests**: For UI components with complex behavior
- **Integration Tests**: For key user flows and API routes

Tests are automatically run on pull requests and pushes to main via GitHub Actions.

## Contributing

When contributing to this project, please follow these guidelines:

1. Use the "use client" directive for components that use React hooks
2. Follow the established project structure
3. Write clean, minimal, and robust code
4. Add detailed comments for complex logic
5. Write tests for new functionality
6. Run tests before submitting pull requests

## License

MIT