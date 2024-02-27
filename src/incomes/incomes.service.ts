import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { PrismaService } from '../prisma_client/prisma.service';
import { NotEmptyField } from './validations/not.empty.field';

@Injectable()
export class IncomesService {
  constructor(
    private prisma: PrismaService,
    private notEmptyField: NotEmptyField,
  ) {}

  async create(data: CreateIncomeDto) {
    this.notEmptyField.validationEmptyFiledDescription(data.description);
    this.notEmptyField.validationEmptyFiledCategoryId(data.categoryId);
    this.notEmptyField.validationEmptyFiledUserId(data.userId);
    this.notEmptyField.validationEmptyFiledCurrencyId(data.currencyId);
    this.notEmptyField.validationEmptyFiledDate(data.date);
    this.notEmptyField.validationEmptyFiledValue(data.value);
    return this.prisma.incomes.create({ data });
  }

  async findAll() {
    return `This action returns all incomes`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} income`;
  }

  async update(id: number, updateIncomeDto: UpdateIncomeDto) {
    return `This action updates a #${id} income`;
  }

  async remove(id: number) {
    return `This action removes a #${id} income`;
  }
}
