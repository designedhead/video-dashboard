import { z } from "zod";
import ThrowError from "../../../helpers/ThrowError";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const categoriesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const categories = await ctx.prisma.categories.findMany({
        select: {
          value: true,
          label: true,
          id: true,
        },
      });

      return categories;
    } catch (e) {
      ThrowError(e);
    }
    return [];
  }),
  createMany: protectedProcedure
    .input(z.object({ categories: z.array(z.string()) }))
    .mutation(async ({ ctx, input: { categories } }) => {
      try {
        const existing = await ctx.prisma.categories.findMany();
        const unique = categories.filter(
          (item) => !existing.find((ex) => ex.value === item)
        );

        const createdCategories = await ctx.prisma.categories.createMany({
          data: unique.map((category) => ({
            label: category,
            value: category,
          })),
          skipDuplicates: true,
        });

        return createdCategories;
      } catch (e) {
        ThrowError(e);
      }
      return null;
    }),
});
