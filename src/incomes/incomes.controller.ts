import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('incomes')
@ApiTags('Incomes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IncomesController {
  constructor(private readonly incomesService: IncomesService) {}

  @ApiOperation({ summary: 'Create a new income' })
  @ApiBody({
    type: CreateIncomeDto,
    description: 'Income income registration data',
  })
  @ApiCreatedResponse({
    type: CreateIncomeDto,
    description: 'Income income registration completed successfully!',
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized!',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Date is not empty!',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Date is not empty!' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @Post()
  async create(@Body() createIncomeDto: CreateIncomeDto) {
    return this.incomesService.create(createIncomeDto);
  }

  @ApiOperation({ summary: 'List all incomes' })
  @ApiOkResponse({
    description: 'List all incomes',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        description: { type: 'string' },
        categoryId: { type: 'number' },
        userId: { type: 'number' },
        currencyId: { type: 'number' },
        date: { type: 'string' },
        value: { type: 'number' },
      },
      example: [
        {
          id: 1,
          description: 'Electricity bill payment',
          categoryId: 1,
          userId: 1,
          currencyId: 1,
          date: '2024-02-27T10:08:00.777Z',
          value: 500.55,
        },
        {
          id: 2,
          description: 'Bonus',
          categoryId: 1,
          userId: 1,
          currencyId: 1,
          date: '2024-02-27T10:08:00.777Z',
          value: 55.55,
        },
      ],
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized!',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @Get()
  async findAll() {
    return this.incomesService.findAll();
  }

  @ApiOperation({ summary: 'Return a income by id' })
  @ApiOkResponse({
    status: 200,
    description: 'Return income by Id',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'id income' },
        description: { type: 'string' },
        categoryId: { type: 'number' },
        userId: { type: 'number' },
        currencyId: { type: 'number' },
        date: { type: 'string' },
        value: { type: 'number' },
      },
      example: {
        id: 1,
        description: 'Electricity bill payment',
        categoryId: 1,
        userId: 1,
        currencyId: 1,
        date: '2024-02-27T10:08:00.777Z',
        value: 500.55,
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized!',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Income not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Not Found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.incomesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update Income by id' })
  @ApiOkResponse({
    description: 'Update Income by id',
    schema: {
      properties: {
        description: { type: 'string' },
        categoryId: { type: 'number' },
        userId: { type: 'number' },
        currencyId: { type: 'number' },
        date: { type: 'string' },
        value: { type: 'number' },
      },
      example: {
        id: 1,
        description: 'Water bill payment',
        categoryId: 1,
        userId: 1,
        currencyId: 1,
        date: '2024-02-27T10:08:00.777Z',
        value: 50.55,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Income id not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Income id not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized!',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ) {
    return this.incomesService.update(+id, updateIncomeDto);
  }

  @ApiOperation({ summary: 'Delete income by id' })
  @ApiOkResponse({
    description: 'Delete income by id',
    status: 200,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        description: { type: 'string' },
        categoryId: { type: 'number' },
        userId: { type: 'number' },
        currencyId: { type: 'number' },
        date: { type: 'string' },
        value: { type: 'number' },
      },
      example: {
        id: 1,
        description: 'Water bill payment',
        categoryId: 1,
        userId: 1,
        currencyId: 1,
        date: '2024-02-27T10:08:00.777Z',
        value: 50.55,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Income id not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Income id not found' },
        error: { type: 'string', example: 'Not Found' },
        statusCode: { type: 'number', example: 404 },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized!',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Unauthorized' },
        statusCode: { type: 'number', example: 401 },
      },
    },
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.incomesService.remove(+id);
  }
}
