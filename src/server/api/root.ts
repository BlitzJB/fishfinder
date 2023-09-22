import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posingurlRouter } from "./routers/posingurl";
import { constantsRouter } from "./routers/constants";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  posingurl: posingurlRouter,
  constants: constantsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

