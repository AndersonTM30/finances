import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { PrismaService } from '../prisma_client/prisma.service';

@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCurrencyDto): Promise<CreateCurrencyDto> {
    if (!data.name) {
      throw new BadRequestException('Name is not empty!');
    }

    return this.prisma.currencies.create({ data });
  }

  async findAll() {
    return this.prisma.currencies.findMany({
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
    const currencies = await this.prisma.currencies.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });

    if (!currencies) {
      throw new NotFoundException();
    }

    return currencies;
  }

  async update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    const currency = await this.prisma.currencies.findUnique({
      where: { id },
    });

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    if (!updateCurrencyDto.name) {
      throw new BadRequestException('Name is not empty!');
    }

    return this.prisma.currencies.update({
      where: {
        id: id,
      },
      data: { name: updateCurrencyDto.name, updatedAt: new Date() },
    });
  }

  async remove(id: number) {
    const currency = await this.prisma.currencies.findUnique({
      where: { id },
    });

    if (!currency) {
      throw new NotFoundException('Currency not found');
    }

    return this.prisma.currencies.delete({
      where: { id },
    });
  }
}
