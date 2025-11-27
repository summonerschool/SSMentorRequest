import { Text, Button, Space, Checkbox } from "@mantine/core";
import React, { useState } from "react";
import TermsText from "./TermsText.mdx";

export default function Terms({ setTerms }) {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <>
      {process.env.NEXT_PUBLIC_REQUEST_STATUS == "closed" && <Closed />}
      <TermsText />
      {process.env.NEXT_PUBLIC_REQUEST_STATUS != "closed" && (
        <>
          <Checkbox
            label="I have read and understand all of the
          above."
            checked={isChecked}
            onChange={() => setIsChecked(!isChecked)}
          />
          <Space h="lg" />
          <Button disabled={!isChecked} onClick={() => setTerms(true)}>
            Continue
          </Button>
        </>
      )}
    </>
  );
}

export function Pending() {
  return (
    <Text>
      <p>
        Request has been sent! Our mentors will reach out to you soon, so please
        make sure to have your DMs open for our mentors to reach you!
      </p>

      <p>
        If you have recently finished a review and would like to send another,
        please note that there is a limit of 1 request per month. Please note
        that if we were not able to reach you for your previous request, you
        will be able to send your next request after 3 months.
      </p>
    </Text>
  );
}

export function Completed() {
  return <Text></Text>;
}

export function Problem() {}

export function Closed() {
  return (
    <Text>
      <h1>
        We have closed our mentor request in preparation for the new season! We
        will be coming back about one month after the start of the new season,
        around late January ~ early February, so make sure to meet the
        requirements if you wish to make a mentor request when we re-open!
      </h1>
    </Text>
  );
}
