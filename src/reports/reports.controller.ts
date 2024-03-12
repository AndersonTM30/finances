import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('balance')
  async findAll(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.reportsService.resume(startDate, endDate, userId);
  }

  @Get('category/incomes')
  async findByIncomesCategoryName(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('categoryName') categoryName: string,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.reportsService.getIncomesByCategoryName(
      startDate,
      endDate,
      categoryName,
      userId,
    );
  }

  @Get('category/expenses')
  async findByExpensesCategoryName(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('categoryName') categoryName: string,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.reportsService.getExpensesByCategoryName(
      startDate,
      endDate,
      categoryName,
      userId,
    );
  }

  @Get('category/currency')
  async findByExpensesCurrencyName(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('currencyName') currencyName: string,
    @Query('userId', ParseIntPipe) userId: number,
  ) {
    return this.reportsService.getExpensesByCurrencyName(
      startDate,
      endDate,
      currencyName,
      userId,
    );
  }

  @Get('transactions')
  async findTransactionsByPeriod(
    @Query('userId', ParseIntPipe) userId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getCombinedReport(userId, startDate, endDate);
  }
}
