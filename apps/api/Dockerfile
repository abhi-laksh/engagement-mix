FROM node:22

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json .
COPY pnpm-lock.yaml .

RUN pnpm fetch

# Install all dependencies (including dev dependencies for building)
RUN pnpm install

# Copy source code
COPY . .

# Build the application (with explicit output directory)
RUN pnpm run build

# Verify the build output exists
RUN ls -la dist/

# Expose port
EXPOSE ${PORT}

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:${PORT}/health', (r) => {if (r.statusCode !== 200) throw new Error()})"

# Start the application
CMD ["pnpm", "start:prod"]
