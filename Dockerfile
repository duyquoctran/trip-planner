# Multi-stage production Dockerfile for trip-planner
# Builder stage: install deps and run build
# Runtime stage: copy built artifacts and run the app

# -------- BUILDER --------
FROM node:20-alpine AS builder
WORKDIR /app

# Install build dependencies
COPY package.json package-lock.json* ./
RUN npm ci || npm install

# Copy source and run build (build script may only generate config.js)
COPY . .
RUN npm run build || true

# -------- RUNTIME --------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy package files and install only production deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --production || true

# Copy app files from builder
COPY --from=builder /app .

# Default start behavior: try common entrypoints, otherwise print node version.
# Replace or update CMD with your actual start command when available (e.g., "node ./dist/index.js" or "npm start").
CMD ["sh", "-c", "if [ -f ./dist/index.js ]; then exec node ./dist/index.js; elif [ -f ./index.js ]; then exec node ./index.js; elif [ -f ./app.js ]; then exec node ./app.js; else exec node --version; fi"]
