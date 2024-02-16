import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma_client/prisma.service';
import { AuthEntity } from './entity/auth.entity';
// import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(username: string, password: string): Promise<AuthEntity> {
    const user = await this.prisma.users.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${username}`);
    }

    console.log(password);

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
}
