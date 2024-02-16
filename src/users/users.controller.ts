import {
  Controller,
  Body,
  Post,
  HttpCode,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  Param,
  ParseIntPipe,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create.users.dto';
import { UserOutputDto } from './dto/user.output.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    type: CreateUsersDto,
    description: 'User registration data',
  })
  @ApiCreatedResponse({
    description: 'Cadastro realizado com sucesso!',
    type: UserOutputDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'array',
          items: { type: 'string' },
          example: ['username should not be empty'],
        },
        error: { type: 'string', example: 'Bad Request' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @ApiConflictResponse({
    status: 409,
    description: 'Usuário já cadastrado!',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Conflict' },
        statusCode: { type: 'number', example: 409 },
      },
    },
  })
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

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }
}
