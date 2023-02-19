import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { recommendationsRouter } from "./recommendations";
import type { RecommendationsObject } from "../../../types/db";

export const cronRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        pass: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      throw new Error("stop");
      try {
        console.log("🚀  input", input);
        if (input.pass !== process.env.CRON_PASS) {
          throw new Error("Unauthorized");
        }
        console.log("hit");

        const allUsers = await ctx.prisma.user.findMany({
          include: { recommendations: true },
        });

        const recomendationsRouter = recommendationsRouter.createCaller(ctx);

        const created: RecommendationsObject[] = [];

        for (const user of allUsers) {
          const validRecomendations = user.recommendations.length > 5;
          if (!validRecomendations) {
            await recomendationsRouter.createRecommendations({
              manualUserEmail: user.email || "",
              limit: 5 - user.recommendations.length,
            });
            // created.push(...created);
          }
        }

        return created;
      } catch (e) {
        console.log("🚀  cronRouter", e);
        return e;
      }
    }),
});
