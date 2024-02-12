import { Test } from '@nestjs/testing';
import { UsersModule } from '../../users.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateUsersDto } from '../../../users/dto/create.users.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
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
});
