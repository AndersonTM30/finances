import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesExpensesController } from '../categories.expenses.controller';
import { CategoriesExpensesService } from '../categories.expenses.service';

describe('CategoriesExpensesController', () => {
  let controller: CategoriesExpensesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesExpensesController],
      providers: [CategoriesExpensesService],
    }).compile();

    controller = module.get<CategoriesExpensesController>(
      CategoriesExpensesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
