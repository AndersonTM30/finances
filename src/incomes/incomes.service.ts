import { Injectable, NotFoundException } from '@nestjs/common';
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
    return this.prisma.incomes.findMany({
      select: {
        id: true,
        description: true,
        date: true,
        value: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async findOne(id: number) {
    this.notEmptyField.isValidIncomeId(id);
    const incomeData = await this.prisma.incomes.findUnique({
      where: { id: id },
      select: {
        id: true,
        description: true,
        date: true,
        value: true,
      },
    });

    if (!incomeData) {
      throw new NotFoundException();
    }
    return incomeData;
  }

  async update(id: number, updateIncomeDto: UpdateIncomeDto) {
    this.notEmptyField.validationEmptyFiledDescription(
      updateIncomeDto.description,
    );
    this.notEmptyField.validationEmptyFiledCategoryId(
      updateIncomeDto.categoryId,
    );
    this.notEmptyField.validationEmptyFiledUserId(updateIncomeDto.userId);
    this.notEmptyField.validationEmptyFiledCurrencyId(
      updateIncomeDto.currencyId,
    );
    this.notEmptyField.validationEmptyFiledDate(updateIncomeDto.date);
    this.notEmptyField.validationEmptyFiledValue(updateIncomeDto.value);
    const incomeData = await this.prisma.incomes.findUnique({
      where: { id },
    });

    if (!incomeData) {
      throw new NotFoundException('Income not found');
    }
    // finalizar essa query
    return this.prisma.incomes.update({
      where: { id },
      data: { description: updateIncomeDto.description },
    });
  }

  async remove(id: number) {
    return `This action removes a #${id} income`;
  }
}
