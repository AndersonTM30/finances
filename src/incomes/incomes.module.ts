import { Module } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesController } from './incomes.controller';
import { PrismaService } from '../prisma_client/prisma.service';
import { NotEmptyField } from './validations/not.empty.field';

@Module({
  controllers: [IncomesController],
  providers: [IncomesService, PrismaService, NotEmptyField],
})
export class IncomesModule {}
