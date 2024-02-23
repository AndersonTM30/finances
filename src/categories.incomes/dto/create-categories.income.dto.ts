import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoriesIncomeDto {
  @ApiProperty({
    description: 'The name of category imcome',
    example: 'Salary',
    type: 'string',
  })
  @IsNotEmpty()
  name: string;
}
