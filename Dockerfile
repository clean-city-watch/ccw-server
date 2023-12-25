FROM node:alpine3.18 as builder
ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .
RUN npm i @nx/nx-linux-x64-musl
RUN npm i
