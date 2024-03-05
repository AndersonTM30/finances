import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const saltOrRounds = 10;
  const hashedPassword = await bcrypt.hash('12341245', saltOrRounds);
  const user = await prisma.users.upsert({
    where: { id: 1 },
    update: {},
    create: {
      username: 'Anderson',
      password: hashedPassword,
    },
  });

  const currency = await prisma.currencies.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Dinheiro',
    },
  });

  const categoriesIncomes = await prisma.categories_Incomes.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Salário',
    },
  });

  const categoriesExpenses = await prisma.categories_Expenses.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Water bill',
    },
  });

  const incomes = await prisma.incomes.upsert({
    where: { id: 1 },
    update: {},
    create: {
      description: 'Recebimento de Salário',
      categoryId: 1,
      userId: 1,
      currencyId: 1,
      date: '2024-02-27T10:08:00.777Z',
      value: 260.0,
    },
  });

  const expenses = await prisma.expenses.upsert({
    where: { id: 1 },
    update: {},
    create: {
      description: 'Pagamento de Boleto',
      categoryId: 1,
      userId: 1,
      currencyId: 1,
      date: '2024-02-27T10:08:00.777Z',
      value: 260.0,
    },
  });

  console.log({
    user,
    currency,
    categoriesIncomes,
    categoriesExpenses,
    incomes,
    expenses,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(1);
  });
