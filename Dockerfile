# Minimal Dockerfile for trip-planner
# Builds the Node.js app and produces a production image suitable for scanning.

FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies (prefer package-lock if present)
COPY package.json package-lock.json* ./

# Use npm ci for reproducible installs when lockfile exists. Fall back to npm install if it fails.
RUN npm ci --omit=dev || npm install --production

# Copy application source
COPY . .

# Run build script if present; ignore failure so Docker build doesn't fail for repos without a build step
RUN npm run build || true

# Set environment
ENV NODE_ENV=production

# Image is only used for scanning in CI; no long-running process is required by default.
# Default command prints Node version (Trivy doesn't need the container to run).
CMD ["node", "--version"]
