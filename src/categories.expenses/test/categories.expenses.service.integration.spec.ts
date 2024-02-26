import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesExpensesService } from '../categories.expenses.service';
import { PrismaService } from '../../prisma_client/prisma.service';

describe('CategoriesExpensesService', () => {
  let service: CategoriesExpensesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesExpensesService,
        {
          provide: PrismaService,
          useValue: {
            categories_Expenses: {
              create: jest.fn().mockResolvedValue({ id: 1, name: 'Boleto' }),
              findMany: jest.fn().mockResolvedValue([
                { id: 1, name: 'Boleto' },
                { id: 2, name: 'Energia' },
              ]),
              findUnique: jest
                .fn()
                .mockResolvedValue({ id: 1, name: 'Boleto' }),
              update: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Energia',
                updatedAt: new Date('2024-02-23T15:27:09.467Z'),
              }),
              delete: jest.fn().mockResolvedValue({ id: 1, name: 'Boleto' }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesExpensesService>(CategoriesExpensesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category expense', async () => {
    const createCategoryExpenseDto = { name: 'Boleto' };
    const expectedResult = { id: 1, name: 'Boleto' };

    const result = await service.create(createCategoryExpenseDto);

    expect(result).toEqual(expectedResult);
    expect(prisma.categories_Expenses.create).toHaveBeenCalledWith({
      data: createCategoryExpenseDto,
    });
  });
});
