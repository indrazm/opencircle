# Build stage
FROM node:18-alpine AS builder

# Install tools needed for environment variable processing
RUN apk add --no-cache grep

# Set working directory
WORKDIR /app

# Define build argument for API URL (fallback to .env.prod)
ARG VITE_API_URL
# If VITE_API_URL is not provided as build arg, read from .env.prod
RUN if [ -z "$VITE_API_URL" ] && [ -f .env.prod ]; then \
    export VITE_API_URL=$(grep -v '^#' .env.prod | grep VITE_API_URL | cut -d'=' -f2); \
    fi
ENV VITE_API_URL=${VITE_API_URL:-http://localhost:8000/api}

# Copy workspace files first, including .env.prod if it exists
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY .env.prod* ./
COPY packages/ ./packages/
COPY apps/admin/package.json ./apps/admin/

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy UI source and build it first
COPY packages/ui/src ./packages/ui/src/
COPY packages/ui/package.json ./packages/ui/
WORKDIR /app/packages/ui
RUN pnpm build

# Copy admin source code
WORKDIR /app
COPY apps/admin/src ./apps/admin/src/
COPY apps/admin/index.html ./apps/admin/
COPY apps/admin/vite.config.ts ./apps/admin/
COPY apps/admin/tsconfig*.json ./apps/admin/

# Build the application
WORKDIR /app/apps/admin
# Pass the build argument to the build command
ARG VITE_API_URL
RUN if [ -z "$VITE_API_URL" ] && [ -f ../../.env.prod ]; then \
    export VITE_API_URL=$(grep -v '^#' ../../.env.prod | grep VITE_API_URL | cut -d'=' -f2); \
    fi && \
    VITE_API_URL=${VITE_API_URL:-http://localhost:8000/api} pnpm build

# Production stage
FROM nginx:alpine AS production

# Copy custom nginx config
COPY apps/admin/nginx.conf /etc/nginx/nginx.conf

# Copy built assets from builder stage
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
