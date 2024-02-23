import { PartialType } from '@nestjs/swagger';
import { CreateCurrencyDto } from './create-currency.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {
  @IsNotEmpty()
  name: string;
}
