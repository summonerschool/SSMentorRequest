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
    <>
      {/* Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=PP+Agrandir:wght@400;600;700&family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
      />
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          withNormalizeCSS
          withGlobalStyles
          theme={{ colorScheme }}
        >
          <SessionProvider refetchInterval={5 * 60} session={pageProps.session}>
            <Component {...pageProps} />
          </SessionProvider>
        </MantineProvider>
      </ColorSchemeProvider>
    </>
  );
}