import { Module } from '@nestjs/common';
import { CategoriesExpensesService } from './categories.expenses.service';
import { CategoriesExpensesController } from './categories.expenses.controller';
import { PrismaService } from '../prisma_client/prisma.service';

@Module({
  controllers: [CategoriesExpensesController],
  providers: [CategoriesExpensesService, PrismaService],
})
export class CategoriesExpensesModule {}
