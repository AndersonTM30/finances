import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
// import { UsersController } from './users/users.controller';
import { CurrenciesModule } from './currencies/currencies.module';
import { CategoriesIncomesModule } from './categories.incomes/categories.incomes.module';
import { CategoriesExpensesModule } from './categories.expenses/categories.expenses.module';
import { IncomesModule } from './incomes/incomes.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CurrenciesModule,
    CategoriesIncomesModule,
    CategoriesExpensesModule,
    IncomesModule,
    ExpensesModule,
    ReportsModule,
  ],
  // controllers: [UsersController],
})
export class AppModule {}
