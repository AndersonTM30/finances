import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../../auth/auth.service';
import { AuthController } from '../../../auth/auth.controller';
import { LoginDto } from '../../../auth/dto/login.dto';
import * as request from 'supertest';

describe('AuthController', () => {
  let app: INestApplication;
  let authService: AuthService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({ accessToken: 'testToken' }),
          },
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    authService = module.get<AuthService>(AuthService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  it('should return an access token if login is successful', async () => {
    const loginDto: LoginDto = {
      username: 'Anderson',
      password: 'testPassword',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body.accessToken).toBe('testToken');
    expect(authService.login).toHaveBeenCalledWith(
      loginDto.username,
      loginDto.password,
    );
  });
});
