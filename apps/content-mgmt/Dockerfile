# Content Management Service Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Install dependencies
FROM oven/bun:1.3.3-alpine AS deps

WORKDIR /app

# Copy package files for dependency installation
COPY package.json bun.lock ./
COPY apps/content-mgmt/package.json ./apps/content-mgmt/

# Install dependencies
RUN bun install --frozen-lockfile --production

# Stage 2: Build
FROM oven/bun:1.3.3-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/content-mgmt/node_modules ./apps/content-mgmt/node_modules

# Copy source files
COPY apps/content-mgmt ./apps/content-mgmt

# Stage 3: Production
FROM oven/bun:1.3.3-alpine AS runner

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 contentmgmt

# Copy built application
COPY --from=builder --chown=contentmgmt:nodejs /app/apps/content-mgmt ./apps/content-mgmt
COPY --from=builder --chown=contentmgmt:nodejs /app/node_modules ./node_modules

USER contentmgmt

WORKDIR /app/apps/content-mgmt

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3002/health || exit 1

# Start the application
CMD ["bun", "run", "src/index.ts"]
