import type { NextComponentType, NextPageContext } from "next";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ChakraProvider } from "@chakra-ui/react";
import { api } from "../utils/api";
import theme from "../theme/theme";
import SiteLayout from "../components/layout/site-layout";

type AppProps = {
  pageProps: {
    session: Session;
  };
  Component: NextComponentType<NextPageContext> & {
    defaultProps: {
      hasHeader: boolean;
    };
  };
};
const MyApp = ({ Component, pageProps }: AppProps) => (
  <SessionProvider session={pageProps.session}>
    <script
      src="https://upload-widget.cloudinary.com/global/all.js"
      async
      defer
    />
    <ReactQueryDevtools initialIsOpen={false} />
    <ChakraProvider theme={theme}>
      <SiteLayout hasHeader={Component?.defaultProps?.hasHeader || false}>
        <Component {...pageProps} />
      </SiteLayout>
    </ChakraProvider>
  </SessionProvider>
);

export default api.withTRPC(MyApp);
