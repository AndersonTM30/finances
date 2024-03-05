import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma_client/prisma.service';
import * as bcrypt from 'bcryptjs';
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

  async findOne(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return user;
  }

  async updateOne(userId: number, newPassword: string) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    if (!newPassword) {
      throw new BadRequestException();
    }

    if (newPassword?.length < 8) {
      throw new Error('The new password must have at least 8 characters');
    }

    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltOrRounds);
    newPassword = hashedPassword;

    const id = userId;
    return this.prisma.users.update({
      where: {
        id: id,
      },
      data: { password: newPassword, updatedAt: new Date() },
    });
  }

  async deleteOne(userId: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const id = userId;

    return this.prisma.users.delete({
      where: { id },
    });
  }
}
