import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesService } from '../currencies.service';
import { PrismaService } from '../../prisma_client/prisma.service';

describe('CurrenciesService (integration)', () => {
  let service: CurrenciesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrenciesService,
        {
          provide: PrismaService,
          useValue: {
            currencies: {
              create: jest.fn().mockResolvedValue({ id: 1, name: 'Dinheiro' }),
              findMany: jest.fn().mockResolvedValue([
                { id: 1, name: 'Dinheiro' },
                { id: 2, name: 'Cartão' },
              ]),
              findUnique: jest
                .fn()
                .mockResolvedValue({ id: 1, name: 'Dinheiro' }),
              update: jest.fn().mockResolvedValue({
                id: 1,
                name: 'Dinheiro',
                updatedAt: new Date('2024-02-23T15:27:09.467Z'),
              }),
              delete: jest.fn().mockResolvedValue({ id: 1, name: 'Dinheiro' }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<CurrenciesService>(CurrenciesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a currency', async () => {
    const createCurrencyDto = { name: 'Dinheiro' };
    const expectedResult = { id: 1, name: 'Dinheiro' };

    const result = await service.create(createCurrencyDto);

    expect(result).toEqual(expectedResult);
    expect(prisma.currencies.create).toHaveBeenCalledWith({
      data: createCurrencyDto,
    });
  });

  it('should find all currencies', async () => {
    const expectedResult = [
      { id: 1, name: 'Dinheiro' },
      { id: 2, name: 'Cartão' },
    ];

    const result = await service.findAll();
    expect(result).toEqual(expectedResult);
    expect(prisma.currencies.findMany).toHaveBeenCalled();
  });

  it('should find one currency by id', async () => {
    const id = 1;
    const expectedResult = { id: 1, name: 'Dinheiro' };

    const result = await service.findOne(id);
    expect(result).toEqual(expectedResult);
    expect(prisma.currencies.findUnique).toHaveBeenCalledWith({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    });
  });

  it('should update a currency', async () => {
    const id = 1;
    const updateCurrencyDto = { name: 'USD' };
    const expectedResult = {
      id: 1,
      name: 'Dinheiro',
      updatedAt: new Date('2024-02-23T15:27:09.467Z'),
    };

    const result = await service.update(id, updateCurrencyDto);
    expect(result).toEqual(expectedResult);
  });

  it('should remove a currency', async () => {
    const id = 1;
    const expectedResult = { id: 1, name: 'Dinheiro' };

    const result = await service.remove(id);
    expect(result).toEqual(expectedResult);
    expect(prisma.currencies.delete).toHaveBeenCalledWith({ where: { id } });
  });
});
