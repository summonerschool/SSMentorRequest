import React, { useState } from "react";
import { mentorFormQuestions, regions } from "../util/datalist";
import axios from "axios";
import { Button, Select, Stack, Textarea, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { RiotIdChecker } from "./RequestForm";
import { RiotIdCheckerField } from "./FormComponents";

const MentorApplicationForm = ({ setSent }) => {
  const { isValid, values, getInputProps, setValues, setErrors, errors } =
    useForm({
      initialValues: {
        rank: "",
        summonerName: "",
        region: "",
        appReason: "",
      },
      validate: {
        rank: isNotEmpty("Please select your Rank "),
        summonerName: isNotEmpty("Please enter your Summoner Name"),
        region: isNotEmpty("Please select your region"),
        appReason: isNotEmpty("*Required"),
        loseMatchupEx: isNotEmpty("*Required"),
        rebuttalEx: isNotEmpty("*Required"),
        winConEx: isNotEmpty("*Required"),
      },
      validateInputOnBlur: true,
    });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isValid()) {
      await axios
        .post("/api/user/application", values)
        .then(() => {
          setSent(true);
        })
        .catch((error) => {
          setSent(true);
          console.log(error);
        });
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack>
        <Select label="Region" data={regions} {...getInputProps("region")} />
        <RiotIdCheckerField
          isApply={true}
          values={values}
          errors={errors}
          setValues={setValues}
          setErrors={setErrors}
          getInputProps={getInputProps}
        />
        {mentorFormQuestions.map((question, i) => (
          <Textarea
            key={`MentorFormQuestion${i}`}
            label={question.title}
            {...getInputProps(question.field)}
          />
        ))}

        <Button type="submit" disabled={loading || !isValid()}>
          Send application
        </Button>
      </Stack>
    </form>
  );
};

export default MentorApplicationForm;
