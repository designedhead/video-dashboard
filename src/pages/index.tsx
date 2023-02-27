import { Container } from "@chakra-ui/react";
import { type GetServerSidePropsContext } from "next";

import React from "react";
import View from "src/views/dashboard/Dashboard.View";

import { getServerAuthSession } from "../server/auth";

const Home = () => (
  <Container maxW="7xl" p={0}>
    <View />
  </Container>
);

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
    props: {},
  };
}
Home.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  hasHeader: true,
};

export default Home;