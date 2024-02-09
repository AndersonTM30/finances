import { Test } from '@nestjs/testing';
import { UsersModule } from '../../users.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
// import { UsersService } from '../../../users/users.service';
import { CreateUsersDto } from '../../../users/dto/create.users.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  // let usersService: UsersService;

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

  it('/POST users', async () => {
    const createUsersDto: CreateUsersDto = {
      username: 'Anderson',
      password: '1234',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(createUsersDto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toEqual(createUsersDto.username);
  });

  it('/users POST - password should not be empty', async () => {
    const invalidUserData = {
      username: 'Anderson',
      password: '',
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .send(invalidUserData);

    expect(response.status).toBe(400);
    expect(response.body.message).toContain('password should not be empty');
  });
});
