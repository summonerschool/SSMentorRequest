import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import React from "react";
import "./styles.css";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
// import { createEmotionCache } from "@mantine/core";
dayjs.extend(localizedFormat);

export default function App({ Component, pageProps }) {
  return (
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      // emotionCache={myCache}
      theme={{ colorScheme: "dark" }}
    >
      <SessionProvider refetchInterval={5 * 60} session={pageProps.session}>
        <Component {...pageProps} />
      </SessionProvider>
    </MantineProvider>
  );
}
