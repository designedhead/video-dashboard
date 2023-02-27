import { ArrowForwardIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Input,
  InputGroup,
  InputRightAddon,
} from "@chakra-ui/react";
import { env } from "src/env/client.mjs";
import React from "react";
import useDrivePicker from "react-google-drive-picker";
import { getDriveCookies, setDriveCookies } from "src/helpers/driveCookies";

interface Props {
  file: null | string;
  // eslint-disable-next-line no-unused-vars
  setFile: (e: null | string) => void;
}

const FileSelect = ({ file, setFile }: Props) => {
  const [openPicker, token] = useDrivePicker();
  // const [file, setFile] = React.useState<null | string>(null);

  // const customViewsArray = [new google.picker.DocsView()]; // custom view
  const handleOpenPicker = () => {
    const cookie = getDriveCookies();
    let accessToken = token || cookie || undefined;
    openPicker({
      clientId: env.NEXT_PUBLIC_GOOGLE_ID,
      developerKey: env.NEXT_PUBLIC_GOOGLE_API_KEY,
      viewId: "DOCS",
      ...(accessToken && { token: accessToken.access_token }),
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: false,
      customScopes: ["https://www.googleapis.com/auth/drive"],
      callbackFunction: ({ action, docs }) => {
        if (action === "loaded") {
          setDriveCookies(token);
          accessToken = token;
        }
        if (action === "picked" && docs.length) {
          const fileRes = docs[0] as { url: string };
          setFile(fileRes?.url);
        }
      },
    });
  };

  if (!file) {
    return (
      <Button
        onClick={handleOpenPicker}
        rightIcon={<ArrowForwardIcon />}
        variant="outline"
      >
        Pick file
      </Button>
    );
  }
  return (
    <InputGroup>
      <Input type="url" isDisabled value={file} />
      <InputRightAddon onClick={() => setFile(null)}>
        <Center w="full" h="full">
          <SmallCloseIcon />
        </Center>
      </InputRightAddon>
    </InputGroup>
  );
};

export default FileSelect;
