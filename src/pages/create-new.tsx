import { Container } from "@chakra-ui/react";
import type { GetServerSidePropsContext } from "next";
import React from "react";
import { getServerAuthSession } from "../server/auth";
import CreateNew from "../views/create/CreateOrUpdate";

const createNew = () => (
  <Container maxW="7xl" px={10} w="full">
    <CreateNew />
  </Container>
);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );
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
createNew.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  hasHeader: true,
};

export default createNew;
