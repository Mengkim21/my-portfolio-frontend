# Uses node 24
FROM node:24

# Create directory app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app into container
COPY . .
RUN npm run build

# Start the app
ENV HOST=0.0.0.0
EXPOSE 3000

CMD [ "npm", "start" ]