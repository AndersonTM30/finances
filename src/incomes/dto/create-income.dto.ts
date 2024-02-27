import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateIncomeDto {
  @ApiProperty({
    description: 'Description of Income',
    example: 'Electricity bill payment',
    type: 'string',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Category Income Id',
    example: '1',
    type: 'number',
  })
  @IsNotEmpty()
  categoryId: number;

  @ApiProperty({
    description: 'User Id',
    example: '1',
    type: 'number',
  })
  @IsNotEmpty()
  userId: number;

  @ApiProperty({
    description: 'Currency Id',
    example: '1',
    type: 'number',
  })
  @IsNotEmpty()
  currencyId: number;

  @ApiProperty({
    description: 'Income release date',
    example: '2024-02-27T10:08:00.777Z',
    type: 'string',
  })
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'The value of income',
    example: '500,00',
    type: 'number',
  })
  @IsNotEmpty()
  value: number;
}
