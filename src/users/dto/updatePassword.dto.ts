import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'The password of user',
    example: 'securepassword',
    type: 'string',
    format: 'password',
    minLength: 8,
    maxLength: 60,
  })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
