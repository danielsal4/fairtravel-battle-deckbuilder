import { PrismaD1 } from '@prisma/adapter-d1';
import { PrismaClient } from '../generated/prisma';

export function createPrisma(database: D1Database): PrismaClient {
  return new PrismaClient({
    adapter: new PrismaD1(database),
  });
}
