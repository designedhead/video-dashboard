import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Icon,
  Spinner,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import React from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Link from "next/link";
import { api } from "@/utils/api";
import { useRouter } from "next/router";

const PostOptions = ({ id }: { id: string }) => {
  const toast = useToast();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
    <>
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
          <MenuItem onClick={onOpen} icon={isLoading ? <Spinner /> : null}>
            Delete
          </MenuItem>
        </MenuList>
      </Menu>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={8}>
            Users will no longer be able to see it on the dashboard.
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={onClose}
              px={10}
              mr={3}
              _active={{ transform: "scale(0.98)" }}
            >
              Cancel
            </Button>
            <Button
              backgroundColor="brand.primary"
              _hover={{ backgroundColor: "brand.secondary" }}
              _active={{ transform: "scale(0.98)" }}
              transition="all 0.2s"
              px={10}
              onClick={handleDelete}
              isLoading={isLoading}
              isDisabled={isLoading}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostOptions;
