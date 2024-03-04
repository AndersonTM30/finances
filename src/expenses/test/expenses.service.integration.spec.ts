import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from '../expenses.service';
import { PrismaService } from '../../prisma_client/prisma.service';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: PrismaService,
          useValue: {
            expenses: {
              create: jest.fn().mockResolvedValue({
                id: 1,
                description: 'Pagamento de Boleto',
                categoryId: 1,
                userId: 1,
                currencyId: 1,
                date: '2024-02-27T10:08:00.777Z',
                value: 250.0,
              }),
              findMany: jest.fn().mockResolvedValue([
                {
                  id: 1,
                  description: 'Pagamento de Boleto',
                  date: '2024-02-27T10:08:00.777Z',
                  value: 250.0,
                },
                {
                  id: 2,
                  description: 'Conta de Luz',
                  date: '2024-02-27T10:08:00.777Z',
                  value: 200.0,
                },
              ]),
              findUnique: jest.fn().mockResolvedValue({
                id: 1,
                description: 'Pagamento de Boleto',
                date: '2024-02-27T10:08:00.777Z',
                value: 250.0,
              }),
              update: jest.fn().mockResolvedValue({
                id: 1,
                description: 'Conta de Luz',
                categoryId: 1,
                userId: 1,
                currencyId: 1,
                date: '2024-02-27T10:08:00.777Z',
                value: 260.0,
                updatedAt: new Date('2024-02-27T10:08:00.777Z'),
              }),
              delete: jest.fn().mockResolvedValue({
                id: 1,
                description: 'Pagamento de Boleto',
                date: '2024-02-27T10:08:00.777Z',
                value: 250.0,
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create a new expense', async () => {
    const createExpenseDto = {
      description: 'Pagamento de Boleto',
      categoryId: 1,
      userId: 1,
      currencyId: 1,
      date: '2024-02-27T10:08:00.777Z',
      value: 250.0,
    };

    const expectedResult = {
      id: 1,
      description: 'Pagamento de Boleto',
      categoryId: 1,
      userId: 1,
      currencyId: 1,
      date: '2024-02-27T10:08:00.777Z',
      value: 250.0,
    };

    const result = await service.create(createExpenseDto);

    expect(result).toEqual(expectedResult);
    expect(prisma.expenses.create).toHaveBeenCalledWith({
      data: createExpenseDto,
    });
  });

  it('should find all expenses', async () => {
    const expectedResult = [
      {
        id: 1,
        description: 'Pagamento de Boleto',
        date: '2024-02-27T10:08:00.777Z',
        value: 250.0,
      },
      {
        id: 2,
        description: 'Conta de Luz',
        date: '2024-02-27T10:08:00.777Z',
        value: 200.0,
      },
    ];

    const result = await service.findAll();
    expect(result).toEqual(expectedResult);
    expect(prisma.expenses.findMany).toHaveBeenCalled();
  });

  it('should be find one expense by id', async () => {
    const id = 1;
    const expectedResult = {
      id: 1,
      description: 'Pagamento de Boleto',
      date: '2024-02-27T10:08:00.777Z',
      value: 250.0,
    };

    const result = await service.findOne(id);
    expect(result).toEqual(expectedResult);
    expect(prisma.expenses.findUnique).toHaveBeenCalledWith({
      where: { id },
      select: {
        id: true,
        description: true,
        date: true,
        value: true,
      },
    });
  });

  it('should be update a expense by id', async () => {
    const id = 1;
    const incomeDto = {
      description: 'Pagamento de Boleto',
      categoryId: 1,
      userId: 1,
      currencyId: 1,
      date: '2024-02-27T10:08:00.777Z',
      value: 260.0,
    };

    const expectedResult = {
      id: 1,
      description: 'Conta de Luz',
      categoryId: 1,
      userId: 1,
      currencyId: 1,
      date: '2024-02-27T10:08:00.777Z',
      value: 260.0,
      updatedAt: new Date('2024-02-27T10:08:00.777Z'),
    };

    const result = await service.update(id, incomeDto);
    expect(result).toEqual(expectedResult);
  });

  it('should be remove a expense by id', async () => {
    const id = 1;
    const expectedResult = {
      id: 1,
      description: 'Pagamento de Boleto',
      date: '2024-02-27T10:08:00.777Z',
      value: 250.0,
    };

    const result = await service.remove(id);

    expect(result).toEqual(expectedResult);
    expect(prisma.expenses.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
