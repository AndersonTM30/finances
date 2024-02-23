import { Module } from '@nestjs/common';
import { CategoriesIncomesService } from './categories.incomes.service';
import { CategoriesIncomesController } from './categories.incomes.controller';
import { PrismaService } from '../prisma_client/prisma.service';

@Module({
  controllers: [CategoriesIncomesController],
  providers: [CategoriesIncomesService, PrismaService],
})
export class CategoriesIncomesModule {}
