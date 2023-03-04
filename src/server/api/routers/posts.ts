import { z } from "zod";
import ThrowError from "../../../helpers/ThrowError";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const LIMIT = 10;

export const postsRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().optional(),
        page: z.number(),
        searchTerm: z.string().optional(),
        sortBy: z.enum(["recent", "popular", "default"]).optional(),
        filters: z.object({
          software: z.array(z.string()),
          plugin: z.array(z.string()),
          category: z.array(z.string()),
        }),
      })
    )
    .query(async ({ input, ctx }) => {
      const resultsLimit = input.limit || LIMIT;
      const resultsSkip = (input.page - 1) * resultsLimit;

      const { searchTerm, filters } = input;
      const { software, plugin, category } = filters;
      const activeFiltering =
        !!searchTerm ||
        !!software?.length ||
        !!plugin.length ||
        !!category.length;
      try {
        const posts = await ctx.prisma.post.findMany({
          include: {
            categories: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            softwareType: true,
            plugins: true,
            _count: {
              select: {
                likedBy: true,
              },
            },
          },
          where: {
            deletedAt: null,
          },
          skip: resultsSkip,
          take: resultsLimit,
          ...(activeFiltering && {
            where: {
              ...(searchTerm && {
                title: {
                  contains: searchTerm,
                  mode: "insensitive",
                },
              }),
              ...(filters != null && {
                ...(!!software.length && {
                  softwareType: {
                    some: {
                      value: {
                        in: software,
                      },
                    },
                  },
                }),
                ...(!!plugin.length && {
                  plugins: {
                    some: {
                      value: {
                        in: plugin,
                      },
                    },
                  },
                }),
                ...(!!category.length && {
                  categories: {
                    some: {
                      value: {
                        in: category,
                      },
                    },
                  },
                }),
              }),
            },
          }),
          ...(input.sortBy &&
            input.sortBy !== "default" && {
              orderBy: {
                ...(input.sortBy === "recent" && { createdAt: "desc" }),
                ...(input.sortBy === "popular" && {
                  likedBy: {
                    _count: "desc",
                  },
                }),
              },
            }),
        });

        return posts;
      } catch (e) {
        ThrowError(e);
      }
      return [];
    }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        categories: z.array(z.string()),
        download: z.string(),
        description: z.string().optional(),
        video: z.string(),
        softwares: z.array(z.string()).optional(),
        plugins: z.array(z.string()).optional(),
        id: z.string().optional(),
      })
    )
    .mutation(
      async ({
        ctx,
        input: {
          id,
          name,
          categories,
          download,
          description,
          video,
          softwares,
          plugins,
        },
      }) => {
        try {
          const obj = {
            title: name.trim(),
            description: description || "",
            preview_url: video,
            url: download,
            categories: {
              connectOrCreate: categories.map((category) => ({
                where: {
                  value: category,
                },
                create: {
                  label: category,
                  value: category,
                },
              })),
            },
            ...(softwares?.length && {
              softwareType: {
                connectOrCreate: softwares.map((software) => ({
                  where: {
                    value: software,
                  },
                  create: {
                    value: software,
                  },
                })),
              },
            }),
            ...(plugins?.length && {
              plugins: {
                connectOrCreate: plugins.map((plugin) => ({
                  where: {
                    value: plugin,
                  },
                  create: {
                    value: plugin,
                  },
                })),
              },
            }),
            author: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          };

          const newPost = await ctx.prisma.post.upsert({
            where: {
              id: id || "",
            },
            update: { ...obj, updatedAt: new Date() },
            create: { ...obj },
          });

          return newPost;
        } catch (e) {
          ThrowError(e);
        }
        return null;
      }
    ),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const post = await ctx.prisma.post.findUnique({
          where: {
            id: input.id,
          },
          include: {
            categories: true,
            author: true,
            softwareType: true,
            plugins: true,
          },
        });
        return post;
      } catch (e) {
        ThrowError(e);
      }
      return [];
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input: { id }, ctx }) => {
      try {
        const post = await ctx.prisma.post.update({
          where: {
            id,
          },
          data: {
            deletedAt: new Date(),
          },
        });
        return post;
      } catch (e) {
        ThrowError(e);
      }
      return [];
    }),
});
