import { Test, TestingModule } from '@nestjs/testing';
import { IncomesService } from '../incomes.service';
import { PrismaService } from '../../prisma_client/prisma.service';
import { NotEmptyField } from '../validations/not.empty.field';

describe('IncomesService', () => {
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
});
