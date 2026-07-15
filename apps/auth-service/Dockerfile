# Auth Service Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Install dependencies
FROM oven/bun:1.3.3-alpine AS deps

WORKDIR /app

# Copy package files for dependency installation
COPY package.json bun.lock ./
COPY packages/config/package.json ./packages/config/
COPY packages/shared/package.json ./packages/shared/
COPY packages/typescript-config/package.json ./packages/typescript-config/
COPY apps/auth-service/package.json ./apps/auth-service/

# Install dependencies
RUN bun install --frozen-lockfile --production

# Stage 2: Build
FROM oven/bun:1.3.3-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/config/node_modules ./packages/config/node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/apps/auth-service/node_modules ./apps/auth-service/node_modules

# Copy source files
COPY packages/config ./packages/config
COPY packages/shared ./packages/shared
COPY packages/typescript-config ./packages/typescript-config
COPY apps/auth-service ./apps/auth-service

# Stage 3: Production
FROM oven/bun:1.3.3-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 authservice

# Copy built application
COPY --from=builder --chown=authservice:nodejs /app/packages ./packages
COPY --from=builder --chown=authservice:nodejs /app/apps/auth-service ./apps/auth-service
COPY --from=builder --chown=authservice:nodejs /app/node_modules ./node_modules

USER authservice

WORKDIR /app/apps/auth-service

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD ["bun", "-e", "fetch(\"http://localhost:3001/health\").then(r => r.ok ? process.exit(0) : process.exit(1)).catch(() => process.exit(1))"]

# Start the application
CMD ["bun", "run", "src/index.ts"]
