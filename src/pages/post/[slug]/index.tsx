import React from "react";
import type { GetServerSidePropsContext } from "next";
import { type ParsedPost } from "src/types/postTypes";
import type { ExtendedSession } from "src/types/auth";
import { prisma } from "@/server/db";
import { Container } from "@chakra-ui/react";
import PostDetails from "src/views/post/PostDetails.View";
import { getServerAuthSession } from "../../../server/auth";

interface Props {
  post: ParsedPost;
  session: ExtendedSession;
}

const PostPage = ({ post, session }: Props) => (
  <Container maxW="7xl" p={0}>
    <PostDetails post={post} session={session} />
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
          // @ts-expect-error Thinks there is no session
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
PostPage.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  hasHeader: true,
};

export default PostPage;
