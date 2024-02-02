import { Controller, Body, Post } from '@nestjs/common';
import { Users } from '@prisma/client';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async signupUser(
    @Body() userData: { username: string; password: string },
  ): Promise<Users> {
    return this.usersService.createUser(userData);
  }
}
