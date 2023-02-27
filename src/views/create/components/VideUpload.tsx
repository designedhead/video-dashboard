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
import useDrivePicker from "react-google-drive-picker";
import { env } from "src/env/client.mjs";
import HoverVideoPlayer from "react-hover-video-player";
import { formatBytes } from "src/helpers/formatBytes";
import { ArrowForwardIcon, CloseIcon } from "@chakra-ui/icons";
import type { VideoObject } from "src/types/VideoTypes";
import { getDriveCookies, setDriveCookies } from "src/helpers/driveCookies";

const VideUpload = ({
  setVideo,
  video,
}: {
  // eslint-disable-next-line no-unused-vars
  setVideo: (e: null | VideoObject) => void;
  video: null | VideoObject;
}) => {
  const [openPicker, token] = useDrivePicker();

  const handleOpenPicker = () => {
    const cookie = getDriveCookies();

    let accessToken = cookie || token || undefined;
    console.log("🚀  cookie:", { cookie, token });

    openPicker({
      clientId: env.NEXT_PUBLIC_GOOGLE_ID,
      developerKey: env.NEXT_PUBLIC_GOOGLE_API_KEY,
      viewId: "DOCS_VIDEOS",
      ...(accessToken && { token: accessToken.access_token }),
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      // customViews: customViewsArray, // custom view
      callbackFunction: ({ action, docs }) => {
        if (action === "loaded") {
          setDriveCookies(token);
          accessToken = token;
        }
        if (action === "picked" && docs.length) {
          const videoRes = docs[0] as unknown as VideoObject;
          setVideo(videoRes);
        }
      },
    });
  };

  return (
    <Container p={0}>
      {!video ? (
        <Button
          onClick={handleOpenPicker}
          rightIcon={<ArrowForwardIcon />}
          variant="outline"
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
            videoSrc={`https://drive.google.com/uc?export=download&id=${video.id}`}
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
                  {video.name}
                </Text>
                <Text>{formatBytes(video.sizeBytes)}</Text>
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
