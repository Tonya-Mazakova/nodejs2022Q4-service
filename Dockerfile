# Base image
FROM node:alpine as base

# Create app directory
WORKDIR /src

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

FROM base AS dev

CMD [ "npm", "run", "start:dev" ]

FROM base AS prod

# Creates a "dist" folder with the production build
RUN npm run build

EXPOSE ${PORT}

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
