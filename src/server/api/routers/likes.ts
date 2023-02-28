import { z } from "zod";
import ThrowError from "../../../helpers/ThrowError";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const likesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ id: z.string(), value: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const liked = await ctx.prisma.post.update({
          where: {
            id: input.id,
          },
          data: {
            likedBy: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        });
        return liked;
      } catch (e) {
        ThrowError(e);
      }
      return [];
    }),
});
