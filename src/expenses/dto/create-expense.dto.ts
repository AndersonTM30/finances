import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Description of Expense',
    example: 'Gym',
    type: 'string',
  })
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Category Expense Id',
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
    description: 'Expense release date',
    example: '2024-02-27T10:08:00.777Z',
    type: 'string',
  })
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: 'The value of expense',
    example: '100.55',
    type: 'number',
  })
  @IsNotEmpty()
  value: number;
}
