import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CreateIncomeDto } from '../dto/create-income.dto';
import { UsersModule } from '../../users/users.module';
import { IncomesModule } from '../incomes.module';
import { AuthModule } from '../../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import * as request from 'supertest';

describe('IncomesController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let createIncomeDto: CreateIncomeDto;
  const invalidToken = 'slçakjaçljkdahlçkjadçlkhjdfa';
  const route = '/incomes';
  const updateIncomeDto = {
    description: 'Pagamento de Luz',
    categoryId: 1,
    userId: 1,
    currencyId: 1,
    date: '2024-02-27T10:08:00.777Z',
    value: 200.0,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        IncomesModule,
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

    createIncomeDto = {
      description: 'Pagamento de Boleto',
      categoryId: 1,
      userId: 1,
      currencyId: 1,
      date: '2024-02-27T10:08:00.777Z',
      value: 260.0,
    };
  });

  afterAll(async () => {
    await app.close();
  });

  it('/incomes GET - should return the list of all incomes', async () => {
    const response = await request(app.getHttpServer())
      .get(`${route}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('/incomes GET - should return the unauthorized message', async () => {
    const response = await request(app.getHttpServer())
      .get(`${route}`)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/incomes/:id GET - should be return income by id', async () => {
    const responseIncome = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send(createIncomeDto);

    const incomeId = responseIncome.body.id;

    const response = await request(app.getHttpServer())
      .get(`${route}/${incomeId}`)
      .set('Authorization', `Bearer ${token}`);

    await request(app.getHttpServer())
      .delete(`${route}/${incomeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  it('/incomes/:id GET - should return the unauthorized message', async () => {
    const id = 1;
    const response = await request(app.getHttpServer())
      .get(`${route}/${id}`)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/incomes/:id GET - should return a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .get(`${route}/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Not Found');
  });

  it('/incomes/:id DELETE - should delete the catefory income by id', async () => {
    const responseIncome = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send(createIncomeDto);

    const incomeId = responseIncome.body.id;

    const response = await request(app.getHttpServer())
      .delete(`${route}/${incomeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  it('/incomes/:id PATCH - should update the income by id', async () => {
    const responseIncome = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send(createIncomeDto);

    const incomeId = responseIncome.body.id;

    const response = await request(app.getHttpServer())
      .patch(`${route}/${incomeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateIncomeDto);

    await request(app.getHttpServer())
      .delete(`${route}/${incomeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.description).toEqual('Pagamento de Luz');
  });

  it('/incomes/:id PATCH - should return the unauthorized message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .patch(`${route}/${id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(createIncomeDto);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/incomes/:id PATCH - It should show a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .patch(`${route}/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Income not found');
  });

  it('/incomes POST - should return a new income', async () => {
    const response = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send(createIncomeDto);

    const categoryIncomeId = response.body.id;

    await request(app.getHttpServer())
      .delete(`${route}/${categoryIncomeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.description).toEqual('Pagamento de Boleto');
  });

  it('/categories/incomes POST - should return the message that date cannot be empty', async () => {
    const createIncomeFieldEmpty = {
      description: 'Pagamento de Boleto',
      categoryId: 1,
      userId: 1,
      currencyId: 1,
      date: '',
      value: 260.0,
    };
    const response = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send(createIncomeFieldEmpty);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Date is not empty');
  });

  it('/incomes POST - should return the message unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(createIncomeDto);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });
});
