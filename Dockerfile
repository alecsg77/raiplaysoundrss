FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json eslint.config.mjs ./
COPY src src
RUN npm run build

FROM base
ENV NODE_ENV=production
RUN apk add --no-cache tini
WORKDIR /usr/src/app
RUN chown node:node .
USER node
COPY --from=builder /usr/src/app/dist/ dist/
EXPOSE 3000
ENTRYPOINT [ "/sbin/tini","--", "node", "dist/server.js" ]