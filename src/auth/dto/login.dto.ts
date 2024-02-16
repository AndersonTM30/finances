import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({ type: String, format: 'string', example: 'username' })
  username: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ type: String, format: 'password', example: 'password' })
  password: string;
}
