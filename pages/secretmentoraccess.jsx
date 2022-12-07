import axios from "axios";
import { useSession } from "next-auth/client";
import { useState, useEffect } from "react";
import Layout from "../components/layout";
import Link from "next/link";
import { useRouter } from "next/dist/client/router";

export default function Mentors() {
  const [content, setContent] = useState("");
  const [session, loading] = useSession();
  const router = useRouter();

  const handleOnClick = async () => {
    const data = (await axios.post("/api/user/mentor", session)).data;
    switch (data) {
      case 0:
        setContent(
          "request has been sent. Be sure to let the Admins know on the server"
        );
        break;
      case 1:
        setContent(
          <>
            Mentor already registered! You can head over to{" "}
            <Link href="https://ssmentor-request.vercel.app/mentors">
              this link
            </Link>{" "}
            to now see the requests
          </>
        );
        break;
      case 2:
        setContent(
          "request has already been sent. We'll get to it when we get to it"
        );
    }
  };

  useEffect(async () => {
    if (!loading)
      if (!session) {
        router.push("/api/auth/signin");
      }
  }, [loading]);

  return (
    <Layout>
      <button onClick={handleOnClick}>Click here to apply for mentor</button>
      <br />
      {content}
    </Layout>
  );
}
