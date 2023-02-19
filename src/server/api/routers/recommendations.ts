import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import type { AI_RES } from "../../types/openai";
import { Configuration, OpenAIApi } from "openai";
import { booksRouter } from "./books";
import type { RecommendationsObject } from "../../../types/db";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const recommendationsRouter = createTRPCRouter({
  createRecommendations: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        manualUserEmail: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userEmail = input.manualUserEmail || ctx.session?.user?.email;
        if (!userEmail) {
          throw new Error("No user email");
        }

        const userBooks = await ctx.prisma.books.findMany({
          where: {
            users: {
              some: {
                email: userEmail,
              },
            },
          },
          include: {
            users: true,
          },
        });

        if (!process.env.OPENAI_API_KEY) {
          throw new Error("No API key");
        }

        if (!userBooks.length) {
          throw new Error("No books found");
        }

        const randomSelection = userBooks
          .sort(() => 0.5 - Math.random())
          .slice(0, 20);

        const prompt = `I'm an avid reader and I like the following books:
    ${randomSelection.join(", ")}.
    Give me a list of ${
      input.limit || 1
    } recommendations based on my previously read books. Provide the response as a JSON Array of objects with a title property and a reason property that contains a explanation why I would enjoy the book based on my previous reads.
    `;

        const openai = new OpenAIApi(configuration);

        const completion = (await openai.createCompletion({
          model: "text-davinci-003",
          prompt: prompt,
          max_tokens: 1000,
        })) as AI_RES;

        const aiRes: string = completion.data.choices[0]?.text || "";

        const recommendationsArray = JSON.parse(aiRes) as {
          title: string;
          reason: string;
        }[];
        //

        const bookCaller = booksRouter.createCaller(ctx);

        const googleResult = await Promise.all(
          recommendationsArray.map(async (rec) => {
            const search = await bookCaller.search({
              term: rec.title,
              limit: 1,
            });
            return { ...search[0], reason: rec.reason };
          })
        );

        if (!googleResult.length)
          throw new Error("No results found in books api search");

        const user = await ctx.prisma.user.findUnique({
          where: {
            email: userEmail,
          },
        });

        const googleMapped = googleResult.map(async (res) => {
          if (!res) return null;
          const categoriesMap = res.categories?.map((category) => {
            return {
              where: {
                name: category,
              },
              create: {
                name: category,
              },
            };
          });

          const authorsMap = res.authors?.map((author) => {
            return {
              where: {
                name: author,
              },
              create: {
                name: author,
              },
            };
          });

          // const imageResult = (await openai.createImage({
          //   prompt: `${res.title || ""} - ${`by ${
          //     res.authors?.join("") || ""
          //   }`} a computer rendering by stephan martiniere, cgsociety contest winner, concept art`,
          //   n: 1,
          //   size: "512x512",
          // })) as unknown as { data: { data: { url: string }[] } };

          try {
            const created = await ctx.prisma.user_Recommendation.create({
              data: {
                user: {
                  connect: {
                    id: user?.id || "",
                  },
                },
                reason: res.reason,
                // ...(!!imageResult?.data?.data?.length && {
                //   coverImage: imageResult?.data?.data[0]?.url,
                // }),
                book: {
                  connectOrCreate: {
                    where: {
                      title: res.title,
                    },
                    create: {
                      title: res.title || "",
                      ...(res.subtitle && { subtitle: res.subtitle }),
                      ...(res.description && { description: res.description }),
                      ...(res.images && { image: res.images?.thumbnail }),
                      ...(res.pageCount && { pageCount: res.pageCount }),
                      ...(res.rating && { rating: res.rating }),
                      ...(res.publishedDate && {
                        publishedDate: res.publishedDate,
                      }),
                      ...(categoriesMap && {
                        categories: {
                          connectOrCreate: [...categoriesMap],
                        },
                      }),
                      ...(authorsMap && {
                        authors: {
                          connectOrCreate: [...authorsMap],
                        },
                      }),
                    },
                  },
                },
              },
              include: {
                book: {
                  include: {
                    authors: true,
                    categories: true,
                  },
                },
              },
            });
            return created;
          } catch (e) {
            console.log("Creating recomendations", e);
          }
          return "success";
        });

        return (await Promise.all(
          googleMapped
        )) as unknown as RecommendationsObject[];
      } catch (e) {
        console.log("🚀  recommendationsRouter", e);
        if (typeof e === "string") {
          throw new Error(e);
        } else if (e instanceof Error) {
          throw new Error(e.message);
        }
      }
    }),

  getUserRecomendations: protectedProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input: limit }) => {
      const userEmail = ctx.session?.user?.email;
      if (!userEmail) {
        throw new Error("No user email");
      }

      const bookRecomendations = (await ctx.prisma.user_Recommendation.findMany(
        {
          where: {
            user: {
              email: userEmail,
            },
            dismissed: false,
          },
          include: {
            book: {
              include: {
                authors: true,
                categories: true,
              },
            },
          },
          take: limit || 9,
          orderBy: {
            createdAt: "desc",
          },
        }
      )) as RecommendationsObject[];

      return bookRecomendations || [];
    }),
  deleteRecomendation: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        const userEmail = ctx.session?.user?.email;
        if (!userEmail) {
          throw new Error("No user email");
        }

        const deleted = await ctx.prisma.user_Recommendation.update({
          where: {
            userId_bookId: {
              userId: ctx.session.user.id,
              bookId: id,
            },
          },
          data: {
            dismissed: true,
          },
        });

        return deleted;
      } catch (e) {
        if (typeof e === "string") {
          throw new Error(e);
        } else if (e instanceof Error) {
          throw new Error(e.message);
        }
      }
    }),
});
