# Base stage
FROM node:16 AS base


# Development stage
FROM base AS development
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start-dev"]

# Production stage
FROM base AS production
COPY package.json .  
RUN npm install --only=production  
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
