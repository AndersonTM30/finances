import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoriesExpenseDto } from './dto/create-categories.expense.dto';
import { UpdateCategoriesExpenseDto } from './dto/update-categories.expense.dto';
import { PrismaService } from '../prisma_client/prisma.service';

@Injectable()
export class CategoriesExpensesService {
  constructor(private prisma: PrismaService) {}
  create(data: CreateCategoriesExpenseDto) {
    if (!data.name) {
      throw new BadRequestException('Name is not empty');
    }

    return this.prisma.categories_Expenses.create({ data });
  }

  findAll() {
    return `This action returns all categoriesExpenses`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriesExpense`;
  }

  update(id: number, updateCategoriesExpenseDto: UpdateCategoriesExpenseDto) {
    return `This action updates a #${id} categoriesExpense`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriesExpense`;
  }
}
