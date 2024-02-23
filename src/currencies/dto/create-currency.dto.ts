import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({
    description: 'The name of currency',
    example: 'Credit Card',
    type: 'string',
  })
  @IsNotEmpty()
  name: string;
}
