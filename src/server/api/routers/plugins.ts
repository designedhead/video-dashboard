import { z } from "zod";
import ThrowError from "../../../helpers/ThrowError";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const pluginsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const plugins = await ctx.prisma.plugin.findMany({
        select: {
          id: true,
          value: true,
        },
      });

      return plugins || [];
    } catch (e) {
      ThrowError(e);
    }
    return [];
  }),
  createMany: protectedProcedure
    .input(z.object({ list: z.array(z.string()) }))
    .mutation(async ({ ctx, input: { list } }) => {
      try {
        const existing = await ctx.prisma.plugin.findMany();
        const unique = list.filter(
          (item) => !existing.find((ex) => ex.value === item)
        );

        const createdPlugins = await ctx.prisma.plugin.createMany({
          data: unique.map((plugin) => ({
            value: plugin,
          })),
          skipDuplicates: true,
        });

        return createdPlugins || [];
      } catch (e) {
        ThrowError(e);
      }
      return null;
    }),
});
