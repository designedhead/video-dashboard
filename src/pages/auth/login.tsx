import {
  Flex,
  Box,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import GoogleIcon from "@mui/icons-material/Google";
import type { GetServerSidePropsContext } from "next";
import { signIn } from "next-auth/react";
import { getServerAuthSession } from "../../server/auth";

const Login = () => (
  <Flex
    minH="100vh"
    align="center"
    justify="center"
    bg={useColorModeValue("gray.50", "gray.800")}
  >
    <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
      <Stack align="center">
        <Heading fontSize="4xl">Sign in to your account</Heading>
        <Text fontSize="lg" color="gray.600">
          to enjoy all of our cool
          <Link color="brand.primary"> Motion Templates</Link> ✌️
        </Text>
      </Stack>
      <Box
        rounded="lg"
        bg={useColorModeValue("white", "gray.700")}
        boxShadow="lg"
        p={8}
      >
        <Stack spacing={4}>
          <Stack spacing={10}>
            <Button
              w="full"
              size="lg"
              leftIcon={<GoogleIcon />}
              onClick={() =>
                // eslint-disable-next-line no-void
                void signIn("google", {
                  callbackUrl: "/",
                })
              }
            >
              <Text>Sign in with Google</Text>
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  </Flex>
);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {},
  };
}

export default Login;
