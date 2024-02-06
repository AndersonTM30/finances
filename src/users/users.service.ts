import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma_client/prisma.service';
import { Users, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UsersCreateInput): Promise<Users> {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
    data.password = hashedPassword;

    return this.prisma.users.create({
      data,
    });
  }
}
