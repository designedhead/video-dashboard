import type { NextComponentType, NextPageContext } from "next";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ChakraProvider } from "@chakra-ui/react";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";
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

const progress = new ProgressBar({
  size: 3,
  color: "#F4B8B5",
  className: "loading_bar",
  delay: 100,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

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
