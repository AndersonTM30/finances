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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('expenses')
@ApiTags('Expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @ApiOperation({ summary: 'Create a new Expense' })
  @ApiBody({
    type: CreateExpenseDto,
    description: 'Income income registration data',
  })
  @ApiCreatedResponse({
    type: CreateExpenseDto,
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
  async create(@Body() createExpenseDto: CreateExpenseDto) {
    return this.expensesService.create(createExpenseDto);
  }

  @ApiOperation({ summary: 'List all expenses' })
  @ApiOkResponse({
    description: 'List all expenses',
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
          description: 'Water park ride',
          categoryId: 1,
          userId: 1,
          currencyId: 1,
          date: '2024-02-27T10:08:00.777Z',
          value: 500.55,
        },
        {
          id: 2,
          description: 'Metallica concert',
          categoryId: 1,
          userId: 1,
          currencyId: 1,
          date: '2024-02-27T10:08:00.777Z',
          value: 155.55,
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
    return this.expensesService.findAll();
  }

  @ApiOperation({ summary: 'Return a expense by id' })
  @ApiOkResponse({
    status: 200,
    description: 'Return expense by Id',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'id expense' },
        description: { type: 'string' },
        categoryId: { type: 'number' },
        userId: { type: 'number' },
        currencyId: { type: 'number' },
        date: { type: 'string' },
        value: { type: 'number' },
      },
      example: {
        id: 1,
        description: 'Water park ride',
        categoryId: 1,
        userId: 1,
        currencyId: 1,
        date: '2024-02-27T10:08:00.777Z',
        value: 200.55,
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
    description: 'Expense not found',
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
    return this.expensesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update Expense by id' })
  @ApiOkResponse({
    description: 'Update Expense by id',
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
        description: 'Water park ride',
        categoryId: 1,
        userId: 1,
        currencyId: 1,
        date: '2024-02-27T10:08:00.777Z',
        value: 50.55,
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Expense id not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Expense id not found' },
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
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expensesService.update(+id, updateExpenseDto);
  }

  @ApiOperation({ summary: 'Delete expense by id' })
  @ApiOkResponse({
    description: 'Delete expense by id',
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
    description: 'Expense id not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Expense id not found' },
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
    return this.expensesService.remove(+id);
  }
}
