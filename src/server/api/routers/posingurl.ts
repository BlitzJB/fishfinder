import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";


/* 
model PosingUrl {
    id       String   @id @default(uuid())
    url      String
    originalUrl String
    reviewed Boolean @default(false)
    manualReviewResult String?
    manualReviewComment String?
    userSubmitted Boolean @default(false)
    
    regex   String
    jaro    String
    levenshtein String
    suspeciousSSL String
    suspeciousIPRange String
    imageComparison String
    // ... Any other URL metrics can be added here

    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}
*/

export const posingurlRouter = createTRPCRouter({
    read: publicProcedure
        .query(async ({ ctx }) => {
            const posingurls = await ctx.prisma.posingUrl.findMany();
            return posingurls;
        }),
    readOne: publicProcedure
        .input(z.object({
            id: z.string()
        }))
        .query(
            async ({ input, ctx }) => {
                const posingurl = await ctx.prisma.posingUrl.findUnique({
                    where: {
                        id: input.id
                    }
                });
                return posingurl;
            }
        ),
    readAllReviewed: publicProcedure
        .query(async ({ ctx }) => {
            const posingurls = await ctx.prisma.posingUrl.findMany({
                where: {
                    reviewed: true
                }
            });
            return posingurls;
        }),
    readAllPhishing: publicProcedure
        .query(async ({ ctx }) => {
            return await ctx.prisma.posingUrl.findMany({
                where: {
                    manualReviewResult: "PHISHING"
                }
            })
        }),
    create: publicProcedure
        .input(z.object({
            url: z.string(),
            originalUrl: z.string(),
            reviewed: z.boolean(),
            userSubmitted: z.boolean(),
            regex: z.string(),
            jaro: z.string(),
            levenshtein: z.string(),
            suspeciousSSL: z.string(),
            suspeciousIPRange: z.string(),
            imageComparison: z.string()
        }))
        .mutation(
            async ({ input, ctx }) => {
                const posingurl = await ctx.prisma.posingUrl.create({
                    data: {
                        url: input.url,
                        originalUrl: input.originalUrl,
                        reviewed: input.reviewed,
                        userSubmitted: input.userSubmitted,
                        regex: input.regex,
                        jaro: input.jaro,
                        levenshtein: input.levenshtein,
                        suspeciousSSL: input.suspeciousSSL,
                        suspeciousIPRange: input.suspeciousIPRange,
                        imageComparison: input.imageComparison
                    }
                });
                return posingurl;
            }
        ),
    update: publicProcedure
        .input(z.object({
            id: z.string(),
            url: z.string().optional(),
            originalUrl: z.string().optional(),
            reviewed: z.boolean().optional(),
            userSubmitted: z.boolean().optional(),
            regex: z.string().optional(),
            jaro: z.string().optional(),
            levenshtein: z.string().optional(),
            suspeciousSSL: z.string().optional(),
            suspeciousIPRange: z.string().optional(),
            imageComparison: z.string().optional()
        }))
        .mutation(
            async ({ input, ctx }) => {
                const posingurl = await ctx.prisma.posingUrl.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        url: input.url,
                        originalUrl: input.originalUrl,
                        reviewed: input.reviewed,
                        userSubmitted: input.userSubmitted,
                        regex: input.regex,
                        jaro: input.jaro,
                        levenshtein: input.levenshtein,
                        suspeciousSSL: input.suspeciousSSL,
                        suspeciousIPRange: input.suspeciousIPRange,
                        imageComparison: input.imageComparison
                    }
                });
                return posingurl;
            }
        ),
    delete: publicProcedure
        .input(z.object({
            id: z.string()
        }))
        .mutation(
            async ({ input, ctx }) => {
                const posingurl = await ctx.prisma.posingUrl.delete({
                    where: {
                        id: input.id
                    }
                });
                return posingurl;
            }
        ),
    getUrlsAwaitingReview: publicProcedure
        .query(async ({ ctx }) => {
            const posingurls = await ctx.prisma.posingUrl.findMany({
                where: {
                    reviewed: false
                }
            });
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            return posingurls;
        }),
    reviewUrl: publicProcedure
        .input(z.object({
            id: z.string(),
            manualReviewResult: z.string(),
            manualReviewComment: z.string()
        }))
        .mutation(
            async ({ input, ctx }) => {
                const posingurl = await ctx.prisma.posingUrl.update({
                    where: {
                        id: input.id
                    },
                    data: {
                        reviewed: true,
                        manualReviewResult: input.manualReviewResult,
                        manualReviewComment: input.manualReviewComment
                    }
                });
                return posingurl;
            }
        ),
});