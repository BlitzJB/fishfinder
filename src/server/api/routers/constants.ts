import { createTRPCRouter, publicProcedure } from "../trpc"


export const constantsRouter = createTRPCRouter({
    reviewedStatuses: publicProcedure
        .query(async ({ ctx }) => {
            return [
                { id: "reviewed", name: "Reviewed" },
                { id: "notReviewed", name: "Not Reviewed" },
            ]
        }),
})