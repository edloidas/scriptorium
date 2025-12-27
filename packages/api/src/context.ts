import { prisma } from '@scriptorium/db';

export function createTRPCContext(): Context {
  return {
    prisma,
  };
}

export type Context = {
  prisma: typeof prisma;
};
