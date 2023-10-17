FROM ccw:nx-base AS builder

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /app/builder
COPY . .

RUN export DATABASE_URL=postgresql://postgres:password@<server-ip>:5432/ccw?schema=public && echo $DATABASE_URL && npx prisma generate && npx prisma migrate dev --schema=./libs/prisma-schema/prisma/schema.prisma

RUN npx nx build api ${BUILD_FLAG}

FROM ccw:nx-base

WORKDIR /app
COPY --from=builder /app/builder ./
ENV NODE_ENV=$NODE_ENV
CMD ["node", "./dist/apps/api/main.js"]