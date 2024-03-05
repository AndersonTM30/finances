import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma_client/prisma.service';
import { ValidateFields } from './validations/validate.fields';

@Injectable()
export class ReportsService {
  constructor(
    private prisma: PrismaService,
    private validateFields: ValidateFields,
  ) {}

  async resume(startDate: string, endDate: string, userId: number) {
    const startDateFormated =
      this.validateFields.convertBrazilianDateToJSDate(startDate);
    const endDateFormated =
      this.validateFields.convertBrazilianDateToJSDate(endDate);
    const incomesSum = await this.prisma.incomes.aggregate({
      where: {
        userId: userId,
        date: {
          gte: startDateFormated,
          lte: endDateFormated,
        },
      },
      _sum: {
        value: true,
      },
    });

    const expensesSum = await this.prisma.expenses.aggregate({
      where: {
        userId: userId,
        date: {
          gte: startDateFormated,
          lte: endDateFormated,
        },
      },
      _sum: {
        value: true,
      },
    });

    const difference = incomesSum._sum.value - expensesSum._sum.value;

    return {
      incomes: incomesSum._sum.value,
      expenses: expensesSum._sum.value,
      total: difference,
    };
  }
}
