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
import { CategoriesExpensesService } from './categories.expenses.service';
import { CreateCategoriesExpenseDto } from './dto/create-categories.expense.dto';
import { UpdateCategoriesExpenseDto } from './dto/update-categories.expense.dto';
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

@Controller('categories/expenses')
@ApiTags('Categories Expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesExpensesController {
  constructor(
    private readonly categoriesExpensesService: CategoriesExpensesService,
  ) {}

  @ApiOperation({ summary: 'Create a new category expense' })
  @ApiBody({
    type: CreateCategoriesExpenseDto,
    description: 'Category expense registration data',
  })
  @ApiCreatedResponse({
    description: 'Category expense registration completed successfully!',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Payment Slip' },
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
  @ApiBadRequestResponse({
    description: 'Name is not empty!',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Name is not empty!' },
        statusCode: { type: 'number', example: 400 },
      },
    },
  })
  @Post()
  async create(@Body() createCategoriesExpenseDto: CreateCategoriesExpenseDto) {
    return this.categoriesExpensesService.create(createCategoriesExpenseDto);
  }

  @ApiOperation({ summary: 'List all categories expenses' })
  @ApiOkResponse({
    description: 'List all categories expenses',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
      },
      example: [
        {
          id: 1,
          name: 'Payment Slip',
        },
        {
          id: 2,
          name: 'Electricity Bill',
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
    return this.categoriesExpensesService.findAll();
  }

  @ApiOperation({ summary: 'Return a category of expense by id' })
  @ApiOkResponse({
    status: 200,
    description: 'Return category of expense by Id',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'id category of expense' },
        name: { type: 'string' },
      },
      example: {
        id: 1,
        name: 'Payment Slip',
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
    description: 'Category of Expense not found',
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
    return this.categoriesExpensesService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update name of category expense by id' })
  @ApiOkResponse({
    description: 'Update name of category expense by id',
    schema: {
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Payment Slip' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Category expense id not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Category expense id not found' },
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
    @Body() updateCategoriesExpenseDto: UpdateCategoriesExpenseDto,
  ) {
    return this.categoriesExpensesService.update(
      +id,
      updateCategoriesExpenseDto,
    );
  }

  @ApiOperation({ summary: 'Delete category of expense by id' })
  @ApiOkResponse({
    description: 'Delete category of expense by id',
    status: 200,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Payment Slip' },
        createdAt: { type: 'date', example: '2024-02-23 11:54:27.472' },
        updatedAt: { type: 'date', example: '2024-02-23 11:54:27.472' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Category of expense id not found',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Category of expense id not found',
        },
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
    return this.categoriesExpensesService.remove(+id);
  }
}
