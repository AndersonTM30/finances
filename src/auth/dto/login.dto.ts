import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    format: 'string',
    example: 'username',
    description: 'The username',
    maxLength: 50,
  })
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    type: String,
    format: 'password',
    example: 'password',
    description: 'The password',
    minLength: 8,
    maxLength: 60,
  })
  password: string;
}
