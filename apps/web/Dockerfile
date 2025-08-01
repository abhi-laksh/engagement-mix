FROM node:22-alpine

WORKDIR /app

# Install pnpm and necessary dependencies
RUN apk add --no-cache curl && \
    npm install -g pnpm

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=development
ENV HOSTNAME=0.0.0.0

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || curl -f http://localhost:3000 || exit 1

# Start the application in development mode
CMD ["pnpm", "dev", "--hostname", "0.0.0.0"]