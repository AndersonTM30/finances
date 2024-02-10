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
    const createUsersDto: CreateUsersDto = {
      username: 'Anderson',
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
});
