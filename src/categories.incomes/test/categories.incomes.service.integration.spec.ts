import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesIncomesService } from '../categories.incomes.service';
import { PrismaService } from '../../prisma_client/prisma.service';

describe('CategoriesIncomesService', () => {
  let service: CategoriesIncomesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesIncomesService,
        {
          provide: PrismaService,
          useValue: {
            categories_Incomes: {
              create: jest.fn().mockResolvedValue({ id: 1, name: 'Salário' }),
              findMany: jest.fn().mockResolvedValue([
                { id: 1, name: 'Salário' },
                { id: 2, name: 'Hora Extra' },
              ]),
              findUnique: jest
                .fn()
                .mockResolvedValue({ id: 1, name: 'Salário' }),
              update: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Hora Extra',
                updatedAt: new Date('2024-02-23T15:27:09.467Z'),
              }),
              delete: jest.fn().mockResolvedValue({ id: 1, name: 'Salário' }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesIncomesService>(CategoriesIncomesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category income', async () => {
    const createCategoryIncomeDto = { name: 'Salário' };
    const expectedResult = { id: 1, name: 'Salário' };

    const result = await service.create(createCategoryIncomeDto);

    expect(result).toEqual(expectedResult);
    expect(prisma.categories_Incomes.create).toHaveBeenCalledWith({
      data: createCategoryIncomeDto,
    });
  });

  it('should find all categories of incomes', async () => {
    const expectedResult = [
      { id: 1, name: 'Salário' },
      { id: 2, name: 'Hora Extra' },
    ];

    const result = await service.findAll();
    expect(result).toEqual(expectedResult);
    expect(prisma.categories_Incomes.findMany).toHaveBeenCalled();
  });

  it('should find one category of income by id', async () => {
    const id = 1;
    const expectedResult = { id: 1, name: 'Salário' };

    const result = await service.findOne(id);
    expect(result).toEqual(expectedResult);
    expect(prisma.categories_Incomes.findUnique).toHaveBeenCalledWith({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
  });

  it('should update a category of income by id', async () => {
    const id = 1;
    const categoryIncomeDto = { name: 'Salário' };
    const expectedResult = {
      id: 1,
      name: 'Hora Extra',
      updatedAt: new Date('2024-02-23T15:27:09.467Z'),
    };

    const result = await service.update(id, categoryIncomeDto);
    expect(result).toEqual(expectedResult);
  });

  it('should remove a category of income by id', async () => {
    const id = 1;
    const expectedResult = { id: id, name: 'Salário' };

    const result = await service.remove(id);
    expect(result).toEqual(expectedResult);
    expect(prisma.categories_Incomes.delete).toHaveBeenCalledWith({
      where: { id },
    });
  });
});
