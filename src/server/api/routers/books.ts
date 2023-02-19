import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import type { GoogleResponse, GoogleItem, Book } from "../../types/google";
const LIMIT = 9;
export const booksRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ term: z.string(), limit: z.number().optional() }))
    .query(async ({ input, ctx }) => {
      const userEmail = ctx.session?.user?.email;
      const searchParams = `q=${input.term}&?key=${
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        process.env.GOOGLE_BOOKS_API
      }&?maxResults=${input.limit || 8}`;
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?${searchParams}}`
      );
      const results = (await res.json()) as GoogleResponse;

      const data = await ctx.prisma.user.findUnique({
        where: { email: userEmail || "" },
        include: { books: true },
      });

      const sanatisedData = results.items.map((book: GoogleItem) => {
        const info = book.volumeInfo;

        const bookExists = !!data?.books.find(
          (book) => book.title === info.title
        );

        const bookObj: Book = {
          id: book.id,
          title: info.title,
          subtitle: info.subtitle,
          description: info.description,
          categories: info.categories,
          authors: info.authors,
          rating: info.averageRating,
          images: info.imageLinks,
          publishedDate: info.publishedDate,
          pageCount: info.pageCount,
          userRead: bookExists,
        };

        return bookObj;
      });

      return sanatisedData;
    }),
  getAll: protectedProcedure
    .input(
      z.object({ limit: z.number().optional(), skip: z.number().optional() })
    )
    .query(async ({ ctx, input }) => {
      const userEmail = ctx.session?.user?.email;
      const { limit, skip } = input;
      const [total, books] = await ctx.prisma.$transaction([
        ctx.prisma.books.count({
          where: {
            users: {
              some: {
                email: userEmail || "",
              },
            },
          },
        }),
        ctx.prisma.books.findMany({
          where: {
            users: {
              some: {
                email: userEmail || "",
              },
            },
          },
          skip: skip ? skip - 1 : 0,
          take: limit || LIMIT,
          include: {
            authors: true,
            categories: true,
          },
        }),
      ]);
      return {
        books,
        total: {
          count: total,
          pages: Math.ceil(total / (limit || LIMIT)),
        },
      };
    }),

  addBook: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        description: z.string().optional(),
        image: z.string().url({ message: "Invalid url" }).optional(),
        publishedDate: z.string().optional(),
        pageCount: z.number().optional(),
        rating: z.number().optional(),
        categories: z.string().array().optional(),
        authors: z.string().array().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userEmail = ctx.session.user.email;
      const {
        title,
        subtitle,
        description,
        image,
        publishedDate,
        pageCount,
        rating,
        categories,
        authors,
      } = input;

      const categoriesMap = categories?.map((category) => {
        return {
          create: {
            name: category,
          },
          where: {
            name: category,
          },
        };
      });

      const authorsMap = authors?.map((author) => {
        return {
          create: {
            name: author,
          },
          where: {
            name: author,
          },
        };
      });

      const book = await ctx.prisma.books.upsert({
        where: {
          title: input.title,
        },
        update: {
          users: {
            connect: {
              email: userEmail || "",
            },
          },
        },
        create: {
          title: title,
          subtitle: subtitle || null,
          description: description || null,
          image: image || null,
          pageCount: pageCount || null,
          rating: rating || null,
          publishedDate: publishedDate || null,
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
          users: {
            connect: {
              email: userEmail || "",
            },
          },
        },
        include: {
          User_Recommendation: true,
        },
      });
      if (book.User_Recommendation.length) {
        const userData = await ctx.prisma.user.findUnique({
          where: {
            email: userEmail || "",
          },
        });
        const recomendationExists = book.User_Recommendation.find(
          (e: { userId: string }) => e.userId === userData?.id
        );
        if (recomendationExists) {
          await ctx.prisma.user_Recommendation.delete({
            where: {
              userId_bookId: {
                userId: userData?.id || "",
                bookId: book.id,
              },
            },
          });
        }
      }
      return book;
    }),
  removeBook: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      const userEmail = ctx.session?.user?.email;
      const deleted = await ctx.prisma.books.update({
        where: {
          id: input,
        },
        data: {
          users: {
            disconnect: {
              email: userEmail || "",
            },
          },
        },
      });

      return deleted;
    }),
  getTotal: protectedProcedure.query(async ({ ctx }) => {
    const userEmail = ctx.session?.user?.email;
    const total = await ctx.prisma.books.count({
      where: {
        users: {
          some: {
            email: userEmail,
          },
        },
      },
    });
    const res: number = total || 0;
    return res;
  }),
  connectBook: protectedProcedure
    .input(z.object({ bookID: z.string() }))
    .mutation(async ({ ctx, input: { bookID } }) => {
      try {
        const userId = ctx.session?.user?.id;
        if (!userId) throw new Error("User not found");

        await ctx.prisma.$transaction([
          ctx.prisma.user.update({
            where: {
              id: userId,
            },
            data: {
              books: {
                connect: {
                  id: bookID,
                },
              },
            },
          }),
          ctx.prisma.user_Recommendation.update({
            where: {
              userId_bookId: {
                userId: userId,
                bookId: bookID,
              },
            },
            data: {
              dismissed: true,
            },
          }),
        ]);

        return "Sucess";
      } catch (e) {
        if (typeof e === "string") {
          throw new Error(e);
        } else if (e instanceof Error) {
          throw new Error(e.message);
        }
      }
    }),
});
