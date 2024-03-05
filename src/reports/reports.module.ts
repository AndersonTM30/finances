import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaService } from '../prisma_client/prisma.service';
import { ValidateFields } from './validations/validate.fields';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, PrismaService, ValidateFields],
})
export class ReportsModule {}
