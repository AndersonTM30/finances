import { Test, TestingModule } from '@nestjs/testing';
import { IncomesService } from '../incomes.service';
import { PrismaService } from '../../prisma_client/prisma.service';
import { NotEmptyField } from '../validations/not.empty.field';

describe('IncomesService (integration)', () => {
  let service: IncomesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncomesService,
        NotEmptyField,
        {
          provide: PrismaService,
          useValue: {
            incomes: {
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

    service = module.get<IncomesService>(IncomesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create a new income', async () => {
    const createIncomeDto = {
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

    const result = await service.create(createIncomeDto);

    expect(result).toEqual(expectedResult);
    expect(prisma.incomes.create).toHaveBeenCalledWith({
      data: createIncomeDto,
    });
  });

  it('should find all incomes', async () => {
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
    expect(prisma.incomes.findMany).toHaveBeenCalled();
  });

  it('should be find one income by id', async () => {
    const id = 1;
    const expectedResult = {
      id: 1,
      description: 'Pagamento de Boleto',
      date: '2024-02-27T10:08:00.777Z',
      value: 250.0,
    };

    const result = await service.findOne(id);
    expect(result).toEqual(expectedResult);
    expect(prisma.incomes.findUnique).toHaveBeenCalledWith({
      where: { id },
      select: {
        id: true,
        description: true,
        date: true,
        value: true,
      },
    });
  });

  it('should be update a income by id', async () => {
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

  it('should be remove a income by id', async () => {
    const id = 1;
    const expectedResult = {
      id: 1,
      description: 'Pagamento de Boleto',
      date: '2024-02-27T10:08:00.777Z',
      value: 250.0,
    };

    const result = await service.remove(id);

    expect(result).toEqual(expectedResult);
    expect(prisma.incomes.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
