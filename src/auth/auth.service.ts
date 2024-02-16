import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma_client/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';

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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password!');
    }

    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
    };
  }
}
