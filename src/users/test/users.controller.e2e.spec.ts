import { Test } from '@nestjs/testing';
import { UsersModule } from '../users.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUsersDto } from '../dto/create.users.dto';
import { randomUUID } from 'crypto';
import { AuthModule } from '../../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let createUsersDto: CreateUsersDto;

  const updatePasswordDto = {
    password: '123456789',
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        UsersModule,
        AuthModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60S' },
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const uuid = randomUUID();
    const username = 'Anderson' + uuid;
    createUsersDto = {
      username: username,
      password: '12341245',
    };
  });

  afterAll(async () => {
    await app.close();
  });

  it('/users POST - should return the new user created', async () => {
    const salt = Math.floor(Math.random() * (99 - 20 + 10)) + 1;
    const secondSalt = Math.floor(Math.random() * (999 - 20 + 10)) + 1;
    const thirdSalt = Math.floor(Math.random() * (9999 - 20 + 10)) + 1;
    const username = 'Anderson' + salt + '_' + secondSalt + '_' + thirdSalt;
    const createUsersDto: CreateUsersDto = {
      username: username,
      password: '12341245',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUsersDto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toEqual(createUsersDto.username);
  });

  it('/users POST - must return the exception message password must be longer than or equal to 8 characters', async () => {
    const createUsersDto: CreateUsersDto = {
      username: 'Anderson',
      password: '12341',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUsersDto);

    expect(response.status).toBe(400);
    expect(response.body.message[0].constraints.minLength).toContain(
      'password must be longer than or equal to 8 characters',
    );
  });

  it('/users POST - should return the message username cannot be empty', async () => {
    const createUsersDto: CreateUsersDto = {
      username: '',
      password: '123',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUsersDto);

    expect(response.status).toBe(400);
    expect(response.body.message[0].constraints.isNotEmpty).toContain(
      'username should not be empty',
    );
  });

  it('/users POST - should return the message password cannot be empty', async () => {
    const createUsersDto: CreateUsersDto = {
      username: 'Anderson',
      password: '',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUsersDto);

    expect(response.status).toBe(400);
    expect(response.body.message[0].constraints.isNotEmpty).toContain(
      'password should not be empty',
    );
  });

  it('/users POST - should return the error message if username or password are empty', async () => {
    const createUsersDto: CreateUsersDto = {
      username: '',
      password: '',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUsersDto);

    expect(response.status).toBe(400);
    expect(response.body.message[0].constraints.isNotEmpty).toContain(
      'username should not be empty',
    );
    expect(response.body.message[1].constraints.isNotEmpty).toContain(
      'password should not be empty',
    );
  });

  it('/users POST - should return the message of username already registered', async () => {
    const createUsersDto: CreateUsersDto = {
      username: 'Anderson',
      password: '12341245',
    };

    let response = await request(app.getHttpServer())
      .post('/users')
      .send(createUsersDto);

    response = await request(app.getHttpServer())
      .post('/users')
      .send(createUsersDto);

    expect(response.status).toBe(409);
    expect(response.body.message).toContain('Conflict');
  });

  it('/users PATCH - should be update password of the user by id', async () => {
    const createUser = await request(app.getHttpServer())
      .post('/users')
      .send(createUsersDto);

    const userId = createUser.body.id;

    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: createUsersDto.username,
        password: createUsersDto.password,
      });

    const token = authResponse.body.accessToken;

    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatePasswordDto);

    expect(response.status).toBe(200);
    expect(response.body.message).toEqual('User successfully updated!');

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteResponse.status).toBe(200);
  });

  it('/users PATCH - should not update user password if the field is empty', async () => {
    const createUser = await request(app.getHttpServer())
      .post('/users')
      .send(createUsersDto);

    const userId = createUser.body.id;

    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: createUsersDto.username,
        password: createUsersDto.password,
      });

    const token = authResponse.body.accessToken;
    const updatePasswordDto = '';
    const response = await request(app.getHttpServer())
      .patch(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatePasswordDto);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Bad Request');

    const deleteResponse = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteResponse.status).toBe(200);
  });

  it('/users DELETE - should be delete the user by id', async () => {
    const createUser = await request(app.getHttpServer())
      .post('/users')
      .send(createUsersDto);

    const userId = createUser.body.id;

    const authResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: createUsersDto.username,
        password: createUsersDto.password,
      });

    const token = authResponse.body.accessToken;

    const response = await request(app.getHttpServer())
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
