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

  it('should find all categories of expenses', async () => {
    const expectedResult = [
      { id: 1, name: 'Boleto' },
      { id: 2, name: 'Energia' },
    ];

    const result = await service.findAll();
    expect(result).toEqual(expectedResult);
    expect(prisma.categories_Expenses.findMany).toHaveBeenCalled();
  });

  it('should find one category of expense by id', async () => {
    const id = 1;
    const expectedResult = { id: 1, name: 'Boleto' };

    const result = await service.findOne(id);
    expect(result).toEqual(expectedResult);
    expect(prisma.categories_Expenses.findUnique).toHaveBeenCalledWith({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
  });

  it('should update a category of expense by id', async () => {
    const id = 1;
    const categoryExpenseDto = { name: 'Boleto' };
    const expectedResult = {
      id: 1,
      name: 'Energia',
      updatedAt: new Date('2024-02-23T15:27:09.467Z'),
    };

    const result = await service.update(id, categoryExpenseDto);
    expect(result).toEqual(expectedResult);
  });

  it('should remove a category of expense by id', async () => {
    const id = 1;
    const expectedResult = { id: id, name: 'Boleto' };

    const result = await service.remove(id);
    expect(result).toEqual(expectedResult);
    expect(prisma.categories_Expenses.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
