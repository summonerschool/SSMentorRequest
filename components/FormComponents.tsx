import { ActionIcon, TextInput } from "@mantine/core";
import axios from "axios";
import { useState } from "react";

const RiotIdCheckerField = ({
  isApply,
  values,
  errors,
  setValues,
  setErrors,
  getInputProps,
}) => (
  <TextInput
    label="Riot ID"
    placeholder={
      values.region
        ? "Your full Riot ID with the # code"
        : "Enter your region first"
    }
    description={
      values.summonerName &&
      !values.rank &&
      "Check if your account is valid with button on the right"
    }
    rightSection={
      <RiotIdChecker
        values={values}
        error={errors.summonerName}
        setValues={setValues}
        setErrors={setErrors}
        isApply={isApply}
      />
    }
    disabled={!values.region}
    {...getInputProps("summonerName")}
  />
);

const RiotIdChecker = ({
  values: { summonerName, region, rank },
  setValues,
  setErrors,
  error,
  isApply,
}) => {
  const [loading, setLoading] = useState(false);

  const checkAccount = () => {
    setLoading(true);
    setErrors({ summonerName: false });
    axios
      .put("/api/request", { riotId: summonerName, region })
      .then(({ data }) => {
        const rank = data.tier;
        const games = data.wins + data.losses;
        setLoading(false);
        if ((isApply && games) || games >= 25) setValues({ rank });
        else {
          setValues({ rank: null });
          setErrors({
            summonerName: isApply
              ? "We are unable to verify your rank. Please make sure you have the correct account or you are ranked"
              : "You do not meet the required number of games. Please apply after meeting the requirements",
          });
        }
      })
      .catch(() => {
        setValues({ rank: null });
        setErrors({
          summonerName:
            "An error has occurred. Please check if you entered the correct ID",
        });
        setLoading(false);
      });
  };
  return (
    <ActionIcon
      loading={loading}
      onClick={checkAccount}
      variant={"filled"}
      color={rank ? "green" : error ? "red" : "blue"}
    >
      {loading ? null : error ? "!" : "O"}
    </ActionIcon>
  );
};

export { RiotIdCheckerField };
