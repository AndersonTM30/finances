# Finances Api
Personal finance API aimed at applying concepts of an application using the NestJS framework.

## Technologies
- [NestJS](https://nestjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [Docker](https://www.docker.com/)
- [Postgresql](https://www.postgresql.org/)
- [JWT](https://jwt.io/)
- [Swagger](https://swagger.io/)

## How to run the application:
### Without Docker:
#### Prerequisites:
- Node
- NPM
- Nest CLI
- Postgresql
#### How to run the project:
- Clone the application
- Rename the **.env-example** file and configure the database, private key for JWT authentication, and Node environment (development or production)
- Install the project dependencies:  
```bash
npm install
```
- Start the application in development:
```
npm run start:dev
```
- To run the tests:
```
npm run test
```
- If you want to run in production:
```
npm run start:prod
```
- To test the API routes in Swagger, access the URL: http://localhost:300/api

### With Docker:
#### Prerequisites:
 - Docker
 - Docker Compose

#### How to run the project:
- Clone the application
- Rename the **.env-example** file and configure the database, private key for JWT authentication, and Node environment (development or production)
- Create the database and application containers:
```
docker compose up -d
```
- To test the API routes in Swagger, access the URL: http://localhost:300/api

## Status
In progress