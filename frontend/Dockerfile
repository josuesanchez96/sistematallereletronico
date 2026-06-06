FROM node:24-alpine AS build

WORKDIR /app
ARG VITE_API_URL
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV VITE_API_URL=$VITE_API_URL
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit
COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
