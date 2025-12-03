import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./header.module.css";
import React from "react";
import { getCleanedDiscordUser } from "../util/helper";
import { useMantineColorScheme } from "@mantine/core";
import { Sun, Moon } from "tabler-icons-react";

// The approach used in this component shows how to built a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <header>
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>

      <div className={styles.signedInStatus}>
        {/* Theme Toggle Button */}
        <button
          className={styles.themeToggle}
          onClick={() => toggleColorScheme()}
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <p
          className={`nojs-show ${
            !session && loading ? styles.loading : styles.loaded
          }`}
        >
          {!session && (
            <>
              <span className={styles.notSignedInText}>
                You are not signed in
              </span>
              <a
                href={`/api/auth/signin`}
                className={styles.buttonPrimary}
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Sign in
              </a>
            </>
          )}

          {session && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url(${session.user.image})` }}
                  className={styles.avatar}
                />
              )}

              <span className={styles.signedInText}>
                <small>Signed in as</small>
                <br />
                <strong>{getCleanedDiscordUser(session.user)}</strong>
              </span>

              <a
                href={`/api/auth/signout`}
                className={styles.button}
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </a>
            </>
          )}
        </p>
      </div>
    </header>
  );
}