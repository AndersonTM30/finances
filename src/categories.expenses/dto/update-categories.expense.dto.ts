import { PartialType } from '@nestjs/swagger';
import { CreateCategoriesExpenseDto } from './create-categories.expense.dto';

export class UpdateCategoriesExpenseDto extends PartialType(
  CreateCategoriesExpenseDto,
) {}
