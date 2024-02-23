import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoriesIncomeDto } from './dto/create-categories.income.dto';
import { UpdateCategoriesIncomeDto } from './dto/update-categories.income.dto';
import { PrismaService } from '../prisma_client/prisma.service';

@Injectable()
export class CategoriesIncomesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCategoriesIncomeDto) {
    if (!data.name) {
      throw new BadRequestException('Name is not empty');
    }

    return this.prisma.categories_Incomes.create({ data });
  }

  async findAll() {
    return this.prisma.categories_Incomes.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const categoriesIcomes = await this.prisma.categories_Incomes.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!categoriesIcomes) {
      throw new NotFoundException();
    }

    return categoriesIcomes;
  }

  async update(
    id: number,
    updateCategoriesIncomeDto: UpdateCategoriesIncomeDto,
  ) {
    const categoryIncome = await this.prisma.categories_Incomes.findUnique({
      where: { id },
    });

    if (!categoryIncome) {
      throw new NotFoundException('Category of Income not found');
    }

    if (!updateCategoriesIncomeDto.name) {
      throw new BadRequestException('Name is not empty!');
    }

    return this.prisma.categories_Incomes.update({
      where: {
        id: id,
      },
      data: { name: updateCategoriesIncomeDto.name, updatedAt: new Date() },
    });
  }

  async remove(id: number) {
    const categoryIncome = await this.prisma.categories_Incomes.findUnique({
      where: { id },
    });

    if (!categoryIncome) {
      throw new NotFoundException('Category of income not found');
    }

    return this.prisma.categories_Incomes.delete({
      where: { id },
    });
  }
}
