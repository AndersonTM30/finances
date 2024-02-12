import {
  Controller,
  Body,
  Post,
  HttpCode,
  UsePipes,
  ValidationPipe,
  BadRequestException,
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
} from '@nestjs/swagger';
// import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

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
}
