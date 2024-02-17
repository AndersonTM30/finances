import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
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
      password: '12341245',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Login efetuado com sucesso!',
    );
    expect(response.body.accessToken).toBeDefined();
  });
});
