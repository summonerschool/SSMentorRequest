import React, { useState } from "react";
import Layout from "../components/layout";
import Terms from "../components/Terms";
import RequestForm from "../components/RequestForm";
import useAuthTest from "../hooks/useAuthTest";
import { Container } from "@mantine/core";
import Pending from "../components/md/Pending.mdx";
import Completed from "../components/md/Completed.mdx";
import Problem from "../components/md/Problem.mdx";

export default function Page() {
  const { pending, loading, notAuth } = useAuthTest("/api/request");

  const [sent, setSent] = useState(false);
  const [terms, setTerms] = useState(false);

  let page = <Terms setTerms={setTerms} />;
  console.log(pending);

  if (pending || sent) {
    if (
      pending.status == "Not Accepted" ||
      pending.status == "In-Progress" ||
      sent
    )
      page = <Pending />;
    else if (pending.status == "Completed") {
      page = <Completed />;
    } else if (pending.status == "Problem") {
      page = <Problem />;
    }
  } else if (terms) page = <RequestForm setSent={setSent} />;

  return (
    <Layout loading={loading} notAuth={notAuth}>
      <Container>{page}</Container>
    </Layout>
  );
}
