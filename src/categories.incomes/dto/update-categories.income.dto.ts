import { PartialType } from '@nestjs/swagger';
import { CreateCategoriesIncomeDto } from './create-categories.income.dto';

export class UpdateCategoriesIncomeDto extends PartialType(
  CreateCategoriesIncomeDto,
) {}
