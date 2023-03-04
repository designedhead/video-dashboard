import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Icon,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

const PostOptions = ({ id }: { id: string }) => {
  const toast = useToast();
  const router = useRouter();
  const { mutate, isLoading } = api.posts.delete.useMutation({
    onSuccess: async () => {
      toast({
        title: "Deleted successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      await router.push("/");
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleDelete = () => {
    mutate({ id });
  };

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<Icon as={MoreVertIcon} />}
        variant="outline"
        h="full"
        borderRadius="full"
        w={12}
      />
      <MenuList>
        <MenuItem>
          <Link href={`/post/${id}/update`}>Edit</Link>
        </MenuItem>
        <MenuItem onClick={handleDelete} icon={isLoading ? <Spinner /> : null}>
          Delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default PostOptions;
