import { createTRPCRouter } from "./trpc";
import { booksRouter } from "./routers/books";
import { recommendationsRouter } from "./routers/recommendations";
import { cronRouter } from "./routers/cron";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  books: booksRouter,
  recomendations: recommendationsRouter,
  cron: cronRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
