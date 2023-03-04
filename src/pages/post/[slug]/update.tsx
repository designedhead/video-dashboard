import React from "react";
import type { GetServerSidePropsContext } from "next";
import { type ParsedPost } from "src/types/postTypes";
import { prisma } from "@/server/db";
import { Container } from "@chakra-ui/react";
import CreateOrUpdate from "src/views/create/CreateOrUpdate";
import { getServerAuthSession } from "../../../server/auth";

interface Props {
  post: ParsedPost;
}

const Update = ({ post }: Props) => (
  <Container maxW="7xl" p={0}>
    <CreateOrUpdate existingData={post} />
  </Container>
);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
  const session = await getServerAuthSession(context);

  if (!session)
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };

  const id = context.params?.slug;

  if (!id) return { notFound: true };
  if (!session?.user?.admin)
    return {
      redirect: {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        destination: `/post/${id}`,
        permanent: false,
      },
    };

  const post = await prisma.post.findUnique({
    where: {
      id: id as string,
    },
    include: {
      categories: {
        select: {
          id: true,
          label: true,
          value: true,
        },
      },
      softwareType: true,
      plugins: true,
      author: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          likedBy: true,
        },
      },
      likedBy: {
        where: {
          id: session?.user.id,
        },
        select: {
          id: true,
        },
      },
    },
  });
  if (!post) return { notFound: true };

  const parsedPost = {
    ...post,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    deletedAt: post.deletedAt?.toISOString() || null,
  } as ParsedPost;

  return {
    props: { post: parsedPost, session },
  };
}
Update.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  hasHeader: true,
};

export default Update;
