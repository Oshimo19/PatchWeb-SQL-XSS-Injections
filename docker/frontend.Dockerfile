# docker/frontend.Dockerfile

FROM node:24-alpine

# Utilisateur non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Dépendances (install déterministe)
COPY frontend/my-app/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Code source
COPY frontend/my-app .

RUN chown -R appuser:appgroup /app
USER appuser

# React doit écouter sur toutes les interfaces en Docker
ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]
