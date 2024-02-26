import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoriesExpenseDto } from './dto/create-categories.expense.dto';
import { UpdateCategoriesExpenseDto } from './dto/update-categories.expense.dto';
import { PrismaService } from '../prisma_client/prisma.service';

@Injectable()
export class CategoriesExpensesService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateCategoriesExpenseDto) {
    if (!data.name) {
      throw new BadRequestException('Name is not empty');
    }

    return this.prisma.categories_Expenses.create({ data });
  }

  async findAll() {
    return this.prisma.categories_Expenses.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const categoriesExpenses = await this.prisma.categories_Expenses.findUnique(
      {
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
        },
      },
    );

    if (!categoriesExpenses) {
      throw new NotFoundException();
    }

    return categoriesExpenses;
  }

  async update(
    id: number,
    updateCategoriesExpenseDto: UpdateCategoriesExpenseDto,
  ) {
    const categoryExpense = await this.prisma.categories_Expenses.findUnique({
      where: { id },
    });

    if (!categoryExpense) {
      throw new NotFoundException('Category of Expense not found');
    }

    if (!updateCategoriesExpenseDto.name) {
      throw new BadRequestException('Name is not empty!');
    }

    return this.prisma.categories_Expenses.update({
      where: {
        id: id,
      },
      data: { name: updateCategoriesExpenseDto.name, updatedAt: new Date() },
    });
  }

  async remove(id: number) {
    const categoryExpense = await this.prisma.categories_Expenses.findUnique({
      where: { id },
    });

    if (!categoryExpense) {
      throw new NotFoundException('Category of expense not found');
    }

    return this.prisma.categories_Expenses.delete({
      where: { id },
    });
  }
}
