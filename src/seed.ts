import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.users.upsert({
    where: { id: 1 },
    update: {},
    create: {
      username: 'Anderson',
      password: '12341245',
    },
  });

  const currency = await prisma.currencies.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Dinheiro',
    },
  });

  console.log(user, currency);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
