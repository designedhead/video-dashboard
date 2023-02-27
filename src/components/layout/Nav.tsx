import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  HStack,
  Text,
} from "@chakra-ui/react";
import { AddIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

const PLACEHOLDER = "https://avatars.dicebear.com/api/male/username.svg";

type LinkType = {
  label: string;
  href: string;
};

const links: LinkType[] = [
  // { label: "Dashboard", href: "/" }
];

const Nav = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.900")}
      px={4}
      zIndex={20}
      borderTop="6px solid"
      borderTopColor="brand.primary"
    >
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        maxW="7xl"
        mx="auto"
      >
        <Link href="/" passHref>
          <Box cursor="pointer" fontWeight="medium">
            Motion IO
          </Box>
        </Link>

        <HStack spacing={4}>
          {links?.map((link) => {
            const isSelected = router.pathname === link.href;
            return (
              <Link href={link.href} key={link.label} passHref>
                <Button
                  w="full"
                  variant="ghost"
                  size="sm"
                  color={isSelected ? "brand.primary" : "gray.600"}
                  fontWeight="medium"
                >
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </HStack>

        <Flex alignItems="center">
          <Stack direction="row" spacing={7}>
            <Link href="/create-new" passHref>
              <Button rightIcon={<AddIcon />}>Add new</Button>
            </Link>
            <Button onClick={toggleColorMode} variant="outline">
              {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            </Button>

            <Menu>
              <MenuButton
                as={Button}
                rounded="full"
                variant="link"
                cursor="pointer"
                minW={0}
              >
                <Avatar size="sm" src={session?.user?.image || PLACEHOLDER} />
              </MenuButton>
              <MenuList alignItems="center" zIndex={20}>
                <br />
                <Center>
                  <Avatar
                    size="2xl"
                    src={session?.user?.image || PLACEHOLDER}
                  />
                </Center>
                <br />
                <Center>
                  <p>{session?.user?.name}</p>
                </Center>
                <Center>
                  <Text fontSize="small" color="blackAlpha.500">
                    {session?.user?.email}
                  </Text>
                </Center>
                <br />
                <MenuDivider />
                {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Nav;
