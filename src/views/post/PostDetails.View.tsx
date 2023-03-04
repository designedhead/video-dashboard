import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  Icon,
} from "@chakra-ui/react";
import React from "react";
import type { ExtendedSession } from "src/types/auth.js";
import { type ParsedPost } from "src/types/postTypes";
import dynamic from "next/dynamic";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
// import ShareIcon from "@mui/icons-material/Share";
import Link from "next/link";
import { api } from "@/utils/api";
import { AnimatePresence, motion } from "framer-motion";
import PostOptions from "./components/PostOptions";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const now = new Date();
const lastWeekStart = new Date(
  now.getFullYear(),
  now.getMonth(),
  now.getDate() - 2
);

const PostDetails = ({
  post,
  session,
}: {
  post: ParsedPost;
  session: ExtendedSession;
}) => {
  const {
    title,
    preview_url,
    createdAt,
    author,
    description,
    softwareType,
    url,
    plugins,
    categories,
    likedBy,
    _count: { likedBy: likesCount },
  } = post;

  const isNew = new Date(createdAt) >= lastWeekStart;
  const [videoControls, setVideocontrols] = React.useState(false);
  const [totalLikes, setTotalLikes] = React.useState(likesCount || 0);

  const [liked, setLiked] = React.useState(!!likedBy.length);

  const { mutate } = api.likes.create.useMutation();

  const handleLike = () => {
    mutate({ id: post.id, value: !liked });
    if (liked) {
      setTotalLikes(totalLikes - 1);
    } else {
      setTotalLikes(totalLikes + 1);
    }
    setLiked(!liked);
  };

  return (
    <Stack
      w="full"
      // h="80vh"
      direction={{ base: "column", md: "row" }}
      spacing={10}
      mt={14}
      px={{ base: 10, md: 0 }}
      mb={20}
    >
      <Container w="full" p={0} m={0} maxW="unset">
        <Box
          borderRadius="lg"
          overflow="hidden"
          maxW="unset"
          onMouseEnter={() => setVideocontrols(true)}
          onMouseLeave={() => setVideocontrols(false)}
        >
          <ReactPlayer
            url={preview_url}
            loop
            muted
            controls={videoControls}
            autoPlay
            playing
            width="100%"
            height="100%"
          />
          {!!categories.length && (
            <Flex mt={5} gap={3} alignItems="center" wrap="wrap">
              <Text fontSize="sm">Categories:</Text>
              {categories.map((category) => (
                <Badge
                  key={category.id}
                  color="pink"
                  py={1}
                  px={2}
                  borderRadius="lg"
                >
                  {category.value}
                </Badge>
              ))}
            </Flex>
          )}
        </Box>
      </Container>
      <Flex w="50%" alignItems="flex-start" direction="column" gap={2}>
        <Heading as="h1" size="xl">
          {title} {isNew && <Badge variant="new">New</Badge>}
        </Heading>
        <Text
          fontSize="lg"
          color={useColorModeValue("blackAlpha.600", "whiteAlpha.600")}
        >
          By {author?.name}
        </Text>
        <HStack mt={5}>
          <Link href={url} passHref target="_blank">
            <Button
              variant="download"
              color={useColorModeValue("white", "gray.800")}
              size="md"
            >
              Download
            </Button>
          </Link>
          <AnimatePresence>
            <Button
              aria-label="Favourite"
              leftIcon={
                liked ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0, y: 20, rotate: 90 }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                      rotate: 0,
                      y: 0,
                      transition: {
                        type: "spring",
                        duration: 0.8,
                        bounce: 0.6,
                      },
                    }}
                    exit={{
                      x: -200,
                      width: 0,
                      opacity: 0,
                      transition: { type: "spring", duration: 0.7 },
                    }}
                  >
                    <Icon color="brand.primary" as={ThumbUpAltIcon} />
                  </motion.div>
                ) : (
                  <ThumbUpOffAltIcon />
                )
              }
              variant={liked ? "solid" : "outline"}
              borderRadius="full"
              p={3}
              h="full"
              onClick={handleLike}
            >
              {totalLikes} Likes
            </Button>
          </AnimatePresence>
          {session?.user?.admin && <PostOptions id={post?.id} />}
          {/* <IconButton
            aria-label="Share"
            icon={<ShareIcon />}
            variant="outline"
            borderRadius="full"
            p={3}
            h="full"
          /> */}
        </HStack>
        {description && (
          <VStack alignItems="flex-start" mt={10} spacing={5}>
            <Heading as="h3" size="sm">
              Template Details
            </Heading>
            <Text fontSize="md" lineHeight={1.7}>
              {description}
            </Text>
          </VStack>
        )}
        {!!softwareType.length && (
          <VStack alignItems="flex-start" mt={8} spacing={5}>
            <Heading as="h3" size="sm">
              Compatible with
            </Heading>
            {softwareType.map((type) => (
              <Flex key={type.value} alignItems="center" gap={2}>
                <Box bgColor="brand.primary" w={2} h={2} borderRadius="full" />
                <Text fontSize="sm">{type.value}</Text>
              </Flex>
            ))}
          </VStack>
        )}
        {!!plugins.length && (
          <VStack alignItems="flex-start" mt={8} spacing={5}>
            <Heading as="h3" size="sm">
              Plugins used
            </Heading>
            {plugins.map((type) => (
              <Flex key={type.value} alignItems="center" gap={2}>
                <Box bgColor="gold" w={2} h={2} borderRadius="full" />
                <Text fontSize="sm">{type.value}</Text>
              </Flex>
            ))}
          </VStack>
        )}
      </Flex>
    </Stack>
  );
};

export default PostDetails;
