import { Container, SimpleGrid, Skeleton, Text } from "@chakra-ui/react";
import React from "react";
import { type CompletePost } from "src/types/postTypes";
import PostTile from "./PostTile";

interface Props {
  data: CompletePost[];
  isLoading: boolean;
  isError: boolean;
}

const PostList = ({ data, isLoading, isError }: Props) => {
  if (isLoading) {
    return (
      <SimpleGrid columns={3} w="full" spacing={4}>
        {Array(6)
          .fill(1)
          .map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Skeleton w="full" h={44} key={i} borderRadius="lg" />
          ))}
      </SimpleGrid>
    );
  }
  if (isError) {
    return (
      <Container w="full">
        <Text>No results found</Text>
      </Container>
    );
  }
  if (!data?.length) return <div>No posts</div>;
  return (
    <SimpleGrid columns={{ base: 1, md: 3 }} w="full" spacing={4}>
      {data.map((post) => (
        <PostTile key={post.id} post={post} />
      ))}
    </SimpleGrid>
  );
};

export default PostList;
