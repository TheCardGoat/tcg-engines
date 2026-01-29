# Auth Service

Authentication and user management service for the TCG platform.

## Overview

The Auth Service handles:
- User authentication (email/password, Discord OAuth)
- Session management
- User profile management
- Creator subscriptions
- Digest preferences

## Technology Stack

- **Runtime**: Bun 1.3.3+
- **Framework**: Elysia.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Better Auth

## Quick Start

### Prerequisites

- Bun 1.3.3+
- PostgreSQL 16+

### Development Setup

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

2. Start the database (using Docker):
   ```bash
   docker-compose up -d postgres-auth
   ```

3. Push database schema:
   ```bash
   bun run db:push
   ```

4. Start the development server:
   ```bash
   bun run dev
   ```

The service will be available at `http://localhost:3001`.

### Using Docker Compose

Start the entire stack:
```bash
docker-compose up -d
```

## API Endpoints

### Health Check

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Service health check |

### Authentication (Better Auth)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/sign-up` | Register new user |
| POST | `/api/auth/sign-in/email` | Login with email/password |
| POST | `/api/auth/sign-out` | Logout |
| GET | `/api/auth/session` | Get current session |
| GET | `/api/auth/callback/discord` | Discord OAuth callback |

### User Management

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/v1/users/me` | Get current user profile | Required |
| PUT | `/v1/users/me` | Update user profile | Required |
| GET | `/v1/users/me/subscriptions` | Get creator subscriptions | Required |
| GET | `/v1/users/me/digest` | Get digest preferences | Required |
| PUT | `/v1/users/me/digest` | Update digest preferences | Required |

## Database Schema

The auth service owns the following tables:

- `users` - User profiles
- `sessions` - Active sessions
- `accounts` - OAuth provider accounts
- `verifications` - Email verification tokens
- `user_subscriptions` - Creator follows
- `digest_preferences` - Email digest settings
- `digest_history` - Sent digest records

## Scripts

```bash
# Development
bun run dev          # Start with hot reload

# Production
bun run start        # Start production server

# Database
bun run db:generate  # Generate migrations
bun run db:push      # Push schema to database
bun run db:studio    # Open Drizzle Studio
bun run db:migrate   # Run migrations

# Code Quality
bun run typecheck    # TypeScript type checking
bun run lint         # Run linter
bun run format       # Format code
bun run test         # Run tests
```

## Environment Variables

See `.env.example` for all available configuration options.

Key variables:
- `AUTH_DATABASE_URL` - PostgreSQL connection string
- `AUTH_SECRET` - Session encryption secret (min 32 chars)
- `AUTH_DISCORD_CLIENT_ID` - Discord OAuth client ID
- `AUTH_DISCORD_CLIENT_SECRET` - Discord OAuth client secret
- `AUTH_PORT` - Server port (default: 3001)

## Architecture

```
src/
├── app.ts              # Main Elysia app factory
├── index.ts            # Server entry point
├── config/
│   └── env.ts          # Environment configuration
├── db/
│   ├── client.ts       # Database connection
│   └── schema/         # Drizzle schema definitions
├── plugins/
│   ├── auth.ts         # Better Auth integration
│   ├── database.ts     # Database plugin
│   └── rate-limit.ts   # Rate limiting
├── routes/
│   └── users.ts        # User endpoints
└── services/
    ├── users.ts        # User operations
    └── subscriptions.ts # Subscription operations
```

## Inter-Service Communication

The Auth Service is designed to work with the Content Service:

1. **JWT Validation**: Content Service validates JWT tokens using the Auth Service's public key
2. **HTTP Fallback**: For sensitive operations, Content Service can call Auth Service directly
3. **User References**: Content Service stores `userId` references (not foreign keys)

## License

Private - The Card Goat
