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
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
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

@Controller('currencies')
@ApiTags('Currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new currency' })
  @ApiBody({
    type: CreateCurrencyDto,
    description: 'Currency registration data',
  })
  @ApiCreatedResponse({
    description: 'Currency registration completed successfully!',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Credit Card' },
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
  async create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.create(createCurrencyDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all currencies' })
  @ApiOkResponse({
    description: 'List all currencies',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Credit Card' },
        createdAt: { type: 'date', example: '2024-02-23 11:54:27.472' },
        updatedAt: { type: 'date', example: '2024-02-23 11:54:27.472' },
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
  @Get()
  async findAll() {
    return this.currenciesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Return a currency by id' })
  @ApiOkResponse({
    status: 200,
    description: 'Return currency by Id',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', description: 'id currency' },
        name: { type: 'string' },
      },
      example: {
        id: 1,
        name: 'Credit Card',
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
    description: 'Currency id not found',
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
    return this.currenciesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update name of currency by id' })
  @ApiOkResponse({
    description: 'Update name of currency by id',
    schema: {
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Debit Card' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Currency id not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Currency id not found' },
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
    @Body() updateCurrencyDto: UpdateCurrencyDto,
  ) {
    return this.currenciesService.update(+id, updateCurrencyDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete currency by id' })
  @ApiOkResponse({
    description: 'Delete currency by id',
    status: 200,
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Credit Card' },
        createdAt: { type: 'date', example: '2024-02-23 11:54:27.472' },
        updatedAt: { type: 'date', example: '2024-02-23 11:54:27.472' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Currency id not found',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Currency id not found' },
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
    return this.currenciesService.remove(+id);
  }
}
