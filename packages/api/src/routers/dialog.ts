import type { Prisma } from '@scriptorium/db';
import { z } from 'zod';

import { publicProcedure, router } from '../trpc';

export const dialogRouter = router({
  list: publicProcedure.input(z.object({ projectId: z.string() })).query(async ({ ctx, input }) => {
    return ctx.prisma.dialog.findMany({
      where: { projectId: input.projectId },
      orderBy: { updatedAt: 'desc' },
    });
  }),

  byId: publicProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    return ctx.prisma.dialog.findUnique({
      where: { id: input.id },
    });
  }),

  create: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string(),
        content: z.any().default({}),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.dialog.create({
        data: {
          projectId: input.projectId,
          title: input.title,
          content: input.content as Prisma.InputJsonValue,
        },
      });
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        content: z.any().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.dialog.update({
        where: { id: input.id },
        data: {
          ...(input.title !== undefined && { title: input.title }),
          ...(input.content !== undefined && { content: input.content as Prisma.InputJsonValue }),
        },
      });
    }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return ctx.prisma.dialog.delete({
      where: { id: input.id },
    });
  }),
});
