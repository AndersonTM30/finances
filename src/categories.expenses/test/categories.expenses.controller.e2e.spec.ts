import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateCategoriesExpenseDto } from '../dto/create-categories.expense.dto';
import { UsersModule } from '../../users/users.module';
import { CategoriesExpensesModule } from '../categories.expenses.module';
import { AuthModule } from '../../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

describe('CategoriesExpensesController', () => {
  let app: INestApplication;
  let token: string;
  const invalidToken = 'slçakjaçljkdahlçkjadçlkhjdfa';
  let createCategoryExpenseDto: CreateCategoriesExpenseDto;
  const newCategoryExpenseName = 'Energia';
  const route = '/categories/expenses';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        CategoriesExpensesModule,
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

    createCategoryExpenseDto = {
      name: 'Water bill',
    };
  });

  afterAll(async () => {
    await app.close();
  });

  it('/categories/expenses GET - should return the list of all categories expenses', async () => {
    const response = await request(app.getHttpServer())
      .get(`${route}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('/categories/expenses GET - should return the unauthorized message', async () => {
    const response = await request(app.getHttpServer())
      .get(`${route}`)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/categories/expenses/:id GET - should be return the category of expense by id', async () => {
    const responseCategoryExpense = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCategoryExpenseDto.name });

    const categoryExpenseId = responseCategoryExpense.body.id;
    const response = await request(app.getHttpServer())
      .get(`${route}/${categoryExpenseId}`)
      .set('Authorization', `Bearer ${token}`);

    await request(app.getHttpServer())
      .delete(`${route}/${categoryExpenseId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });

  it('/categories/expenses/:id GET - should return the unauthorized message', async () => {
    const id = 1;
    const response = await request(app.getHttpServer())
      .get(`${route}/${id}`)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/categories/expenses/:id GET - should return a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .get(`${route}/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Not Found');
  });

  it('/categories/expenses/:id DELETE - should delete the catefory expense by id', async () => {
    const responseCategoryExpense = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCategoryExpenseDto.name });

    const categoryExpenseId = responseCategoryExpense.body.id;

    const response = await request(app.getHttpServer())
      .delete(`${route}/${categoryExpenseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  it('/categories/expenses/:id DELETE - It should show a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .delete(`${route}/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Category of expense not found');
  });

  it('/categories/expenses/:id PATCH - should update the category income name by id', async () => {
    const responseCategoryExpense = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCategoryExpenseDto.name });

    const categoryExpenseId = responseCategoryExpense.body.id;

    const response = await request(app.getHttpServer())
      .patch(`${route}/${categoryExpenseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: newCategoryExpenseName });

    await request(app.getHttpServer())
      .delete(`${route}/${categoryExpenseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual('Energia');
  });

  it('/categories/expenses/:id PATCH - should return the unauthorized message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .patch(`${route}/${id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ name: newCategoryExpenseName });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/categories/expenses/:id PATCH - It should show a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .patch(`${route}/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Category of Expense not found');
  });

  it('/categories/expenses/:id PATCH - should return the message that name cannot be empty', async () => {
    const responseCategoryExpense = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCategoryExpenseDto.name });

    const categoryExpenseId = responseCategoryExpense.body.id;

    const response = await request(app.getHttpServer())
      .patch(`${route}/${categoryExpenseId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' });

    await request(app.getHttpServer())
      .delete(`${route}/${categoryExpenseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Name is not empty!');
  });

  it('/categories/expenses POST - should return a new category of expense', async () => {
    const response = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCategoryExpenseDto.name });

    const categoryExpenseId = response.body.id;

    await request(app.getHttpServer())
      .delete(`${route}/${categoryExpenseId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toEqual('Water bill');
  });

  it('/categories/expenses POST - should return the message that name cannot be empty', async () => {
    const response = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Name is not empty');
  });

  it('/categories/expenses POST - should return the message unauthorized', async () => {
    const response = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ name: createCategoryExpenseDto.name });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });
});
