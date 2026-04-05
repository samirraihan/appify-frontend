FROM node:18

WORKDIR /app

# Copy only package files first (for cache optimization)
COPY package*.json ./

RUN npm install

# Now copy rest (excluding node_modules via .dockerignore)
COPY . .

# Build app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]