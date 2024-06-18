# Use the official Node.js image as a base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# List files in /app/src to verify
RUN ls -la /app/src

# Expose port 3000 for the React development server
EXPOSE 3000

# Command to run the React development server
CMD ["npm", "start"]
