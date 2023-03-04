import { createTRPCRouter } from "./trpc";
import { categoriesRouter } from "./routers/categories";
import { postsRouter } from "./routers/posts";
import { softwareRouter } from "./routers/softwares";
import { pluginsRouter } from "./routers/plugins";
import { likesRouter } from "./routers/likes";

export const appRouter = createTRPCRouter({
  categories: categoriesRouter,
  posts: postsRouter,
  softwares: softwareRouter,
  plugins: pluginsRouter,
  likes: likesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
