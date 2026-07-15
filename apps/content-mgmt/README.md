# Content Management Service

Content aggregation, AI processing, and community features service for TCG Engines.

## Overview

This service handles:
- Content ingestion and validation (YouTube videos, etc.)
- AI summarization pipeline
- Ranking algorithm (Lobsters-style hotness)
- Creator management and profiles
- Community features (votes, comments, tags)

## Architecture

This service has its **own PostgreSQL database** and communicates with the Auth Service via JWT/JWKS for authentication.

```
┌─────────────────┐     ┌─────────────────┐
│  Auth Service   │────►│ Content Service │
│   (Port 3001)   │JWKS │   (Port 3002)   │
└────────┬────────┘     └────────┬────────┘
         │                       │
    ┌────▼────┐             ┌────▼────┐
    │ auth_db │             │content_db│
    └─────────┘             └──────────┘
```

## Quick Start

### Prerequisites

- Bun 1.2.18+
- PostgreSQL 16+
- Auth Service running on port 3001

### Development

```bash
# Install dependencies
bun install

# Copy environment file
cp .env.example .env

# Start PostgreSQL (if using Docker)
docker-compose up -d postgres-content

# Push database schema
bun run db:push

# Start development server
bun run dev
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `AUTH_SERVICE_URL` | Auth service URL for JWKS | `http://localhost:3001` |
| `PORT` | Server port | `3002` |
| `CORS_ORIGIN` | CORS origin | `*` |
| `NODE_ENV` | Environment | `development` |

## API Endpoints

### Health Check

```
GET /health
```

Returns service status and authentication info.

### API v1

```
GET  /v1/contents          # List contents (paginated)
GET  /v1/contents/:id      # Get single content
POST /v1/contents          # Submit new content (auth required)
GET  /v1/games             # List games
GET  /v1/creators          # List creators
GET  /v1/me                # Get current user (auth required)
```

## Authentication

This service uses JWT tokens issued by the Auth Service. Include the token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

The service verifies tokens using JWKS from `{AUTH_SERVICE_URL}/api/auth/jwks`.

## Database Schema

The service owns these tables:
- `games` - Supported games
- `creators` - Content creators
- `contents` - Video/article content
- `comments` - User comments
- `votes` - User votes
- `tags` - Content tags

**Note**: User references (`userId`) are stored as text, not foreign keys. User data is validated via JWT tokens.

## Scripts

```bash
bun run dev          # Start development server
bun run start        # Start production server
bun run check-types  # TypeScript type checking
bun run lint         # Run linter
bun run format       # Format code
bun run db:generate  # Generate migrations
bun run db:push      # Push schema to database
bun run db:studio    # Open Drizzle Studio
```
