import {
  Controller,
  Body,
  Post,
  HttpCode,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
// import { Users } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create.users.dto';
import { UserOutputDto } from './dto/user.output.dto';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse()
  @HttpCode(201)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  )
  async signupUser(@Body() userData: CreateUsersDto): Promise<UserOutputDto> {
    return this.usersService.createUser(userData);
  }
}
