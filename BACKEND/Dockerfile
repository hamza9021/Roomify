FROM node:18-alpine as build

# Install dependencies for bcrypt
RUN apk add --no-cache python3 make g++ 

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

CMD ["npm", "run", "dev"]
