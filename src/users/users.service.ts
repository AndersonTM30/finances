import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma_client/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUsersDto } from './dto/create.users.dto';
import { UserOutputDto } from './dto/user.output.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUsersDto): Promise<UserOutputDto> {
    const userExist = await this.findByUsername(data.username);
    if (userExist?.username == data.username) {
      throw new ConflictException();
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltOrRounds);
    data.password = hashedPassword;

    const user = await this.prisma.users.create({
      data,
    });
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
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
