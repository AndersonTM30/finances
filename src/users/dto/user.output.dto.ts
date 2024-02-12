import { ApiProperty } from '@nestjs/swagger';

export class UserOutputDto {
  @ApiProperty({
    description: 'The ID of the user',
    example: 37,
  })
  id: number;

  @ApiProperty({
    description: 'The username of the user',
    example: 'testuser',
  })
  username: string;

  @ApiProperty({
    description: 'The date and time when the user was created',
    example: '2024-02-12T00:09:59.457Z',
    format: 'date-time',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date and time when the user was last updated',
    example: '2024-02-12T00:09:59.457Z',
    format: 'date-time',
  })
  updatedAt: Date;
}
