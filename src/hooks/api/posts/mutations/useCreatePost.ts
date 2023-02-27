import { api } from "@/utils/api";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";

const useCreatePost = () => {
  const router = useRouter();
  const toast = useToast();
  const { mutate, data, isLoading } = api.posts.create.useMutation({
    onSuccess: async () => {
      toast({
        title: "Created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      await router.push("/");
    },
    onError: (error) => {
      toast({
        title: "Error creating post",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return { mutate, data, createLoading: isLoading };
};

export default useCreatePost;
