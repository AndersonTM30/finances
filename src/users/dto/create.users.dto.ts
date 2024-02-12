import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUsersDto {
  @ApiProperty({
    description: 'The name of user',
    example: 'testuser',
    type: 'string',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The password of user',
    example: 'securepassword',
    type: 'string',
    format: 'password',
    minLength: 8,
    maxLength: 60,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
