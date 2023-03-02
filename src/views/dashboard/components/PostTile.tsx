import {
  Badge,
  Box,
  Center,
  Spinner,
  Text,
  VStack,
  Icon,
  Flex,
} from "@chakra-ui/react";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Link from "next/link";
import React from "react";
import HoverVideoPlayer from "react-hover-video-player";
import { type CompletePost } from "src/types/postTypes";

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
  const {
    title,
    preview_url,
    createdAt,
    id,
    _count: { likedBy },
  } = post;

  const isNew = createdAt >= lastWeekStart;

  const indexOfSplice = preview_url.indexOf("upload/") + 7;

  const urlWithParams = `${preview_url.slice(
    0,
    indexOfSplice
  )}h_400,w_710,q_60/${preview_url.slice(indexOfSplice)}`;

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
          videoSrc={urlWithParams}
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
              spacing={0}
            >
              <Text fontSize="lg" fontWeight="bold">
                {title}
              </Text>
              <Flex
                fontSize="xx-small"
                bgColor="whiteAlpha.100"
                color="whiteAlpha.600"
                alignItems="center"
                justifyContent="center"
                gap={1}
                p={1}
                borderRadius="md"
                aria-label={`${likedBy} Likes`}
              >
                {likedBy}
                <Icon as={ThumbUpAltIcon} h={3} w={3} />
              </Flex>
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
