import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { CurrenciesModule } from './currencies/currencies.module';

@Module({
  imports: [AuthModule, UsersModule, CurrenciesModule],
  controllers: [UsersController],
})
export class AppModule {}
