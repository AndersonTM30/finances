import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesIncomesController } from '../categories.incomes.controller';
import { CategoriesIncomesService } from '../categories.incomes.service';

describe('CategoriesIncomesController', () => {
  let controller: CategoriesIncomesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesIncomesController],
      providers: [CategoriesIncomesService],
    }).compile();

    controller = module.get<CategoriesIncomesController>(
      CategoriesIncomesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
