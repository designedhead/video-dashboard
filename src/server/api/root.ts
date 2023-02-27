import { createTRPCRouter } from "./trpc";
import { categoriesRouter } from "./routers/categories";
import { postsRouter } from "./routers/posts";
import { softwareRouter } from "./routers/softwares";
import { pluginsRouter } from "./routers/plugins";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  posts: postsRouter,
  softwares: softwareRouter,
  plugins: pluginsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;