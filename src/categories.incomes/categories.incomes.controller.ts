import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoriesIncomesService } from './categories.incomes.service';
import { CreateCategoriesIncomeDto } from './dto/create-categories.income.dto';
import { UpdateCategoriesIncomeDto } from './dto/update-categories.income.dto';

@Controller('categories.incomes')
export class CategoriesIncomesController {
  constructor(
    private readonly categoriesIncomesService: CategoriesIncomesService,
  ) {}

  @Post()
  create(@Body() createCategoriesIncomeDto: CreateCategoriesIncomeDto) {
    return this.categoriesIncomesService.create(createCategoriesIncomeDto);
  }

  @Get()
  findAll() {
    return this.categoriesIncomesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesIncomesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoriesIncomeDto: UpdateCategoriesIncomeDto,
  ) {
    return this.categoriesIncomesService.update(+id, updateCategoriesIncomeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesIncomesService.remove(+id);
  }
}
