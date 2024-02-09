import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma_client/prisma.service';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CreateUsersDto } from './dto/create.users.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUsersDto): Promise<Users> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
    data.password = hashedPassword;

    return this.prisma.users.create({
      data,
    });
  }

  async findByUsername(username: string) {
    return this.prisma.users.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
      select: {
        id: true,
        username: true,
      },
      orderBy: {
        username: 'asc',
      },
    });
  }
}
