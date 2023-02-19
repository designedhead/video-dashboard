import { type GetServerSidePropsContext } from "next";
import { Container } from "@chakra-ui/react";

import React from "react";

import { getServerAuthSession } from "../server/auth";

interface Props {
  session: {
    user: { name: string; email: string; image: string; id: string };
  };
}

const Home = ({ session }: Props) => {
  console.log("🚀  session", session);
  return (
    <Container maxW="4xl" mx="auto" p={0} w="full">
      Something goes here
    </Container>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);

  if (!session)
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };

  return {
    props: { session },
  };
}
Home.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  hasHeader: true,
};

export default Home;
