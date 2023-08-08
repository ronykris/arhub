FROM node:19.2-alpine as dependencies
RUN apk add git
WORKDIR /app
RUN mkdir /img
COPY package.json .
RUN npm i
COPY . . 
VOLUME /img
# Build production image
FROM dependencies as builder
ENTRYPOINT ["node", "push.js"]