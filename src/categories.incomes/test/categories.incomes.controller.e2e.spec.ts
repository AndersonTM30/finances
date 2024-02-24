import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CreateCategoriesIncomeDto } from '../dto/create-categories.income.dto';
import { UsersModule } from '../../users/users.module';
import { CategoriesIncomesModule } from '../categories.incomes.module';
import { AuthModule } from '../../auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

describe('CategoriesIncomesController (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const invalidToken = 'slçakjaçljkdahlçkjadçlkhjdfa';
  let createCategoryIncomeDto: CreateCategoriesIncomeDto;
  const newCategoryIncomeName = 'Hora Extra';
  const route = '/categories/incomes';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        CategoriesIncomesModule,
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

    createCategoryIncomeDto = {
      name: 'Salário',
    };
  });

  afterAll(async () => {
    await app.close();
  });

  it('/categories/incomes GET - should return the list of all categories incomes', async () => {
    const response = await request(app.getHttpServer())
      .get(`${route}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('/categories/incomes GET - should return the unauthorized message', async () => {
    const response = await request(app.getHttpServer())
      .get(`${route}`)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/categories/incomes/:id GET - should be return the category of income by id', async () => {
    const id = 1;
    const response = await request(app.getHttpServer())
      .get(`${route}/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  it('/categories/incomes/:id GET - should return the unauthorized message', async () => {
    const id = 1;
    const response = await request(app.getHttpServer())
      .get(`${route}/${id}`)
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/categories/incomes/:id GET - should return a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .get(`${route}/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Not Found');
  });

  it('/categories/incomes/:id DELETE - should delete the catefory income by id', async () => {
    const responseCategoryIncome = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCategoryIncomeDto.name });

    const categoryIncomeId = responseCategoryIncome.body.id;

    const response = await request(app.getHttpServer())
      .delete(`${route}/${categoryIncomeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
  });

  it('/categories/incomes/:id DELETE - It should show a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .delete(`${route}/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Category of income not found');
  });

  it('/categories/incomes/:id PATCH - should update the category income name by id', async () => {
    const responseCategoryIncome = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCategoryIncomeDto.name });

    const categoryIncomeId = responseCategoryIncome.body.id;

    const response = await request(app.getHttpServer())
      .patch(`${route}/${categoryIncomeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: newCategoryIncomeName });

    await request(app.getHttpServer())
      .delete(`${route}/${categoryIncomeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual('Hora Extra');
  });

  it('/categories/incomes/:id PATCH - should return the unauthorized message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .patch(`${route}/${id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ name: newCategoryIncomeName });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('/categories/incomes/:id PATCH - It should show a not found message', async () => {
    const id = 45487;
    const response = await request(app.getHttpServer())
      .patch(`${route}/${id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toEqual('Category of Income not found');
  });

  it('/categories/incomes/:id PATCH - should return the message that name cannot be empty', async () => {
    const responseCategoryIncome = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCategoryIncomeDto.name });

    const categoryIncomeId = responseCategoryIncome.body.id;

    const response = await request(app.getHttpServer())
      .patch(`${route}/${categoryIncomeId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' });

    await request(app.getHttpServer())
      .delete(`${route}/${categoryIncomeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Name is not empty!');
  });

  it('/categories/incomes POST - should return a new category of income', async () => {
    const response = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: createCategoryIncomeDto.name });

    const categoryIncomeId = response.body.id;

    await request(app.getHttpServer())
      .delete(`${route}/${categoryIncomeId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(201);
    expect(response.body.name).toEqual('Salário');
  });

  it('/categories/incomes POST - should return the message that name cannot be empty', async () => {
    const response = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual('Name is not empty');
  });

  it('/categories/incomes POST - should return the message that name cannot be empty', async () => {
    const response = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${invalidToken}`)
      .send({ name: createCategoryIncomeDto.name });

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toEqual('Unauthorized');
  });
});
