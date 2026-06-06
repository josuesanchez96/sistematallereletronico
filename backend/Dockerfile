FROM node:24-bookworm-slim AS build

WORKDIR /app
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV NODE_OPTIONS="--max-old-space-size=1024"
COPY package*.json ./
COPY scripts ./scripts
RUN npm ci --include=dev --ignore-scripts --prefer-offline --no-audit
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN node scripts/patch-whatsapp-web.js
RUN npm run build

FROM node:24-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV CHROME_EXECUTABLE_PATH=/usr/bin/chromium

RUN apt-get update \
  && apt-get install -y --no-install-recommends chromium ca-certificates fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts --prefer-offline --no-audit
RUN npm install -g ts-node typescript
COPY scripts ./scripts
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/scripts ./scripts

RUN npx prisma generate

EXPOSE 3000
CMD ["sh", "-c", "npx prisma db push && npm run security:db:prod && npm run prisma:seed && node dist/main.js"]
