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
import { CategoriesIncomesService } from './categories.incomes.service';
import { CreateCategoriesIncomeDto } from './dto/create-categories.income.dto';
import { UpdateCategoriesIncomeDto } from './dto/update-categories.income.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.auth.guard';

@Controller('categories/incomes')
@ApiTags('Categories Incomes')
@UseGuards(JwtAuthGuard)
export class CategoriesIncomesController {
  constructor(
    private readonly categoriesIncomesService: CategoriesIncomesService,
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new category income' })
  @ApiBody({
    type: CreateCategoriesIncomeDto,
    description: 'Category income registration data',
  })
  @ApiCreatedResponse({
    description: 'Category income registration completed successfully!',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Salary' },
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
  async create(@Body() createCategoriesIncomeDto: CreateCategoriesIncomeDto) {
    return this.categoriesIncomesService.create(createCategoriesIncomeDto);
  }

  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all currencies' })
  @ApiOkResponse({
    description: 'List all currencies',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
      },
      example: [
        {
          id: 1,
          name: 'Salary',
        },
        {
          id: 2,
          name: 'Bonus',
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
    return this.categoriesIncomesService.findAll();
  }

  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return a category of income by id' })
  @ApiOkResponse({
    status: 200,
    description: 'Return category of income by Id',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'id category of income' },
        name: { type: 'string' },
      },
      example: {
        id: 1,
        name: 'Salary',
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
    description: 'Category of Income not found',
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
    return this.categoriesIncomesService.findOne(+id);
  }

  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update name of category income by id' })
  @ApiOkResponse({
    description: 'Update name of category income by id',
    schema: {
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Salary' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Category income id not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Category income id not found' },
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
    @Body() updateCategoriesIncomeDto: UpdateCategoriesIncomeDto,
  ) {
    return this.categoriesIncomesService.update(+id, updateCategoriesIncomeDto);
  }

  // @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete category of income by id' })
  @ApiOkResponse({
    description: 'Delete category of income by id',
    status: 200,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Bonus' },
        createdAt: { type: 'date', example: '2024-02-23 11:54:27.472' },
        updatedAt: { type: 'date', example: '2024-02-23 11:54:27.472' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Category of income id not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Category of income id not found' },
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
    return this.categoriesIncomesService.remove(+id);
  }
}
