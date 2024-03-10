import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from '../reports.service';
import { PrismaService } from '../../prisma_client/prisma.service';
import { ValidateFields } from '../validations/validate.fields';

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        ValidateFields,
        {
          provide: PrismaService,
          useValue: {
            incomes: {
              aggregate: jest.fn().mockResolvedValue({
                _sum: {
                  value: 250,
                },
              }),
            },
            expenses: {
              aggregate: jest.fn().mockResolvedValue({
                _sum: {
                  value: 200,
                },
              }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be return incomes, expenses and difference by date and userId', async () => {
    const resumeDto = {
      userId: 1,
      startDate: '01/02/2024',
      endDate: '29/02/2024',
    };

    const expectedResult = {
      incomes: 250,
      expenses: 200,
      balance: 50,
    };

    const result = await service.resume(
      resumeDto.startDate,
      resumeDto.endDate,
      resumeDto.userId,
    );
    expect(result).toEqual(expectedResult);
  });
});
