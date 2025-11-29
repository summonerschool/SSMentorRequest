import { MantineProvider, ColorSchemeProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import React, { useState, useEffect } from "react";
import "./styles.css";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
// import { createEmotionCache } from "@mantine/core";
dayjs.extend(localizedFormat);

export default function App({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      setColorScheme(saved);
    }
  }, []);

  const toggleColorScheme = () => {
    const next = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(next);
    localStorage.setItem("theme", next);
  };

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withNormalizeCSS
        withGlobalStyles
        // emotionCache={myCache}
        theme={{ colorScheme }}
      >
        <SessionProvider refetchInterval={5 * 60} session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

