WatchSync Backend - Microservices Architecture Plan

This document provides complete technical specifications for tcg/content-management-service as a microservices architecture. It covers the split into two independent services: Auth Service and Content Management Service, with detailed specifications for each.

---
EXECUTIVE SUMMARY FOR TECHNICAL BOARD

KEY DECISION POINTS:

1. ARCHITECTURE SPLIT
   ├─ Service 1: Auth Service (User identity, authentication, profiles)
   ├─ Service 2: Content Service (Content aggregation, AI processing, community)
   └─ Communication: JWT validation + HTTP fallback

2. TECHNOLOGY STACK
   ├─ Runtime: Bun 1.2.18+
   ├─ Framework: Elysia.js (both services)
   ├─ Database: PostgreSQL (separate instances/schemas)
   ├─ ORM: Drizzle ORM
   └─ Deployment: Docker Compose (dev), docker (prod)

6. EXPECTED BENEFITS
   ✓ Independent scaling (auth vs content)
   ✓ Faster deployment cycles
   ✓ Improved fault isolation
   ✓ Better resource utilization
   ✓ Clearer team ownership
   ✓ Foundation for future services

7. CRITICAL SUCCESS FACTORS
   ✓ JWT-based authentication (reduces latency)
   ✓ Eventual consistency model (simplifies implementation)
   ✓ Distributed tracing (visibility into system)
   ✓ Comprehensive monitoring (visibility into system)
   ✓ Clear communication protocol (reduces bugs)
   ✓ Automated testing (ensures quality)

---
1. OVERVIEW

WatchSync is a multi-game content intelligence platform that:
- Aggregates YouTube video content from gaming creators
- Extracts transcripts using Supadata API
- Generates AI summaries using Zhipu/Anthropic models
- Provides search, filtering, and ranking capabilities
- Uses a time-gravity ranking algorithm (Lobsters-style) to surface relevant content

---
2. MICROSERVICES ARCHITECTURE

2.1 Service Decomposition Strategy

The monolithic tcg/content-management-service backend will be split into two independent services with clear responsibility boundaries:

┌─────────────────────────────────────────────────────────────────────────────┐
│                          MICROSERVICES TOPOLOGY                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      Frontend / Client Layer                         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                        │
│                    ┌───────────────┴───────────────┐                       │
│                    │                               │                       │
│         ┌──────────▼──────────┐        ┌──────────▼──────────┐            │
│         │   AUTH SERVICE      │        │  CONTENT SERVICE    │            │
│         │   Port: 3001        │        │  Port: 3002         │            │
│         │                     │        │                     │            │
│         │ • User Management   │        │ • Content Mgmt      │            │
│         │ • Authentication    │        │ • AI Processing     │            │
│         │ • Sessions          │        │ • Community         │            │
│         │ • Profiles          │        │ • Rankings          │            │
│         │ • Subscriptions     │        │ • Creators          │            │
│         └──────────┬──────────┘        └──────────┬──────────┘            │
│                    │                               │                       │
│         ┌──────────▼──────────┐        ┌──────────▼──────────┐            │
│         │  PostgreSQL (Auth)  │        │ PostgreSQL (Content)│            │
│         │  Schema: auth       │        │ Schema: content     │            │
│         └─────────────────────┘        └─────────────────────┘            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

2.2 Service Responsibilities

SERVICE 1: AUTH SERVICE (User Profile & Authentication)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary Responsibility: User identity, authentication, profiles, and subscriptions

Database Tables (Owned):
├── users
├── sessions
├── accounts
├── verifications
├── user_subscriptions
├── digest_preferences
└── digest_history

API Endpoints:
├── POST   /v1/auth/register
├── POST   /v1/auth/login
├── POST   /v1/auth/logout
├── POST   /v1/auth/refresh
├── GET    /v1/auth/me
├── PUT    /v1/auth/me
├── POST   /v1/auth/discord/callback
├── PUT    /v1/users/me/digest
├── GET    /v1/users/me/subscriptions
└── GET    /health

Key Responsibilities:
✓ Better Auth integration (Discord Only)
✓ Session management and token generation
✓ User profile management and updates
✓ Subscription tier tracking and validation
✓ Digest preferences management
✓ User deletion and data cleanup

Technology Stack:
- Runtime: Bun
- Framework: Elysia.js
- Database: PostgreSQL (dedicated auth schema)
- Auth: Better Auth
- ORM: Drizzle ORM



SERVICE 2: CONTENT MANAGEMENT SERVICE (Content & Community)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Primary Responsibility: Content aggregation, AI processing, community features

Database Tables (Owned):
├── games
├── creators
├── contents
├── extraction_cache
├── preprocessing_cache
├── processing_cache
├── content_summaries
├── tags
├── content_tags
├── comments
├── votes
├── creator_games
└── creator_socials

API Endpoints:
├── GET    /v1/contents
├── GET    /v1/contents/:id
├── POST   /v1/contents
├── GET    /v1/contents/:id/status
├── GET    /v1/contents/:id/summary
├── POST   /v1/contents/:id/vote
├── DELETE /v1/contents/:id/vote
├── GET    /v1/contents/:id/comments
├── POST   /v1/contents/:id/comments
├── GET    /v1/games
├── GET    /v1/games/:slug
├── GET    /v1/creators
├── GET    /v1/creators/:channelId
├── GET    /v1/creators/:channelId/videos
├── POST   /v1/creators/:channelId/follow
├── DELETE /v1/creators/:channelId/follow
├── GET    /v1/youtube/preview
├── POST   /v1/admin/creators/:creatorId/import
└── GET    /health

Key Responsibilities:
✓ Content ingestion and validation
✓ AI summarization pipeline (9 parallel summaries)
✓ Youtube video transcript extraction via Supadata API
✓ Content Extraction via Supadata API, Tabstack API, and HTTP requests.
✓ Ranking algorithm (Lobsters-style hotness)
✓ Creator management and profiles
✓ Community features (votes, comments, tags)
✓ Tag system and content classification
✓ Admin operations and bulk imports
✓ Processing (extraction, pre-processing, processing, post-processing) cache management

Technology Stack:
- Runtime: Bun
- Framework: Elysia.js
- Database: PostgreSQL (dedicated content schema)
- ORM: Drizzle ORM
- AI Providers: Zhipu AI, Anthropic Claude
- External APIs: Supadata (transcripts)


---
2.3 TECHNOLOGY STACK (Shared)

┌─────────────────┬───────────────────────────────────────────────┐
│    Component    │                  Technology                   │
├─────────────────┼───────────────────────────────────────────────┤
│ Runtime         │ Bun 1.2.18+                                   │
├─────────────────┼───────────────────────────────────────────────┤
│ Framework       │ Elysia.js                                     │
├─────────────────┼───────────────────────────────────────────────┤
│ Database        │ PostgreSQL 16+ (separate instances/schemas)   │
├─────────────────┼───────────────────────────────────────────────┤
│ ORM             │ Drizzle ORM                                   │
├─────────────────┼───────────────────────────────────────────────┤
│ Authentication  │ Better Auth (Discord) │
├─────────────────┼───────────────────────────────────────────────┤
│ AI Providers    │ Zhipu AI (GLM models)                         │
├─────────────────┼───────────────────────────────────────────────┤
│ Transcript API  │ Supadata                                      │
├─────────────────┼───────────────────────────────────────────────┤
│ Package Manager │ Bun                                           │
├─────────────────┼───────────────────────────────────────────────┤
│ Monorepo        │ Turborepo                                     │
├─────────────────┼───────────────────────────────────────────────┤
│ Containerization│ Docker                                        │
├─────────────────┼───────────────────────────────────────────────┤
│ Deplyment       │ Railway, using docker                         │
└─────────────────┴───────────────────────────────────────────────┘
---
3. DATABASE SCHEMA SEPARATION

3.1 Schema Organization

The monolithic database will be split into two independent PostgreSQL schemas:

AUTH SERVICE DATABASE (@tcg/auth-service)
├── Schema: auth
│   ├── users
│   ├── sessions
│   ├── accounts
│   ├── verifications
│   ├── user_subscriptions
│   ├── digest_preferences
│   └── digest_history
└── Indexes: Optimized for user lookups and session validation

CONTENT SERVICE DATABASE (@tcg/content-management-service)
├── Schema: content
│   ├── games
│   ├── creators
│   ├── contents
│   ├── extraction_cache
│   ├── preprocessing_cache
│   ├── processing_cache
│   ├── postprocessing_cache
│   ├── content_summaries
│   ├── tags
│   ├── content_tags
│   ├── comments
│   ├── votes
│   ├── creator_games
│   └── creator_socials
└── Indexes: Optimized for content queries, rankings, and searches

3.2 Foreign Key Strategy

AUTH SERVICE:
- No external foreign keys (self-contained)
- user_subscriptions.userId → users.id (internal)
- digest_preferences.userId → users.id (internal)
- digest_history.userId → users.id (internal)

CONTENT SERVICE:
- contents.userId → (reference to Auth Service user ID)
- comments.userId → (reference to Auth Service user ID)
- votes.userId → (reference to Auth Service user ID)
- creators.ownerUserId → (reference to Auth Service user ID)
- All other FKs are internal to content schema

NOTE: User ID references are NOT database foreign keys. They are validated via inter-service communication.

3.3 Data Consistency Model

STRONG CONSISTENCY (within service):
- All operations within a single service use ACID transactions
- Database constraints enforced at schema level

EVENTUAL CONSISTENCY (across services):
- User deletion: Content Service eventually removes user references
- Subscription changes: Content Service validates on each request
- User profile updates: Content Service caches user info with TTL

---
4. INTER-SERVICE COMMUNICATION

4.1 Communication Patterns

Pattern 1: JWT Token Validation (Recommended - High Performance)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Auth Service generates JWT tokens containing:
{
  "userId": "user_123",
  "email": "user@example.com",
  "subscriptionTier": "premium",
  "emailVerified": true,
  "iat": 1234567890,
  "exp": 1234654290
}

Content Service validates JWT directly using Auth Service's public key:
- No network call required
- Stateless validation
- Reduced latency
- Recommended for high-traffic endpoints

Implementation:
```typescript
// Content Service
const publicKey = await fetchPublicKey('http://auth-service:3001/public-key');
const decoded = jwt.verify(token, publicKey);
const userId = decoded.userId;
```

Pattern 2: HTTP/REST Verification (Fallback - Flexible)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Content Service calls Auth Service to verify token:
- Network call required
- Stateful validation
- Higher latency
- Use for sensitive operations (admin actions, user deletion)

Implementation:
```typescript
// Content Service
const response = await fetch('http://auth-service:3001/v1/auth/verify', {
  headers: { Authorization: `Bearer ${token}` }
});
const user = await response.json();
```

4.2 Recommended Communication Strategy

PRIMARY: JWT Token Validation
- Use for all read operations
- Use for most write operations
- Stateless, high performance

SECONDARY: HTTP Verification
- Use for admin operations
- Use for sensitive user data access
- Use for subscription validation

TERTIARY: Event-Driven (Future)
- Use for eventual consistency
- Use for cache invalidation
- Use for audit logging

---
5. SHARED CONCERNS & SOLUTIONS

5.1 User ID Reference Management

Challenge: Content Service stores userId but doesn't own user data

Solution:
1. Content Service validates userId exists via JWT or HTTP call
2. Content Service caches user info with 1-hour TTL
3. On user deletion, Auth Service publishes event
4. Content Service receives event and marks user data as deleted (soft delete)

Implementation:
```typescript
// Content Service - User validation
async function validateUserExists(userId: string): Promise<boolean> {
  const cached = await cache.get(`user:${userId}`);
  if (cached) return true;
  
  const response = await fetch(`http://auth-service:3001/v1/auth/users/${userId}`);
  if (response.ok) {
    await cache.set(`user:${userId}`, true, { ttl: 3600 });
    return true;
  }
  return false;
}
```

5.2 Authentication Token Strategy

Challenge: Both services need to validate user identity

Solution: JWT-based authentication
- Auth Service issues JWT tokens
- Content Service validates JWT using public key
- Token includes subscription tier for authorization

Token Structure:
```json
{
  "sub": "user_123",
  "email": "user@example.com",
  "subscriptionTier": "premium",
  "emailVerified": true,
  "iat": 1704067200,
  "exp": 1704153600,
  "iss": "watchsync-auth"
}
```

5.3 Subscription Tier Validation

Challenge: Content Service needs to enforce subscription limits

Solution: Include subscription tier in JWT token
- Auth Service includes tier in token
- Content Service reads tier from token
- Content Service enforces limits based on tier

Subscription Tiers:
- free: 5 content submissions/hour, basic features
- premium: 50 content submissions/hour, all features
- admin: unlimited, admin operations

---
6. DEPLOYMENT ARCHITECTURE

6.1 Development Environment (Docker Compose)

```yaml
version: '3.8'

services:
  # Auth Service
  auth-service:
    build:
      context: .
      dockerfile: apps/auth-service/Dockerfile
    ports:
      - "3001:3001"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres-auth:5432/watchsync_auth
      - AUTH_SECRET=${AUTH_SECRET}
      - DISCORD_CLIENT_ID=${DISCORD_CLIENT_ID}
      - DISCORD_CLIENT_SECRET=${DISCORD_CLIENT_SECRET}
      - GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
      - GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
      - NODE_ENV=development
    depends_on:
      - postgres-auth
    networks:
      - watchsync

  # Content Service
  content-service:
    build:
      context: .
      dockerfile: apps/content-service/Dockerfile
    ports:
      - "3002:3002"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres-content:5432/watchsync_content
      - AUTH_SERVICE_URL=http://auth-service:3001
      - ZHIPU_API_KEY=${ZHIPU_API_KEY}
      - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
      - SUPADATA_API_KEY=${SUPADATA_API_KEY}
      - NODE_ENV=development
    depends_on:
      - postgres-content
      - auth-service
    networks:
      - watchsync

  # Auth Database
  postgres-auth:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=watchsync_auth
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-auth-data:/var/lib/postgresql/data
    networks:
      - watchsync

  # Content Database
  postgres-content:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=watchsync_content
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres-content-data:/var/lib/postgresql/data
    networks:
      - watchsync

volumes:
  postgres-auth-data:
  postgres-content-data:

networks:
  watchsync:
    driver: bridge
```

6.2 Production Environment (Kubernetes)

```yaml
# Auth Service Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
    spec:
      containers:
      - name: auth-service
        image: watchsync/auth-service:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: auth-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"

---
# Content Service Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: content-service
spec:
  replicas: 5
  selector:
    matchLabels:
      app: content-service
  template:
    metadata:
      labels:
        app: content-service
    spec:
      containers:
      - name: content-service
        image: watchsync/content-service:latest
        ports:
        - containerPort: 3002
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: content-secrets
              key: database-url
        - name: AUTH_SERVICE_URL
          value: "http://auth-service:3001"
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

6.3 Scaling Considerations

AUTH SERVICE:
- Stateless design enables horizontal scaling
- Recommended: 3-5 replicas in production
- Database: Single PostgreSQL instance (can be replicated)
- Bottleneck: Database connections (max 100 per service)

CONTENT SERVICE:
- Stateless design enables horizontal scaling
- Recommended: 5-10 replicas in production
- Database: Single PostgreSQL instance (can be replicated)
- Bottleneck: AI API rate limits, Supadata API limits
- Can scale independently based on content processing load

---
8. RISK ANALYSIS & MITIGATION

Risk Matrix:
┌──────────────────────────────────────────────────────────────────────────┐
│ Risk                    │ Severity │ Probability │ Mitigation             │
├──────────────────────────────────────────────────────────────────────────┤
│ Network latency         │ Medium   │ High        │ JWT validation         │
│ Data consistency        │ High     │ Medium      │ Eventual consistency   │
│ Distributed transactions│ High     │ Medium      │ Saga pattern           │
│ Debugging complexity    │ Medium   │ High        │ Distributed tracing    │
│ Operational overhead    │ Medium   │ Medium      │ Docker/K8s automation  │
│ Service discovery       │ Medium   │ Low         │ DNS/Consul             │
│ Database connection pool│ High     │ Low         │ Connection pooling     │
│ API versioning          │ Medium   │ Medium      │ Semantic versioning    │
└──────────────────────────────────────────────────────────────────────────┘

Detailed Mitigations:

1. NETWORK LATENCY
   Problem: Inter-service calls add latency
   Solution: Use JWT validation instead of HTTP calls
   Impact: 90% reduction in inter-service calls
   Fallback: HTTP verification for sensitive operations

2. DATA CONSISTENCY
   Problem: User data might be inconsistent across services
   Solution: Implement eventual consistency model
   - Auth Service is source of truth for user data
   - Content Service caches with TTL
   - Event-driven updates for critical changes
   Impact: Acceptable for this use case

3. DEBUGGING COMPLEXITY
   Problem: Harder to trace issues across services
   Solution: Implement distributed tracing
   - OpenTelemetry integration
   - Correlation IDs in all requests
   - Centralized logging (ELK stack)
   Impact: Visibility into system behavior

4. OPERATIONAL OVERHEAD
   Problem: More services to manage
   Solution: Containerization and orchestration
   - Docker for consistent environments
   - Infrastructure as Code (Terraform)
   Impact: Automated deployment and scaling

---
8. APPENDIX: ORIGINAL MONOLITHIC SCHEMA

The following sections contain the original monolithic schema for reference during migration.
They will be split between Auth Service and Content Service as described above.

 ---
13. ORIGINAL MONOLITHIC DATABASE SCHEMA (Drizzle ORM)

 import { pgEnum } from 'drizzle-orm/pg-core';

 export const sourceTypeEnum = pgEnum('source_type', ['youtube']);
 export const contentStatusEnum = pgEnum('content_status', ['pending', 'processing', 'completed', 'failed']);
 export const summaryTypeEnum = pgEnum('summary_type', ['general', 'insightful', 'funny', 'actionable', 'controversial']);
 export const extractionStatusEnum = pgEnum('extraction_status', ['pending', 'partial', 'complete', 'failed']);
 export const processingStatusEnum = pgEnum('processing_status', ['processing', 'completed', 'failed']);
 export const digestFrequencyEnum = pgEnum('digest_frequency', ['daily', 'weekly']);

 3.2 Games Table

 export const games = pgTable('games', {
   id: uuid().primaryKey().defaultRandom(),
   slug: text().notNull().unique(),
   name: text().notNull(),
   description: text(),
   isActive: boolean().default(true).notNull(),
   createdAt: timestamp().defaultNow().notNull(),
   updatedAt: timestamp().defaultNow().notNull(),
 }, (table) => [
   index('games_slug_idx').on(table.slug),
   index('games_is_active_idx').on(table.isActive),
 ]);

 3.3 Authentication Tables (Better Auth)

 export const users = pgTable('users', {
   id: text().primaryKey(),
   name: text().notNull(),
   email: text().notNull().unique(),
   emailVerified: boolean().default(false).notNull(),
   image: text(),
   createdAt: timestamp().defaultNow().notNull(),
   updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull(),
   username: text().unique(),
   displayUsername: text(),
   subscriptionTier: text().default('free').notNull(),
   subscriptionExpiresAt: timestamp(),
 });

 export const sessions = pgTable('sessions', {
   id: text().primaryKey(),
   expiresAt: timestamp().notNull(),
   token: text().notNull().unique(),
   createdAt: timestamp().defaultNow().notNull(),
   updatedAt: timestamp().$onUpdate(() => new Date()).notNull(),
   ipAddress: text(),
   userAgent: text(),
   userId: text().notNull().references(() => users.id, { onDelete: 'cascade' }),
 }, (table) => [
   index('sessions_userId_idx').on(table.userId),
 ]);

 export const accounts = pgTable('accounts', {
   id: text().primaryKey(),
   accountId: text().notNull(),
   providerId: text().notNull(),
   userId: text().notNull().references(() => users.id, { onDelete: 'cascade' }),
   accessToken: text(),
   refreshToken: text(),
   idToken: text(),
   accessTokenExpiresAt: timestamp(),
   refreshTokenExpiresAt: timestamp(),
   scope: text(),
   password: text(),
   createdAt: timestamp().defaultNow().notNull(),
   updatedAt: timestamp().$onUpdate(() => new Date()).notNull(),
 }, (table) => [
   index('accounts_userId_idx').on(table.userId),
 ]);

 export const verifications = pgTable('verifications', {
   id: text().primaryKey(),
   identifier: text().notNull(),
   value: text().notNull(),
   expiresAt: timestamp().notNull(),
   createdAt: timestamp().defaultNow().notNull(),
   updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()).notNull(),
 }, (table) => [
   index('verifications_identifier_idx').on(table.identifier),
 ]);

 3.4 Creators Table

 interface CreatorMetadata {
   archetype?: string;
   specialties?: string[];
   verified?: boolean;
 }

 export const creators = pgTable('creators', {
   id: uuid().primaryKey().defaultRandom(),
   name: text().notNull(),
   platformId: text().notNull(), // YouTube channel ID
   platform: text().notNull(), // 'youtube', 'twitch', etc.
   metadataJson: jsonb().$type<CreatorMetadata>(),
   ownerUserId: text().references(() => users.id),
   isTakenDown: boolean().default(false).notNull(),
   isActive: boolean().default(true).notNull(),
   createdAt: timestamp().defaultNow().notNull(),
   updatedAt: timestamp().defaultNow().notNull(),
 }, (table) => [
   unique('creators_platform_platform_id_unique').on(table.platform, table.platformId),
 ]);

 3.5 Contents Table (Content-Agnostic)

 interface YouTubeMetadata {
   authorName: string;
   channelName: string;
   channelId: string;
   channelUrl: string;
   durationSeconds: number;
   publishedAt: string;
   viewCount?: number;
   likeCount?: number;
   commentCount?: number;
   thumbnailUrl?: string;
   description?: string;
   timestampsInDescription?: Array<{ timestamp: string; title: string }>;
 }

 export const contents = pgTable('contents', {
   id: uuid().primaryKey().defaultRandom(),
   sourceType: sourceTypeEnum().notNull(),
   externalId: text().notNull(), // YouTube video ID
   url: text().notNull(),
   title: text().notNull(),
   thumbnailUrl: text(),
   metadataJson: jsonb().$type<YouTubeMetadata>().notNull(),
   userId: text().references(() => users.id).notNull(),
   creatorId: uuid().references(() => creators.id),
   gameId: uuid().references(() => games.id),
   status: contentStatusEnum().default('pending').notNull(),
   upvotes: integer().default(0).notNull(),
   downvotes: integer().default(0).notNull(),
   commentCount: integer().default(0).notNull(),
   baitRating: integer(),
   hotness: doublePrecision(),
   createdAt: timestamp().defaultNow().notNull(),
   publishedAt: timestamp(),
 }, (table) => [
   unique('contents_source_external_unique').on(table.sourceType, table.externalId),
   index('contents_source_external_idx').on(table.sourceType, table.externalId),
   index('contents_created_at_idx').on(table.createdAt),
   index('contents_published_at_idx').on(table.publishedAt),
   index('contents_game_id_created_at_idx').on(table.gameId, table.createdAt),
   index('contents_hotness_idx').on(table.hotness),
   index('contents_status_idx').on(table.status),
   index('contents_source_type_idx').on(table.sourceType),
   index('contents_creator_id_idx').on(table.creatorId),
 ]);

 3.6 Content Cache Tables (Processing Pipeline)

 // Extraction Cache - Raw transcript and metadata from Supadata
 export const extractionCache = pgTable('extraction_cache', {
   id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
   contentId: uuid().notNull().unique().references(() => contents.id, { onDelete: 'cascade' }),
   url: text().notNull(),
   contentJson: jsonb().$type<ExtractionCacheData>().notNull(),
   gameId: uuid().references(() => games.id),
   fetchedAt: timestamp().defaultNow().notNull(),
   provider: text().notNull(), // 'supadata'
   status: extractionStatusEnum().default('complete').notNull(),
   errorMessage: text(),
 }, (table) => [
   index('extraction_cache_game_id_idx').on(table.gameId),
   index('extraction_cache_status_idx').on(table.status),
 ]);

 // Preprocessing Cache - Entities, themes, segments
 export const preprocessingCache = pgTable('preprocessing_cache', {
   id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
   contentId: uuid().notNull().unique().references(() => contents.id, { onDelete: 'cascade' }),
   contentJson: jsonb().$type<PreprocessingCacheData>().notNull(),
   provider: text().notNull(),
   modelId: text().notNull(),
   createdAt: timestamp().defaultNow().notNull(),
 });

 // Processing Cache - Final AI summaries
 export const processingCache = pgTable('processing_cache', {
   id: text().primaryKey().$defaultFn(() => crypto.randomUUID()),
   contentId: uuid().notNull().unique().references(() => contents.id, { onDelete: 'cascade' }),
   status: processingStatusEnum().default('completed').notNull(),
   processingStartedAt: timestamp(),
   contentJson: jsonb().$type<ProcessingCacheData>().notNull(),
   creatorArchetype: text(),
   provider: text().notNull(),
   modelId: text().notNull(),
   errorCode: text(),
   errorMessage: text(),
   createdAt: timestamp().defaultNow().notNull(),
 }, (table) => [
   index('processing_cache_content_id_status_idx').on(table.contentId, table.status),
 ]);

 3.7 Content Summaries Table

 export const contentSummaries = pgTable('content_summaries', {
   id: uuid().primaryKey().defaultRandom(),
   contentId: uuid().notNull().references(() => contents.id, { onDelete: 'cascade' }),
   summaryType: summaryTypeEnum().notNull(),
   short: text().notNull(),
   detailed: text().notNull(),
   provider: text().notNull(),
   modelId: text().notNull(),
   createdAt: timestamp().defaultNow().notNull(),
 }, (table) => [
   unique('content_summaries_content_type_unique').on(table.contentId, table.summaryType),
   index('content_summaries_content_id_idx').on(table.contentId),
   index('content_summaries_summary_type_idx').on(table.summaryType),
 ]);

 3.8 Tags System

 const TAG_CATEGORIES = {
   CONTENT_TYPE: 'content_type',
   CHARACTER: 'character',
   CHARACTER_CLASS: 'character_class',
   GAME_MODE: 'game_mode',
   TOPIC: 'topic',
   ITEM_TYPE: 'item_type',
 };

 export const tags = pgTable('tags', {
   id: uuid().primaryKey().defaultRandom(),
   name: text().notNull(),
   slug: text().notNull(),
   category: text().notNull(),
   description: text(),
   gameId: uuid().references(() => games.id),
   parentTagId: uuid().references((): any => tags, { onDelete: 'cascade' }),
   metadataJson: jsonb().$type<TagMetadata>(),
   usageCount: integer().default(0).notNull(),
   isActive: boolean().default(true).notNull(),
   createdAt: timestamp().defaultNow().notNull(),
   updatedAt: timestamp().defaultNow().notNull(),
 }, (table) => [
   unique('tags_game_slug_unique').on(table.gameId, table.slug),
   index('tags_game_id_idx').on(table.gameId),
   index('tags_category_idx').on(table.category),
   index('tags_parent_tag_id_idx').on(table.parentTagId),
   index('tags_usage_count_idx').on(table.usageCount),
 ]);

 export const contentTags = pgTable('content_tags', {
   id: uuid().primaryKey().defaultRandom(),
   contentId: uuid().references(() => contents.id, { onDelete: 'cascade' }).notNull(),
   tagId: uuid().references(() => tags.id, { onDelete: 'cascade' }).notNull(),
   confidence: jsonb().$type<number>(),
   appliedBy: text().$type<'user' | 'ai' | 'admin'>(),
   appliedAt: timestamp().defaultNow().notNull(),
 }, (table) => [
   unique('content_tags_content_tag_unique').on(table.contentId, table.tagId),
   index('content_tags_content_id_idx').on(table.contentId),
   index('content_tags_tag_id_idx').on(table.tagId),
 ]);

 3.9 Comments and Votes

 export const comments = pgTable('comments', {
   id: uuid().primaryKey().defaultRandom(),
   contentId: uuid().references(() => contents.id, { onDelete: 'cascade' }).notNull(),
   userId: text().references(() => users.id).notNull(),
   parentId: uuid().references((): any => comments, { onDelete: 'cascade' }),
   content: text().notNull(),
   upvotes: integer().default(0).notNull(),
   downvotes: integer().default(0).notNull(),
   createdAt: timestamp().defaultNow().notNull(),
 }, (table) => [
   index('comments_content_id_idx').on(table.contentId),
   index('comments_parent_id_idx').on(table.parentId),
   index('comments_content_parent_idx').on(table.contentId, table.parentId),
 ]);

 export const votes = pgTable('votes', {
   id: uuid().primaryKey().defaultRandom(),
   userId: text().references(() => users.id).notNull(),
   targetType: text({ enum: ['content', 'comment'] }).notNull(),
   targetId: uuid().notNull(),
   voteType: text({ enum: ['up', 'down'] }).notNull(),
   createdAt: timestamp().defaultNow().notNull(),
 }, (table) => [
   unique('votes_user_target_unique').on(table.userId, table.targetType, table.targetId),
   index('votes_user_id_idx').on(table.userId),
   index('votes_target_idx').on(table.targetType, table.targetId),
 ]);

 3.10 User Subscriptions and Digests

 export const userSubscriptions = pgTable('user_subscriptions', {
   id: uuid().primaryKey().defaultRandom(),
   userId: text().references(() => users.id, { onDelete: 'cascade' }).notNull(),
   creatorId: uuid().references(() => creators.id, { onDelete: 'cascade' }).notNull(),
   gameId: uuid(),
   createdAt: timestamp().defaultNow().notNull(),
 }, (table) => [
   unique('user_subscriptions_user_creator_unique').on(table.userId, table.creatorId),
   index('user_subscriptions_user_id_idx').on(table.userId),
   index('user_subscriptions_creator_id_idx').on(table.creatorId),
 ]);

 export const digestPreferences = pgTable('digest_preferences', {
   id: uuid().primaryKey().defaultRandom(),
   userId: text().references(() => users.id, { onDelete: 'cascade' }).notNull().unique(),
   frequency: digestFrequencyEnum().notNull().default('daily'),
   deliveryTime: time().notNull().default('09:00:00'),
   isActive: boolean().notNull().default(true),
   createdAt: timestamp().defaultNow().notNull(),
   updatedAt: timestamp().defaultNow().notNull(),
 });

 export const digestHistory = pgTable('digest_history', {
   id: uuid().primaryKey().defaultRandom(),
   userId: text().references(() => users.id, { onDelete: 'cascade' }).notNull(),
   gameId: uuid().references(() => games.id, { onDelete: 'set null' }),
   sentAt: timestamp().defaultNow().notNull(),
   contentIds: jsonb().$type<string[]>().notNull().default([]),
 }, (table) => [
   index('digest_history_user_id_idx').on(table.userId),
   index('digest_history_sent_at_idx').on(table.sentAt),
 ]);

 3.11 Creator Relations

 export const creatorGames = pgTable('creator_games', {
   id: uuid().primaryKey().defaultRandom(),
   creatorId: uuid().references(() => creators.id, { onDelete: 'cascade' }).notNull(),
   gameId: uuid().references(() => games.id, { onDelete: 'cascade' }).notNull(),
   isPrimary: boolean().default(false).notNull(),
   createdAt: timestamp().defaultNow().notNull(),
 });

 export const creatorSocials = pgTable('creator_socials', {
   id: uuid().primaryKey().defaultRandom(),
   creatorId: uuid().references(() => creators.id, { onDelete: 'cascade' }).notNull(),
   platform: text().notNull(),
   channelId: text(),
   handle: text(),
   url: text().notNull(),
   createdAt: timestamp().defaultNow().notNull(),
 }, (table) => [
   unique('creator_socials_creator_platform_unique').on(table.creatorId, table.platform),
 ]);

---
14. ORIGINAL MONOLITHIC API ENDPOINTS

 4.1 Contents Routes (/v1/contents)
 ┌────────┬───────────────────────────┬─────────────────────────────────────┬──────────┐
 │ Method │           Path            │               Purpose               │   Auth   │
 ├────────┼───────────────────────────┼─────────────────────────────────────┼──────────┤
 │ GET    │ /v1/contents              │ List contents (paginated, sortable) │ Optional │
 ├────────┼───────────────────────────┼─────────────────────────────────────┼──────────┤
 │ GET    │ /v1/contents/recent       │ Get recent contents for sidebar     │ Optional │
 ├────────┼───────────────────────────┼─────────────────────────────────────┼──────────┤
 │ GET    │ /v1/contents/:id          │ Get single content by ID            │ Optional │
 ├────────┼───────────────────────────┼─────────────────────────────────────┼──────────┤
 │ POST   │ /v1/contents              │ Submit new content (YouTube URL)    │ Required │
 ├────────┼───────────────────────────┼─────────────────────────────────────┼──────────┤
 │ GET    │ /v1/contents/:id/status   │ Get processing status               │ Optional │
 ├────────┼───────────────────────────┼─────────────────────────────────────┼──────────┤
 │ GET    │ /v1/contents/:id/summary  │ Get AI-generated summary            │ Optional │
 ├────────┼───────────────────────────┼─────────────────────────────────────┼──────────┤
 │ POST   │ /v1/contents/:id/vote     │ Vote (up/down) on content           │ Required │
 ├────────┼───────────────────────────┼─────────────────────────────────────┼──────────┤
 │ DELETE │ /v1/contents/:id/vote     │ Remove vote from content            │ Required │
 ├────────┼───────────────────────────┼─────────────────────────────────────┼──────────┤
 │ GET    │ /v1/contents/:id/comments │ List comments on content            │ Optional │
 ├────────┼───────────────────────────┼─────────────────────────────────────┼──────────┤
 │ POST   │ /v1/contents/:id/comments │ Create comment on content           │ Required │
 └────────┴───────────────────────────┴─────────────────────────────────────┴──────────┘
 Query Parameters for GET /v1/contents:
 - sort: 'hot' | 'new' | 'top' (default: 'hot')
 - cursor: For cursor-based pagination
 - limit: 1-50 (default: 25)
 - gameSlug: Filter by game

 Content Response Format:
 {
   id: string,
   videoId: string,
   url: string,
   title: string,
   thumbnailUrl: string | null,
   channelName: string | null,
   durationSeconds: number | null,
   contentType: 'OTHER',
   user: { id, name, image },
   creator: { id, name, channelId } | null,
   upvotes: number,
   downvotes: number,
   commentCount: number,
   score: number,
   createdAt: string,
   userVote: { id, voteType: 'UP' | 'DOWN' } | null
 }

 4.2 Games Routes (/v1/games)
 ┌────────┬─────────────────┬───────────────────────┬──────┐
 │ Method │      Path       │        Purpose        │ Auth │
 ├────────┼─────────────────┼───────────────────────┼──────┤
 │ GET    │ /v1/games       │ List all active games │ No   │
 ├────────┼─────────────────┼───────────────────────┼──────┤
 │ GET    │ /v1/games/:slug │ Get game by slug      │ No   │
 └────────┴─────────────────┴───────────────────────┴──────┘
 4.3 Creators Routes (/v1/creators)
 ┌────────┬────────────────────────────────┬───────────────────────────────┬──────────┐
 │ Method │              Path              │            Purpose            │   Auth   │
 ├────────┼────────────────────────────────┼───────────────────────────────┼──────────┤
 │ GET    │ /v1/creators                   │ List creators                 │ No       │
 ├────────┼────────────────────────────────┼───────────────────────────────┼──────────┤
 │ GET    │ /v1/creators/:channelId        │ Get creator profile           │ Optional │
 ├────────┼────────────────────────────────┼───────────────────────────────┼──────────┤
 │ GET    │ /v1/creators/:channelId/videos │ Get creator's content library │ No       │
 ├────────┼────────────────────────────────┼───────────────────────────────┼──────────┤
 │ POST   │ /v1/creators/:channelId/follow │ Follow creator                │ Required │
 ├────────┼────────────────────────────────┼───────────────────────────────┼──────────┤
 │ DELETE │ /v1/creators/:channelId/follow │ Unfollow creator              │ Required │
 └────────┴────────────────────────────────┴───────────────────────────────┴──────────┘
 4.4 Users Routes (/v1/users)
 ┌────────┬────────────────────────────┬───────────────────────────┬──────────┐
 │ Method │            Path            │          Purpose          │   Auth   │
 ├────────┼────────────────────────────┼───────────────────────────┼──────────┤
 │ GET    │ /v1/users/me/subscriptions │ Get followed creators     │ Required │
 ├────────┼────────────────────────────┼───────────────────────────┼──────────┤
 │ GET    │ /v1/users/me/digest        │ Get digest preferences    │ Required │
 ├────────┼────────────────────────────┼───────────────────────────┼──────────┤
 │ PUT    │ /v1/users/me/digest        │ Update digest preferences │ Required │
 └────────┴────────────────────────────┴───────────────────────────┴──────────┘
 4.5 YouTube Routes (/v1/youtube)
 ┌────────┬─────────────────────┬────────────────────────────────────┬──────┐
 │ Method │        Path         │              Purpose               │ Auth │
 ├────────┼─────────────────────┼────────────────────────────────────┼──────┤
 │ GET    │ /v1/youtube/preview │ Get YouTube video preview (oEmbed) │ No   │
 └────────┴─────────────────────┴────────────────────────────────────┴──────┘
 4.6 Admin Routes (/v1/admin)
 ┌────────┬──────────────────────────────────────┬─────────────────────────────────┬───────┐
 │ Method │                 Path                 │             Purpose             │ Auth  │
 ├────────┼──────────────────────────────────────┼─────────────────────────────────┼───────┤
 │ POST   │ /v1/admin/creators/:creatorId/import │ Bulk import videos from creator │ Admin │
 └────────┴──────────────────────────────────────┴─────────────────────────────────┴───────┘
 4.7 Health Check
 ┌────────┬─────────┬────────────────────────────────┬──────────┐
 │ Method │  Path   │            Purpose             │   Auth   │
 ├────────┼─────────┼────────────────────────────────┼──────────┤
 │ GET    │ /health │ Health check with session info │ Optional │
 └────────┴─────────┴────────────────────────────────┴──────────┘
---

15. ORIGINAL MONOLITHIC AI PROMPTS

 5.1 Overview Summary Prompt

 You are an expert content analyst. Analyze the video content and generate a comprehensive overview.

 ## Output Format
 {
   "logline": "Engaging 15-30 word summary with **markdown** formatting",
   "full_overview": "Comprehensive 3- sentence overview",
   "short_overview": "1-2 sentence essence",
   "clickbait_rating": {
     "score": 1-5,
     "explanation": "Why this rating"
   },
   "main_themes": [
     { "title": "3-4 words max", "description": "1-2 sentences" }
   ],
   "content_category": "Tutorial|Gameplay|Crafting|Market|News|Discussion|Review|How to"
 }

 ADDITIONAL GUIDELINES:
 - Logline should be engaging and attention-grabbing with markdown formatting (bold, italic)
 - Full overview should be comprehensive but concise
 - Short overview should capture the essence in 1-2 sentences
 - Rate clickbait honestly: 1-2 for educational/realistic, 3 for balanced, 4-5 for clickbait
 - Themes should have concise titles (3-4 words max) and brief descriptions
 - Category should match the video's primary purpose
 - Use markdown formatting for emphasis

 5.2 Insightful Summary Prompt (List Format)

 You are an insightful content analyst. Generate both a SHORT and DETAILED bullet-point summary that highlights deep insights, patterns, and meaningful observations.

 ## Output Format
 {
   "short": "2-3 sentence summary with markdown",
   "detailed": ["**Bold Heading**: 1-2 sentences explanation", ...]
 }

 ADDITIONAL GUIDELINES:
 - Focus on deep understanding and connections between concepts
 - Patterns and underlying themes
 - Meaningful insights that go beyond surface-level content
 - Why these insights matter and their broader implications
 - Each point MUST be a separate array element
 - Do NOT combine multiple points into a single element
 - Format each as: "**Bold Heading**: 1-2 sentences explanation"
 - Use markdown formatting for headings

 5.3 Insightful Summary Prompt (Q&A Format)

 You are an insightful content analyst. Generate both a SHORT and DETAILED Q&A-style summary that highlights deep insights and meaningful observations.

 ## Output Format
 {
   "short": "2-3 sentence summary with markdown",
   "detailed": "### Q: [Question]\n**A:** [Answer]\n\n### Q: [Question]\n**A:** [Answer]..."
 }

 ADDITIONAL GUIDELINES:
 - Focus on deep understanding and connections between concepts
 - Patterns and underlying themes
 - Meaningful insights that go beyond surface-level content
 - Why these insights matter and their broader implications
 - Format each Q&A as: "### Q: [Question about an insight or pattern]\n**A:** [Detailed answer exploring the insight, why it matters, and its implications]\n\n"

 5.4 Funny Summary Prompt (List Format)

 You are a witty content analyst with a great sense of humor. Generate both a SHORT and DETAILED funny summary that uses humor, wit, and lighthearted observations.

 ## Output Format
 {
   "short": "2-3 humorous sentences with markdown",
   "detailed": ["**Funny Heading**: 1-2 humorous sentences", ...]
 }

 ADDITIONAL GUIDELINES:
 - Keep it respectful and not mean-spirited
 - Genuinely funny, not forced
 - Based on actual content from the video
 - Each point MUST be a separate array element
 - Do NOT combine multiple points into a single element
 - Format each as: "**Funny Heading**: 1-2 humorous sentences"
 - Use markdown formatting for headings

 5.5 Funny Summary Prompt (Q&A Format)

 You are a witty content analyst with a great sense of humor. Generate both a SHORT and DETAILED funny Q&A summary with humor and wit.

 ## Output Format
 {
   "short": "2-3 humorous sentences with markdown",
   "detailed": "### Q: [Funny question]\n**A:** [Humorous answer]\n\n..."
 }

 ADDITIONAL GUIDELINES:
 - Keep it respectful and not mean-spirited
 - Genuinely funny, not forced
 - Based on actual content from the video
 - Format each Q&A as: "### Q: [Funny or witty question]\n**A:** [Humorous answer with witty observations]\n\n"

 5.6 Actionable Summary Prompt (List Format)

 You are a practical content analyst. Generate both a SHORT and DETAILED actionable summary that provides practical advice, steps, and things the viewer can do.

 ## Output Format
 {
   "short": "2-3 sentences with markdown",
   "detailed": ["**Action Heading**: 1-2 sentences on how to implement", ...]
 }

 ADDITIONAL GUIDELINES:
 - Focus on practical, actionable advice
 - Specific steps or recommendations
 - Things the viewer can implement immediately
 - Clear, concrete guidance
 - Each point MUST be a separate array element
 - Do NOT combine multiple points into a single element
 - Format each as: "**Action Heading**: 1-2 sentences explaining how to implement it"
 - Use markdown formatting for headings

 5.7 Actionable Summary Prompt (Q&A Format)

 You are a practical content analyst. Generate both a SHORT and DETAILED actionable Q&A summary with practical advice.

 ## Output Format
 {
   "short": "2-3 sentences with markdown",
   "detailed": "### Q: [Practical question]\n**A:** [Actionable answer]\n\n..."
 }

 ADDITIONAL GUIDELINES:
 - Focus on practical, actionable advice
 - Specific steps or recommendations
 - Things the viewer can implement immediately
 - Clear, concrete guidance
 - Format each Q&A as: "### Q: [Practical question]\n**A:** [Actionable answer with specific steps, recommendations, and practical guidance]\n\n"

 5.8 Controversial Summary Prompt (List Format)

 You are a critical content analyst. Generate both a SHORT and DETAILED controversial summary that highlights challenging ideas, hot takes, and contrarian perspectives.

 ## Output Format
 {
   "short": "2-3 sentences with markdown",
   "detailed": ["**Controversial Point**: 1-2 sentences explaining the perspective", ...]
 }

 ADDITIONAL GUIDELINES:
 - Focus on challenging ideas and hot takes
 - Contrarian perspectives
 - Controversial opinions expressed
 - Why these perspectives challenge conventional thinking
 - Be authentic - don't force controversy if it's not there
 - Each point MUST be a separate array element
 - Do NOT combine multiple points into a single element
 - Format each as: "**Controversial Point**: 1-2 sentences explaining the challenging perspective"
 - Use markdown formatting for headings

 5.9 Controversial Summary Prompt (Q&A Format)

 You are a critical content analyst. Generate both a SHORT and DETAILED controversial Q&A summary that highlights challenging ideas and hot takes.

 ## Output Format
 {
   "short": "2-3 sentences with markdown",
   "detailed": "### Q: [Controversial question]\n**A:** [Challenging answer]\n\n..."
 }

 ADDITIONAL GUIDELINES:
 - Focus on challenging ideas and hot takes
 - Contrarian perspectives
 - Controversial opinions expressed
 - Why these perspectives challenge conventional thinking
 - Be authentic - don't force controversy if it's not there
 - Format each Q&A as: "### Q: [Controversial question]\n**A:** [Detailed answer exploring the challenging perspective, why it's controversial, and its implications]\n\n"

---
16. ORIGINAL MONOLITHIC CONTENT PROCESSING PIPELINE

 6.1 Pipeline Flow

 1. URL Validation → Extract YouTube video ID → Normalize URL
 2. Check Summary Cache → Return if found and not force-refresh
 3. Claim Processing Lock → Prevent duplicate processing
 4. Fetch Transcript → Supadata API (30-min max video duration)
 5. Extract Metadata → Title, channel, duration, description
 6. Validate Video Duration → Reject if > 30 minutes
 7. Run Preprocessing → 3 parallel AI calls:
    - Entity extraction
    - Theme analysis
    - Transcript segmentation
 8. Validate Content Type → Must be game-related
 9. Generate Parallel Summaries → 9 AI calls:
    - 1 Overview
    - 8 Enhanced (4 tones × 2 formats)
 10. Cache Result → Store in processingCache
 11. Return Response → VideoSummaryResponse

 6.2 Timeout Configuration

 const TIMEOUTS = {
   overall: 180_000,        // 3 minutes
   transcriptFetch: 60_000, // 1 minute
   aiGeneration: 90_000,    // 1.5 minutes
   parallelGeneration: 180_000, // 3 minutes (2x AI timeout)
 };

 6.3 Model Fallback Strategy

 Preprocessing Models (3 parallel calls):
 Zhipu: ['zai/glm-4.5-air', 'zai/glm-4.5', 'zai/glm-4.6v']
 Anthropic: ['claude-haiku-3-20240307']

 Main Summary Models (9 parallel calls):
 Zhipu: ['zai/glm-4.7', 'zai/glm-4.6', 'zai/glm-4.5']
 Anthropic: ['claude-sonnet-4-20250514']

 Fallback Triggers:
 - Rate limit errors (429)
 - Context limit errors
 - Unsupported inputs
 - Provider outages

 6.4 Supadata Transcript Fetch

 const transcriptOptions = {
   mode: 'native',  // Only existing YouTube transcripts
   lang: 'en',      // Prefer English
   text: false,     // Return structured format with timestamps
 };

 // Response structure
 interface TranscriptResponse {
   content: Array<{
     text: string;
     offset: number;    // milliseconds
     duration: number;  // milliseconds
     lang?: string;
   }>;
   lang: string;
   availableLangs: string[];
 }

---
17. ORIGINAL MONOLITHIC RANKING ALGORITHM (Lobsters-Style)

 7.1 Formula

 hotness = -1 × (base + order + age)

 All values negative. Lower = higher rank (ascending sort).

 7.2 Components

 Base Component:
 base = contentTypeModifier + selfAuthorBonus

 contentTypeModifiers = {
   builds: +2,    // Highly valued
   economy: +1,   // Useful market analysis
   news: 0,       // Neutral
   other: -1,     // Penalized
 };

 selfAuthorBonus = 0.25; // If user matches creator owner

 Order Component:
 score = upvotes - downvotes;

 if (base < 0) {
   effectiveCpoints = 0;
 } else {
   effectiveCpoints = Math.min(commentUpvotes / CPOINTS_DIVISOR, score);
 }

 order = Math.log10(Math.max(Math.abs(score + 1) + effectiveCpoints, 1));

 Age Component:
 age = createdAt_timestamp / HOTNESS_WINDOW_SECONDS;

 // HOTNESS_WINDOW_SECONDS: 7200 (2 hours default)
 // Lower = content ages faster (freshness emphasis)
 // Higher = content ages slower (engagement emphasis)

 7.3 Configuration

 const DEFAULT_HOTNESS_CONFIG = {
   HOTNESS_WINDOW_SECONDS: 7200,
   DEFAULT_HOTNESS_MODIFIER: 0,
   CPOINTS_DIVISOR: 2,
   SELF_AUTHOR_BONUS: 0.25,
   CONTENT_TYPE_MODIFIERS: {
     builds: 2,
     economy: 1,
     news: 0,
     other: -1,
   },
 };

 16-a EXPECTED CONTENT PROCESSING PIPELINE

 The main difference between the previous imple

 6.1 Pipeline Flow

 1. URL Validation → Extract Content ID (youtube id, plataform id, etc.) → Normalize URL
 2. Check Content Cache → Return if found and not force-refresh
 3. Claim Processing Lock → Prevent duplicate processing
 4. Fetch Content → configurable per source (Supadata API, Tabstack API, HTTP requests)
 5. Check Content Extraction Cache -> if found, return it.
 6. Extract Metadata → Check extraction constraints (max duration, max size, etc.) reject if not found or constraints are not met. → Title, channel, duration, description
 7. Check Preprocessing Cache -> if found, return it. Run Preprocessing → 3 parallel AI calls:
    - Entity extraction
    - Theme analysis
    - Transcript segmentation
 8. Validate Content Type → Must be game-related
 9. Generate Parallel Summaries → 9 AI calls:
    - 1 Overview
    - 8 Enhanced (4 tones × 2 formats)
 10. Cache Result → Store in processingCache
 11. Return Response → VideoSummaryResponse / WebSiteSummaryResponse / etc.

 6.2 Timeout Configuration

 const TIMEOUTS = {
   overall: 180_000,        // 3 minutes
   transcriptFetch: 60_000, // 1 minute
   aiGeneration: 90_000,    // 1.5 minutes
   parallelGeneration: 180_000, // 3 minutes (2x AI timeout)
 };

 6.3 Model Fallback Strategy

 Preprocessing Models (3 parallel calls):
 Zhipu: ['zai/glm-4.5-air', 'zai/glm-4.5', 'zai/glm-4.6v']
 Anthropic: ['claude-haiku-3-20240307']

 Main Summary Models (9 parallel calls):
 Zhipu: ['zai/glm-4.7', 'zai/glm-4.6', 'zai/glm-4.5']
 Anthropic: ['claude-sonnet-4-20250514']

 Fallback Triggers:
 - Rate limit errors (429)
 - Context limit errors
 - Unsupported inputs
 - Provider outages

 6.4 Supadata Transcript Fetch

 const transcriptOptions = {
   mode: 'native',  // Only existing YouTube transcripts
   lang: 'en',      // Prefer English
   text: false,     // Return structured format with timestamps
 };

 // Response structure
 interface TranscriptResponse {
   content: Array<{
     text: string;
     offset: number;    // milliseconds
     duration: number;  // milliseconds
     lang?: string;
   }>;
   lang: string;
   availableLangs: string[];
 }

---
17. ORIGINAL MONOLITHIC RANKING ALGORITHM (Lobsters-Style)

 7.1 Formula

 hotness = -1 × (base + order + age)

 All values negative. Lower = higher rank (ascending sort).

 7.2 Components

 Base Component:
 base = contentTypeModifier + selfAuthorBonus

 contentTypeModifiers = {
   builds: +2,    // Highly valued
   economy: +1,   // Useful market analysis
   news: 0,       // Neutral
   other: -1,     // Penalized
 };

 selfAuthorBonus = 0.25; // If user matches creator owner

 Order Component:
 score = upvotes - downvotes;

 if (base < 0) {
   effectiveCpoints = 0;
 } else {
   effectiveCpoints = Math.min(commentUpvotes / CPOINTS_DIVISOR, score);
 }

 order = Math.log10(Math.max(Math.abs(score + 1) + effectiveCpoints, 1));

 Age Component:
 age = createdAt_timestamp / HOTNESS_WINDOW_SECONDS;

 // HOTNESS_WINDOW_SECONDS: 7200 (2 hours default)
 // Lower = content ages faster (freshness emphasis)
 // Higher = content ages slower (engagement emphasis)

 7.3 Configuration

 const DEFAULT_HOTNESS_CONFIG = {
   HOTNESS_WINDOW_SECONDS: 7200,
   DEFAULT_HOTNESS_MODIFIER: 0,
   CPOINTS_DIVISOR: 2,
   SELF_AUTHOR_BONUS: 0.25,
   CONTENT_TYPE_MODIFIERS: {
     builds: 2,
     economy: 1,
     news: 0,
     other: -1,
   },
 };

---
18. ORIGINAL MONOLITHIC AUTHENTICATION

 8.1 Better Auth Configuration

 import { betterAuth } from 'better-auth';
 import { drizzleAdapter } from 'better-auth/adapters/drizzle';

 const auth = betterAuth({
   database: drizzleAdapter(getDb(), {
     provider: 'pg',
     usePlural: true,
     schema,
   }),
   socialProviders: {
     discord: {
       clientId: env.DISCORD_CLIENT_ID,
       clientSecret: env.DISCORD_CLIENT_SECRET,
     },
     google: {
       clientId: env.GOOGLE_CLIENT_ID,
       clientSecret: env.GOOGLE_CLIENT_SECRET,
     },
   },
   emailAndPassword: { enabled: true },
   session: {
     expiresIn: 60 * 60 * 24 * 7, // 7 days
     updateAge: 60 * 60 * 24,     // 1 day
   },
 });

 8.2 Session Retrieval

 async function getSession(request: Request): Promise<SessionResult> {
   // Extract from Authorization header or Cookie
   // Returns { user: AuthUser | null, session: AuthSession | null }
 }

 8.3 Auth Macro Pattern

 // Route with optional auth
 .get('/resource', handler, { auth: false })

 // Route requiring auth
 .get('/protected', handler, { auth: true })

 // Manual check
 const user = requireAuth(ctx.user, ctx.set);

---
19. ORIGINAL MONOLITHIC RATE LIMITING

 9.1 Hierarchical Identification

 Priority order:
 1. User ID (all sessions share one bucket)
 2. Session Token (fallback if no user)
 3. IP Address (anonymous users)

 9.2 Rate Limiters
 ┌──────────────┬─────────────┬──────────┐
 │   Limiter    │    Limit    │ Duration │
 ├──────────────┼─────────────┼──────────┤
 │ Global       │ 200-300 req │ 1 minute │
 ├──────────────┼─────────────┼──────────┤
 │ Health       │ 1000 req    │ 1 minute │
 ├──────────────┼─────────────┼──────────┤
 │ Auth         │ 10 req      │ 1 minute │
 ├──────────────┼─────────────┼──────────┤
 │ GraphQL      │ 30-100 req  │ 1 minute │
 ├──────────────┼─────────────┼──────────┤
 │ Summarize    │ 3-5 req     │ 1 hour   │
 ├──────────────┼─────────────┼──────────┤
 │ Video Status │ 60-120 req  │ 1 minute │
 ├──────────────┼─────────────┼──────────┤
 │ Video Recent │ 30-60 req   │ 1 minute │
 ├──────────────┼─────────────┼──────────┤
 │ Creators     │ 30-60 req   │ 1 minute │
 ├──────────────┼─────────────┼──────────┤
 │ Games        │ 60-120 req  │ 1 minute │
 ├──────────────┼─────────────┼──────────┤
 │ Posts        │ 30-60 req   │ 1 minute │
 └──────────────┴─────────────┴──────────┘
 9.3 IP Detection (Cloudflare-aware)

 function getClientIdentifier(request: Request): string {
   // Priority: CF-Connecting-IP → X-Forwarded-For → X-Real-IP → requestIP
 }

---
20. ORIGINAL MONOLITHIC ERROR HANDLING

 10.1 Custom Error Classes

 class VideoSummarizeError extends Error {
   constructor(
     message: string,
     public code: string,
     public statusCode: number,
     public details?: Record<string, unknown>
   ) { ... }
 }

 // Specific errors:
 InvalidUrlError              // 400
 ProviderUnavailableError     // 503
 TranscriptNotAvailableError  // 404
 TranscriptFetchError         // 502
 AIGenerationError            // 502
 AIResponseParseError         // 502
 AIRateLimitedError           // 429
 AIInsufficientFundsError     // 402
 TimeoutError                 // 504
 VideoTooLongError            // 400
 AlreadyProcessingError       // 409
 NonGameContentError          // 400

 10.2 Global Error Handler

 .onError(({ code, error, set }) => {
   if (errorMessage === 'UNAUTHORIZED') {
     set.status = 401;
     return { error: 'UNAUTHORIZED', message: 'Authentication required' };
   }

   if (code === 'INTERNAL_SERVER_ERROR') {
     set.status = 500;
     return { error: 'INTERNAL_ERROR', message: errorMessage };
   }

   set.status = 500;
   return { error: 'INTERNAL_ERROR', message: errorMessage };
 });

---
21. ORIGINAL MONOLITHIC ENVIRONMENT VARIABLES

 # Database
 DATABASE_URL=postgresql://...

 # Server
 PORT=3001
 CORS_ORIGIN=*
 NODE_ENV=development|production|test
 ADMIN_USER_IDS=user1,user2,user3

 # Authentication
 AUTH_SECRET=...
 BETTER_AUTH_URL=...
 DISCORD_CLIENT_ID=...
 DISCORD_CLIENT_SECRET=...
 GOOGLE_CLIENT_ID=...
 GOOGLE_CLIENT_SECRET=...

 # AI Providers
 ZHIPU_API_KEY=...
 ZHIPU_DEFAULT_MODEL=zai/glm-4.7
 ANTHROPIC_API_KEY=...
 OPENAI_API_KEY=...  # deprecated

 # External APIs
 SUPADATA_API_KEY=...
 RESEND_API_KEY=...

 # Rate Limiting
 RATE_LIMIT_ENABLED=true
 RATE_LIMIT_GLOBAL_MAX_AUTH=300
 RATE_LIMIT_AUTH_MAX=10
 RATE_LIMIT_GRAPHQL_MAX_AUTH=100
 RATE_LIMIT_SUMMARIZE_MAX_AUTH=5
 RATE_LIMIT_SUMMARIZE_DURATION_MS=3600000
 RATE_LIMIT_VIDEO_STATUS_MAX_AUTH=120
 RATE_LIMIT_VIDEO_RECENT_MAX_AUTH=60
 RATE_LIMIT_CREATORS_MAX_AUTH=60

---
22. ORIGINAL MONOLITHIC APP FACTORY PATTERN

 export interface AppOptions {
   prefix?: string;
   corsOrigin?: string | string[];
   env?: Partial<Record<keyof Env, string | undefined>>;
 }

 export function createApp(options: AppOptions = {}) {
   // Embedded mode: accept env config for SSR
   if (envConfig) {
     parseEnv(envConfig);
     Object.assign(process.env, envConfig);
     if (envConfig.DATABASE_URL) initDatabase(envConfig.DATABASE_URL);
   }

   return new Elysia({ prefix })
     .onError(globalErrorHandler)
     .use(logger())
     .use(cors({ credentials: true }))
     .use(betterAuthMacro)
     .use(globalRateLimiter())
     .use(healthRateLimiter())
     .get('/health', healthHandler)
     .group('/v1', (app) =>
       app
         .use(gamesRoutes)
         .use(contentsRoutes)
         .use(creatorsRoutes)
         .use(usersRoutes)
         .use(youtubeRoutes)
         .use(adminRoutes)
     );
 }

---
23. ORIGINAL MONOLITHIC DIRECTORY STRUCTURE

 apps/api/src/
 ├── app.ts                    # Main app factory
 ├── index.ts                  # Server startup
 ├── config/
 │   └── env.ts                # Environment configuration
 ├── plugins/
 │   ├── auth.ts               # Better Auth setup
 │   ├── database.ts           # Database plugin
 │   ├── rate-limit.ts         # Rate limiting
 │   └── rate-limit-retry-after.ts
 ├── routes/
 │   ├── contents.ts           # Content/Posts endpoints
 │   ├── games.ts              # Games endpoints
 │   ├── creators.ts           # Creators endpoints
 │   ├── users.ts              # User preferences
 │   ├── youtube.ts            # YouTube preview
 │   └── admin.ts              # Admin operations
 ├── services/
 │   ├── contents.ts           # Content CRUD
 │   ├── comments.ts           # Comment operations
 │   ├── votes.ts              # Voting logic
 │   ├── creators.ts           # Creator operations
 │   ├── subscriptions.ts      # Follow/unfollow
 │   ├── games.ts              # Game operations
 │   ├── video-summarize.ts    # AI summarization
 │   ├── video-extractions.ts  # Extraction tracking
 │   ├── video-preprocessing.ts
 │   ├── parallel-summary-generation.ts
 │   ├── ai.ts                 # AI provider abstraction
 │   └── ...
 ├── errors/
 │   └── video-summarize.ts    # Custom error classes
 ├── utils/
 │   ├── ai-errors.ts          # AI error detection
 │   ├── youtube-url.ts        # URL parsing
 │   ├── transcript-parser.ts  # Transcript parsing
 │   ├── llm-response-normalizer.ts
 │   ├── summary-prompt-builder.ts
 │   └── ...
 ├── types/
 │   ├── summary.ts            # Summary types
 │   └── video-status.ts       # Status types
 └── schemas/
     ├── video.ts              # Video schema
     ├── metadata.ts           # Metadata schema
     └── transcript.ts         # Transcript schema

---
24. ORIGINAL MONOLITHIC KEY IMPLEMENTATION NOTES

 1. Content-Agnostic Design: Use sourceType + externalId composite key, not YouTube-specific fields
 2. Cascade Deletes: Apply carefully to prevent orphaned data
 3. Denormalization: Cache vote counts, comment counts, hotness in contents table
 4. JSONB Metadata: Use for flexible, extensible source-specific data
 5. Hierarchical Comments: Self-referential parentId for threading
 6. Processing Pipeline: Three cache tables (extraction, preprocessing, processing)
 7. Embedded Mode: App can run standalone OR embedded in frontend for SSR