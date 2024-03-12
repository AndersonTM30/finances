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
      balance: difference,
    };
  }

  async getIncomesByCategoryName(
    startDate: string,
    endDate: string,
    categoryName: string,
    userId: number,
  ) {
    const startDateFormated =
      this.validateFields.convertBrazilianDateToJSDate(startDate);
    const endDateFormated =
      this.validateFields.convertBrazilianDateToJSDate(endDate);

    const categoryIds = await this.prisma.categories_Incomes
      .findMany({
        where: {
          name: {
            contains: categoryName,
          },
        },
        select: {
          id: true,
        },
      })
      .then((categories) => categories.map((category) => category.id));

    const incomes = await this.prisma.incomes.findMany({
      where: {
        userId: userId,
        categoryId: {
          in: categoryIds,
        },
        date: {
          gte: startDateFormated,
          lte: endDateFormated,
        },
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        currency: {
          select: {
            name: true,
          },
        },
      },
    });

    const result = incomes.map((income) => ({
      id: income.id,
      description: income.description,
      categoryName: income.category.name,
      currencyName: income.currency.name,
      dataTransaction: this.validateFields.convertJSDateToBrazilianDate(
        income.date.toISOString().split('T')[0],
      ),
      value: income.value,
    }));

    return result;
  }

  async getExpensesByCategoryName(
    startDate: string,
    endDate: string,
    categoryName: string,
    userId: number,
  ) {
    const startDateFormated =
      this.validateFields.convertBrazilianDateToJSDate(startDate);
    const endDateFormated =
      this.validateFields.convertBrazilianDateToJSDate(endDate);

    const categoryIds = await this.prisma.categories_Expenses
      .findMany({
        where: {
          name: {
            contains: categoryName,
          },
        },
        select: {
          id: true,
        },
      })
      .then((categories) => categories.map((category) => category.id));

    const expenses = await this.prisma.expenses.findMany({
      where: {
        userId: userId,
        categoryId: {
          in: categoryIds,
        },
        date: {
          gte: startDateFormated,
          lte: endDateFormated,
        },
      },
      orderBy: {
        date: 'asc',
      },
      include: {
        category: {
          select: {
            name: true,
          },
        },
        currency: {
          select: {
            name: true,
          },
        },
      },
    });

    const result = expenses.map((expense) => ({
      id: expense.id,
      description: expense.description,
      categoryName: expense.category.name,
      currencyName: expense.currency.name,
      dataTransaction: this.validateFields.convertJSDateToBrazilianDate(
        expense.date.toISOString().split('T')[0],
      ),
      value: expense.value,
    }));

    return result;
  }

  async getExpensesByCurrencyName(
    startDate: string,
    endDate: string,
    currencyName: string,
    userId: number,
  ) {
    const startDateFormated =
      this.validateFields.convertBrazilianDateToJSDate(startDate);
    const endDateFormated =
      this.validateFields.convertBrazilianDateToJSDate(endDate);

    const incomes = await this.prisma.incomes.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDateFormated,
          lte: endDateFormated,
        },
        currency: {
          name: {
            contains: currencyName,
          },
        },
      },
      select: {
        id: true,
        description: true,
        date: true,
        category: {
          select: {
            name: true,
          },
        },
        currency: {
          select: {
            name: true,
          },
        },
        value: true,
      },
    });

    const expenses = await this.prisma.expenses.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDateFormated,
          lte: endDateFormated,
        },
        currency: {
          name: {
            contains: currencyName,
          },
        },
      },
      select: {
        id: true,
        description: true,
        date: true,
        category: {
          select: {
            name: true,
          },
        },
        currency: {
          select: {
            name: true,
          },
        },
        value: true,
      },
    });

    const resultExpenses = expenses.map(
      (expense) => (
        (expense.value = -expense.value),
        {
          id: expense.id,
          description: expense.description,
          categoryName: expense.category.name,
          currencyName: expense.currency.name,
          dataTransaction: this.validateFields.convertJSDateToBrazilianDate(
            expense.date.toISOString().split('T')[0],
          ),
          value: expense.value,
        }
      ),
    );

    const resultIncomes = incomes.map((income) => ({
      id: income.id,
      description: income.description,
      categoryName: income.category.name,
      currencyName: income.currency.name,
      dataTransaction: this.validateFields.convertJSDateToBrazilianDate(
        income.date.toISOString().split('T')[0],
      ),
      value: income.value,
    }));

    return {
      data: {
        resultIncomes,
        resultExpenses,
      },
    };
  }

  async getIncomes(userId: number, startDate: string, endDate: string) {
    const startDateFormated =
      this.validateFields.convertBrazilianDateToJSDate(startDate);
    const endDateFormated =
      this.validateFields.convertBrazilianDateToJSDate(endDate);
    return this.prisma.incomes.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDateFormated,
          lte: endDateFormated,
        },
      },
      select: {
        id: true,
        description: true,
        date: true,
        value: true,
        category: {
          select: {
            name: true,
          },
        },
        currency: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getExpenses(userId: number, startDate: string, endDate: string) {
    const startDateFormated =
      this.validateFields.convertBrazilianDateToJSDate(startDate);
    const endDateFormated =
      this.validateFields.convertBrazilianDateToJSDate(endDate);

    return this.prisma.expenses.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDateFormated,
          lte: endDateFormated,
        },
      },
      select: {
        id: true,
        description: true,
        date: true,
        value: true,
        category: {
          select: {
            name: true,
          },
        },
        currency: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getCombinedReport(userId: number, startDate: string, endDate: string) {
    const incomes = await this.getIncomes(userId, startDate, endDate);
    const expenses = await this.getExpenses(userId, startDate, endDate);

    expenses.forEach((expense) => {
      expense.value = -expense.value;
    });

    const combinedReport = [...incomes, ...expenses];

    return combinedReport;
  }
}
