import { Test, TestingModule } from '@nestjs/testing';
import { CurrenciesController } from '../currencies.controller';
import { CurrenciesService } from '../currencies.service';
import { PrismaService } from '../../prisma_client/prisma.service';

describe('CurrenciesController', () => {
  let controller: CurrenciesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrenciesController],
      providers: [CurrenciesService, PrismaService],
    }).compile();

    controller = module.get<CurrenciesController>(CurrenciesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
