import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { CreateExpenseDto } from '../dto/create-expense.dto';
import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../../auth/auth.module';
import { UsersModule } from '../../users/users.module';
import { ExpensesModule } from '../expenses.module';

describe('ExpensesController', () => {
  let app: INestApplication;
  let token: string;
  let createExpenseDto: CreateExpenseDto;
  const invalidToken = 'slçakjaçljkdahlçkjadçlkhjdfa';
  const route = '/expenses';
  const updateExpenseDto = {
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
        ExpensesModule,
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

    createExpenseDto = {
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

  it('/expenses GET - should return the list of all expenses', async () => {
    const response = await request(app.getHttpServer())
      .get(`${route}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('/expenses GET - should return the unauthorized message', async () => {
    const response = await request(app.getHttpServer())
      .get(`${route}`)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/expenses/:id GET - should be return expense by id', async () => {
    const responseExpense = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send(createExpenseDto);

    const expenseId = responseExpense.body.id;

    const response = await request(app.getHttpServer())
      .get(`${route}/${expenseId}`)
      .set('Authorization', `Bearer ${token}`);

    await request(app.getHttpServer())
      .delete(`${route}/${expenseId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  it('/expenses/:id GET - should return the unauthorized message', async () => {
    const id = 1;
    const response = await request(app.getHttpServer())
      .get(`${route}/${id}`)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/expenses/:id GET - should return a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .get(`${route}/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Not Found');
  });

  it('/expenses/:id DELETE - should delete the catefory expense by id', async () => {
    const responseExpense = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send(createExpenseDto);

    const expenseId = responseExpense.body.id;

    const response = await request(app.getHttpServer())
      .delete(`${route}/${expenseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  it('/expenses/:id PATCH - should update the expense by id', async () => {
    const responseExpense = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send(createExpenseDto);

    const expenseId = responseExpense.body.id;

    const response = await request(app.getHttpServer())
      .patch(`${route}/${expenseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateExpenseDto);

    await request(app.getHttpServer())
      .delete(`${route}/${expenseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.description).toEqual('Pagamento de Luz');
  });

  it('/expenses/:id PATCH - should return the unauthorized message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .patch(`${route}/${id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(createExpenseDto);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/expenses/:id PATCH - It should show a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .patch(`${route}/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Expense not found');
  });

  it('/expenses POST - should return a new expense', async () => {
    const response = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send(createExpenseDto);

    const categoryExpenseId = response.body.id;

    await request(app.getHttpServer())
      .delete(`${route}/${categoryExpenseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.description).toEqual('Pagamento de Boleto');
  });

  it('/expenses POST - should return the message that date cannot be empty', async () => {
    const createExpenseFieldEmpty = {
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
      .send(createExpenseFieldEmpty);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Date is not empty');
  });

  it('/expenses POST - should return the message unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send(createExpenseDto);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });
});
