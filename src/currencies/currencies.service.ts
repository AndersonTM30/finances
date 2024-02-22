import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { PrismaService } from '../prisma_client/prisma.service';

@Injectable()
export class CurrenciesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateCurrencyDto): Promise<CreateCurrencyDto> {
    return this.prisma.currencies.create({ data });
  }

  findAll() {
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

  findOne(id: number) {
    return this.prisma.currencies.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  update(id: number, updateCurrencyDto: UpdateCurrencyDto) {
    return this.prisma.currencies.update({
      where: {
        id: id,
      },
      data: { name: updateCurrencyDto.name },
    });
  }

  remove(id: number) {
    return this.prisma.currencies.delete({
      where: { id },
    });
  }
}
