# docker/backend.Dockerfile

FROM node:24-alpine

# Outil curl pour healthcheck
RUN apk add --no-cache curl

# Utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Dépendances
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Code
COPY backend .

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 8000

# Healthcheck
HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD curl -fs http://localhost:8000/health || exit 1

CMD ["node", "server.js"]
