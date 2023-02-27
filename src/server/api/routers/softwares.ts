import { z } from "zod";
import ThrowError from "../../../helpers/ThrowError";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const softwareRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const softwares = await ctx.prisma.software.findMany({
        select: {
          id: true,
          value: true,
        },
      });

      return softwares || [];
    } catch (e) {
      ThrowError(e);
    }
    return [];
  }),
  createMany: protectedProcedure
    .input(z.object({ list: z.array(z.string()) }))
    .mutation(async ({ ctx, input: { list } }) => {
      try {
        const existing = await ctx.prisma.software.findMany();
        const unique = list.filter(
          (item) => !existing.find((ex) => ex.value === item)
        );

        const createdSoftwares = await ctx.prisma.software.createMany({
          data: unique.map((software) => ({
            value: software,
          })),
          skipDuplicates: true,
        });

        return createdSoftwares || [];
      } catch (e) {
        ThrowError(e);
      }
      return null;
    }),
});
