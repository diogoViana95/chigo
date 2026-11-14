import 'dotenv/config';
import { PrismaPostgresAdapter } from '@prisma/adapter-ppg';
import { PrismaClient } from '../generated/prisma/client';
import { hash } from 'bcryptjs';
import { products } from '../lib/products';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL não está definida. Configure o ficheiro .env.');
const prisma = new PrismaClient({ adapter: new PrismaPostgresAdapter({ connectionString }) });

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin';
  if (!(await prisma.user.findUnique({ where: { username } }))) {
    await prisma.user.create({ data: { username, passwordHash: await hash(password, 12), mustChangePassword: true } });
  }
  for (const item of products) {
    await prisma.product.upsert({ where: { slug: item.slug }, create: { ...item, imageUrl: item.imageUrl, price: item.price }, update: {} });
  }
}

main().finally(() => prisma.$disconnect());
