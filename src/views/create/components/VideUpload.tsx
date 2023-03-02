// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from "react";
import {
  Box,
  Button,
  Center,
  Container,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";

import HoverVideoPlayer from "react-hover-video-player";
import { formatBytes } from "src/helpers/formatBytes";
import { ArrowForwardIcon, CloseIcon } from "@chakra-ui/icons";
import type { VideoObject } from "src/types/VideoTypes";

import useCloudinaryUploadWidget from "src/helpers/useCloudinaryUploadWidget";

const VideUpload = ({
  setVideo,
  video,
}: {
  // eslint-disable-next-line no-unused-vars
  setVideo: (e: null | VideoObject) => void;
  video: null | VideoObject;
}) => {
  const {
    fileUploader: { open },
    videoFile,
  } = useCloudinaryUploadWidget({
    onClose: () => setVideo(videoFile as unknown as VideoObject),
  });

  return (
    <Container p={0}>
      {!video ? (
        <Button
          // onClick={handleOpenPicker}
          rightIcon={<ArrowForwardIcon />}
          variant="outline"
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          onClick={() => open()}
        >
          Pick one
        </Button>
      ) : (
        <Box
          borderRadius="lg"
          overflow="hidden"
          w="577p"
          h="322px"
          backgroundColor="brand.primary"
          position="relative"
        >
          <HoverVideoPlayer
            videoSrc={video?.secure_url}
            style={{ width: "100%", height: "100%" }}
            pausedOverlay={
              <VStack
                w="full"
                h="full"
                bgColor="blackAlpha.700"
                alignItems="flex-start"
                justifyContent="flex-end"
                p={6}
              >
                <Text fontSize="xl" fontWeight="bold">
                  {video?.original_filename}
                </Text>
                <Text>{formatBytes(video?.bytes)}</Text>
              </VStack>
            }
            loadingOverlay={
              <Center w="full" h="full" bgColor="whiteAlpha.400">
                <Spinner size="xl" />
              </Center>
            }
          />
          <CloseIcon
            position="absolute"
            top={8}
            right={8}
            zIndex={4}
            onClick={() => setVideo(null)}
          />
        </Box>
      )}
    </Container>
  );
};

export default VideUpload;
