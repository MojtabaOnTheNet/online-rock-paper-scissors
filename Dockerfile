# Frontend build stage
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Backend stage
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/dist /app/public

# Expose backend port
EXPOSE 8000

# Start backend
CMD ["npm", "start"]
