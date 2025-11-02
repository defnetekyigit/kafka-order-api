# Stage 1 - Build
FROM node:22-alpine AS builder
WORKDIR /app
USER root

COPY package*.json ./
RUN npm ci

# 🟢 TypeScript'i global olarak yükle (izin sorununu çözer)
RUN npm install -g typescript

COPY . .
RUN npm run build

# Stage 2 - Run
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
EXPOSE 8080
CMD ["node", "dist/app.js"]
