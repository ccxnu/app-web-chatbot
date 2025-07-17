# BUILD
FROM node:22-slim AS build

ENV DIR=/app
WORKDIR $DIR

COPY package*.json ./

RUN npm ci

# Copiar los archivos de la aplicación
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY src src
COPY public public

RUN npm run build && npm prune --production && npm cache clean --force

# PRODUCTION
FROM nginx:alpine-slim AS production

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
