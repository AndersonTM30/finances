import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCategoriesExpenseDto {
  @ApiProperty({
    description: 'The name of category expense',
    example: 'Water bill',
    type: 'string',
  })
  @IsNotEmpty()
  name: string;
}
