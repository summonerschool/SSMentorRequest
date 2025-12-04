import React, { useState } from "react";
import Layout from "../components/layout";
import MentorForm from "../components/MentorForm";
import Link from "next/link";
import useAuthTest from "../hooks/useAuthTest";
import { Container } from "@mantine/core";
import { trialDenyText } from "../util/datalist";

export default function Apply() {
  const { appStatus, loading, notAuth } = useAuthTest("/api/user/application");
  const [sent, setSent] = useState(false);

  let page = <MentorForm setSent={setSent} />;

  // if (process.env.NEXT_PUBLIC_ENV == "dev");
  switch (appStatus) {
    case "pending":
      page = "We have received your application! We will reach you back soon";
      break;
    case "trial":
      page =
        "You are currently on trial period! Please head over to the server!";
      break;
    case "processed":
      page = (
        <>
          Thank you for your interest in being a mentor in Summoner School.
          After reviewing your application we unfortunately have decided to
          decline at this time. If you plan on reapplying, we recommend being
          active in the VOD review channel or any of the other educational
          channels to practice mentoring.
        </>
      );
      break;
    case "accepted":
      page = (
        <>
          Mentor already registered! You can head over to{" "}
          <Link href="/mentors/requests">this link</Link> to now see the
          requests
        </>
      );
      break;
  }
  if (sent)
    page =
      "Thank you for you application! We will reach back to you in a couple of weeks";

  return (
    <Layout loading={loading} notAuth={notAuth}>
      <Container>{page}</Container>
    </Layout>
  );
}
