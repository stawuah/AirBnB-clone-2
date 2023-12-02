# Use an official Node.js runtime as the base image
FROM node:21-alpine3.17

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json /app/

# Copy the rest of the application files
COPY  . /app/

# Install dependencies
RUN npm install

# Suggest a volume for data persistence
VOLUME /app/


# Define the command to run your application
CMD ["npm" ,"start"]
# ENTRYPOINT ["sh"]
