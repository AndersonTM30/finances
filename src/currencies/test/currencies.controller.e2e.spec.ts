import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { UsersModule } from '../../users/users.module';
import { AuthModule } from '../../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CurrenciesModule } from '../currencies.module';
import { CreateCurrencyDto } from '../dto/create-currency.dto';

describe('CurrenciesController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const invalidToken = 'slçakjaçljkdahlçkjadçlkhjdfa';
  let createCurrencyDto: CreateCurrencyDto;
  const newCurrencyName = 'Cartão';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        CurrenciesModule,
        AuthModule,
        PassportModule.register({
          defaultStrategy: 'jwt',
        }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'Anderson', password: '12341245' });

    token = loginResponse.body.accessToken;

    createCurrencyDto = {
      name: 'Dinheiro',
    };
  });

  afterAll(async () => {
    await app.close();
  });

  it('/currencies GET - should return the list of all currencies', async () => {
    const response = await request(app.getHttpServer())
      .get('/currencies')
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('/currencies GET - should return the unauthorized message', async () => {
    const response = await request(app.getHttpServer())
      .get('/currencies')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/currencies/:id GET - should return the unauthorized message', async () => {
    const id = 1;
    const response = await request(app.getHttpServer())
      .get(`/currencies/${id}`)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/currencies/:id GET - should be return the currency by id', async () => {
    const responseCurrency = await request(app.getHttpServer())
      .post('/currencies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCurrencyDto.name });

    const currencyId = responseCurrency.body.id;
    const response = await request(app.getHttpServer())
      .get(`/currencies/${currencyId}`)
      .set('Authorization', `Bearer ${token}`);

    await request(app.getHttpServer())
      .delete(`/currencies/${currencyId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  it('/currencies/:id GET - should return a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .get(`/currencies/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Not Found');
  });

  it('/currencies/:id DELETE - should delete the currency by id', async () => {
    const responseCurrency = await request(app.getHttpServer())
      .post('/currencies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCurrencyDto.name });

    const currencyId = responseCurrency.body.id;

    const response = await request(app.getHttpServer())
      .delete(`/currencies/${currencyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  it('/currencies/:id DELETE - It should show a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .delete(`/currencies/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Currency not found');
  });

  it('/currencies/:id PATCH - should update the currency name by id', async () => {
    const responseCurrency = await request(app.getHttpServer())
      .post('/currencies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCurrencyDto.name });

    const currencyId = responseCurrency.body.id;

    const response = await request(app.getHttpServer())
      .patch(`/currencies/${currencyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: newCurrencyName });

    await request(app.getHttpServer())
      .delete(`/currencies/${currencyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual('Cartão');
  });

  it('/currencies/:id PATCH - should return the unauthorized message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .patch(`/currencies/${id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ name: newCurrencyName });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/currencies/:id PATCH - It should show a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .patch(`/currencies/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Currency not found');
  });

  it('/currencies/:id PATCH - should return the message that name cannot be empty', async () => {
    const responseCurrency = await request(app.getHttpServer())
      .post('/currencies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCurrencyDto.name });

    const currencyId = responseCurrency.body.id;

    const response = await request(app.getHttpServer())
      .patch(`/currencies/${currencyId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' });

    await request(app.getHttpServer())
      .delete(`/currencies/${currencyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Name is not empty!');
  });

  it('/currencies POST - should return a new currency', async () => {
    const response = await request(app.getHttpServer())
      .post('/currencies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCurrencyDto.name });

    const currencyId = response.body.id;

    await request(app.getHttpServer())
      .delete(`/currencies/${currencyId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toEqual('Dinheiro');
  });

  it('/currencies POST - should return the message that name cannot be empty', async () => {
    const response = await request(app.getHttpServer())
      .post('/currencies')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Name is not empty!');
  });

  it('/currencies POST - should return the message unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .post('/currencies')
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ name: createCurrencyDto.name });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });
});
