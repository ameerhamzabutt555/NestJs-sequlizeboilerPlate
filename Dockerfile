FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

ENV NODE_ENV test

RUN npx sequelize-cli db:migrate --env test
RUN npx sequelize-cli db:seed:all --env test

RUN npm run build

EXPOSE 5000
CMD [ "npm", "start" ]
