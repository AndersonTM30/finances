import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PrismaService } from '../prisma_client/prisma.service';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateExpenseDto) {
    return this.prisma.expenses.create({ data });
  }

  async findAll() {
    return this.prisma.expenses.findMany({
      select: {
        id: true,
        description: true,
        date: true,
        value: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const expenseData = await this.prisma.expenses.findUnique({
      where: { id: id },
      select: {
        id: true,
        description: true,
        date: true,
        value: true,
      },
    });

    if (!expenseData) {
      throw new NotFoundException();
    }
    return expenseData;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    const expenseData = await this.prisma.expenses.findUnique({
      where: { id },
    });

    if (!expenseData) {
      throw new NotFoundException('Expense not found');
    }

    return this.prisma.expenses.update({
      where: { id },
      data: updateExpenseDto,
    });
  }

  async remove(id: number) {
    const expenseData = await this.prisma.expenses.findUnique({
      where: { id },
    });

    if (!expenseData) {
      throw new NotFoundException('Expense not found');
    }

    return this.prisma.expenses.delete({
      where: { id },
    });
  }
}
