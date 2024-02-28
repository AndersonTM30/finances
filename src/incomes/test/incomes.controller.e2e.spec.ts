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
  let createcategoryIncomeDto = { name: 'Salário' };

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
      categoryId: 48,
      userId: 84,
      currencyId: 5,
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
    // console.log('Create Income DTO ', createIncomeDto);
    // const resonseCreateCategoryIncome = await request(app.getHttpServer())
    //   .post('/categories/incomes')
    //   .send(createcategoryIncomeDto)
    //   .set('Authorization', `Bearer ${token}`);
    // createIncomeDto.categoryId = resonseCreateCategoryIncome.body.id;
    // console.log(createIncomeDto.categoryId);

    const responseIncome = await request(app.getHttpServer())
      .post(route)
      .set('Authorization', `Bearer ${token}`)
      .send(createIncomeDto);
    console.log('Response: ', responseIncome.body);

    const incomeId = responseIncome.body.id;

    const response = await request(app.getHttpServer())
      .get(`${route}/${incomeId}`)
      .set('Authorization', `Bearer ${token}`);

    await request(app.getHttpServer())
      .delete(`${route}/${incomeId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
  });
});
