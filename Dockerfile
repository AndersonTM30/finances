FROM node:18-slim as package

WORKDIR /app

RUN apt update
RUN apt install procps -y
RUN apt install openssl -y
RUN npm install -g prisma

COPY package.json .
# COPY *.lock .
COPY nest-cli.json .
COPY prisma ./prisma/
COPY tsconfig.build.json .
COPY tsconfig.json .
COPY .env ./
ENV TZ=America/Sao_Paulo
RUN npm install

FROM package as build
COPY src ./src
COPY nest-cli.json .
COPY tsconfig.build.json .
COPY tsconfig.json .
RUN npm run build

FROM build as dev
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

EXPOSE 3000
# CMD sh -c "npm run migrate && npm run test && npm run start:dev"
CMD sh -c "npx prisma generate && npx prisma migrate deploy && npm run start:dev"

FROM build as prod
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD [ "npm", "run", "start:prod" ]