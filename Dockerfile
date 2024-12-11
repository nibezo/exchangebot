# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]