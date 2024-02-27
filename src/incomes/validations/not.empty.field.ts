import { BadRequestException, NotFoundException } from '@nestjs/common';

export class NotEmptyField {
  validationEmptyFiledDescription(field: string) {
    if (!field) {
      throw new BadRequestException(`Description is not empty`);
    }
    return field;
  }

  validationEmptyFiledCategoryId(field: number) {
    if (!field) {
      throw new BadRequestException(`CategoryId is not empty`);
    }
    return field;
  }

  validationEmptyFiledUserId(field: number) {
    if (!field) {
      throw new BadRequestException(`UserId is not empty`);
    }
    return field;
  }

  validationEmptyFiledCurrencyId(field: number) {
    if (!field) {
      throw new BadRequestException(`CurrencyId is not empty`);
    }
    return field;
  }

  validationEmptyFiledDate(field: string) {
    if (!field) {
      throw new BadRequestException(`Date is not empty`);
    }
    return field;
  }

  validationEmptyFiledValue(field: number) {
    if (!field) {
      throw new BadRequestException(`Value is not empty`);
    }
    return field;
  }

  isValidIncomeId(id: number) {
    if (!id) {
      throw new NotFoundException('Income not found!');
    }

    return id;
  }
}
