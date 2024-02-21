import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Log in with username and password' })
  @ApiOkResponse({ type: AuthEntity })
  @ApiBadRequestResponse({
    status: 400,
    description: 'Bad Request',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: {
            message:
              '["username should not be empty", "password must be longer than or equal to 8 characters", ,"password should not be empty"]',
            error: 'Not Found',
            statusCode: 400,
          },
        },
      },
    },
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'User not found!',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: `No user found for username: username`,
        },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiBody({ type: LoginDto })
  @HttpCode(200)
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => new BadRequestException(errors),
    }),
  )
  async login(
    @Body() { username, password }: LoginDto,
    @Res() res: Response,
  ): Promise<AuthEntity> {
    const authEntity = await this.authService.login(username, password, res);
    return authEntity;
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh the access token' })
  @ApiResponse({
    status: 200,
    description: 'The access token has been refreshed.',
    type: AuthEntity,
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized token refresh!',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Refresh token not found' },
        error: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  async refreshToken(@Req() req: Request): Promise<AuthEntity> {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.authService.validateUser(payload.userId);

      const accessToken = this.jwtService.sign({ userId: user.id });
      const newRefreshToken = this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '7d' },
      );

      req.res.cookie('refresh_token', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 604800000,
      });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @Post('logout')
  @ApiOperation({ summary: 'Log out the user' })
  @ApiOkResponse({
    status: 200,
    description: 'Logou successful',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logout successful' },
      },
    },
  })
  @HttpCode(200)
  async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
    await this.authService.logout(res);
    res.send({ message: 'Logout successful' });
  }
}
