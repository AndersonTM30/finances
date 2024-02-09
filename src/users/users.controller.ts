import { Controller, Body, Post, HttpCode } from '@nestjs/common';
import { Users } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create.users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(201)
  async signupUser(@Body() userData: CreateUsersDto): Promise<Users> {
    return this.usersService.createUser(userData);
  }
}
