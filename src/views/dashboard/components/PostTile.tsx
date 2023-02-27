import { Badge, Box, Center, Spinner, Text, VStack } from "@chakra-ui/react";
import type { Post, Categories } from "@prisma/client";
import Link from "next/link";
import React from "react";
import HoverVideoPlayer from "react-hover-video-player";

interface CompletePost extends Post {
  categories: Categories[];
  author: {
    image: string | null;
    id: string;
    name: string | null;
  };
}

const now = new Date();
const lastWeekStart = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - 1
);

interface Props {
  post: CompletePost;
}

const PostTile = ({ post }: Props) => {
  const { title, preview_url, createdAt, id } = post;
  const isNew = createdAt >= lastWeekStart;

  return (
    <Link href={`/post/${id}`}>
      <Box
        borderRadius="lg"
        overflow="hidden"
        w="full"
        h="full"
        backgroundColor="brand.primary"
        position="relative"
        cursor="pointer"
      >
        <HoverVideoPlayer
          videoSrc={`https://drive.google.com/uc?export=download&id=${preview_url}`}
          style={{ width: "100%", height: "100%" }}
          videoStyle={{
            height: "100%",
          }}
          pausedOverlay={
            <VStack
              w="full"
              h="full"
              bgColor="blackAlpha.700"
              alignItems="flex-start"
              justifyContent="flex-end"
              p={4}
            >
              <Text fontSize="lg" fontWeight="bold">
                {title}
              </Text>
            </VStack>
          }
          loadingOverlay={
            <Center w="full" h="full" bgColor="whiteAlpha.400">
              <Spinner size="xl" />
            </Center>
          }
        />
        {isNew && (
          <Badge
            position="absolute"
            top={3}
            left={3}
            zIndex={4}
            colorScheme="pink"
            variant="subtle"
          >
            New
          </Badge>
        )}
      </Box>
    </Link>
  );
};

export default PostTile;
