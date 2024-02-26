import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesExpensesService } from './categories.expenses.service';
import { CreateCategoriesExpenseDto } from './dto/create-categories.expense.dto';
import { UpdateCategoriesExpenseDto } from './dto/update-categories.expense.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('categories/expenses')
@ApiTags('Categories Expenses')
export class CategoriesExpensesController {
  constructor(
    private readonly categoriesExpensesService: CategoriesExpensesService,
  ) {}

  @Post()
  create(@Body() createCategoriesExpenseDto: CreateCategoriesExpenseDto) {
    return this.categoriesExpensesService.create(createCategoriesExpenseDto);
  }

  @Get()
  findAll() {
    return this.categoriesExpensesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesExpensesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoriesExpenseDto: UpdateCategoriesExpenseDto,
  ) {
    return this.categoriesExpensesService.update(
      +id,
      updateCategoriesExpenseDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesExpensesService.remove(+id);
  }
}
