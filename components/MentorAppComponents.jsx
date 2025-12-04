import React from "react";
import { useMemo, useState } from "react";
import {
  Button,
  Container,
  Grid,
  SimpleGrid,
  Chip,
  Table,
  Text,
  Title,
  Tabs,
  Modal,
  Textarea,
  Flex,
  Box,
  Tooltip,
  Space,
} from "@mantine/core";
import axios from "axios";
import { ClickToCopy, StyledClickableContainer, StyledLabel } from "./Styles";
import dayjs from "dayjs";
import Icon from "./Icon";
import Link from "next/link";
import { Comments } from "./DetailsComponents";
import { OPGGlink } from "./SummonerComponents";

export const AppList = ({ allApps, reviewerId }) => {
  const [applications, setApplications] = useState(
    filterApps(allApps, "pending")
  );
  const onTabChange = (value) => {
    setApplications(filterApps(allApps, value));
  };

  return (
    <div>
      <Title>Mentor Applications</Title>
      <Tabs onTabChange={onTabChange} defaultValue={"pending"}>
        <Tabs.List>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="trial">Trials</Tabs.Tab>
          <Tabs.Tab value="processed">Processed</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <Table striped>
        <thead>
          <tr>
            <th>Discord name</th>
          </tr>
        </thead>
        <tbody>
          {applications?.map((app, i) => (
            <AppRow
              app={app}
              key={`TableRow${i * 2}${app.discordId}`}
              reviewerId={reviewerId}
            />
          ))}
        </tbody>
      </Table>
      {applications?.length == 0 && (
        <Box p="xs">There are no applications to review at this time.</Box>
      )}
    </div>
  );
};

const filterApps = (apps, type) => {
  return apps.filter((app) => app.appStatus == type);
};

const AppRow = ({ app, reviewerId }) => {
  const [open, setOpen] = useState(
    app.appStatus == "processed" ? false : !hasVoted(app, reviewerId)
  );

  return (
    <>
      <tr>
        <td onClick={() => setOpen((o) => !o)}>
          <StyledClickableContainer>
            <Icon type={open ? "chevron-up" : "chevron-down"} width={16} />
            <Text ml="sm" td={app.appStatus == "processed" && "line-through"}>
              {app.discordName}
            </Text>
          </StyledClickableContainer>
        </td>
      </tr>
      {open && (
        <tr>
          <td colSpan={6}>
            <AppDetails item={app} reviewerId={reviewerId} />
          </td>
        </tr>
      )}
    </>
  );
};

const hasVoted = (app, reviewerId) => {
  return (
    app.yay.includes(reviewerId) ||
    app.nay.includes(reviewerId) ||
    app.meh.includes(reviewerId)
  );
};

const AppDetails = ({ item, reviewerId }) => {
  const { yay, nay, meh } = item;
  const value = useMemo(() => {
    if (yay.includes(reviewerId)) return "yay";
    if (nay.includes(reviewerId)) return "nay";
    if (meh.includes(reviewerId)) return "meh";
  }, [yay, nay, meh, reviewerId]);
  const [vote, setVote] = useState(value);
  const [voteLoading, setVoteLoading] = useState(false);

  const handleVote = (e) => {
    setVoteLoading(true);
    axios
      .put("/api/admin/application", { id: item.discordId, vote: e })
      .then(() => {
        setVote(e);
        setVoteLoading(false);
      })
      .catch((error) => {
        console.log(error);
        alert("An error has occurred, please notify Z");
        setVoteLoading(false);
      });
  };
  console.log(item.dateTrialStarted);

  // const handleDelete = (e) => {
  //   axios.delete("/api/admin/application", { data: item._id }).then().catch();
  // };

  return (
    <Container fluid>
      <Grid>
        <Grid.Col span={6}>
          <Text>
            <StyledLabel>Summoner:</StyledLabel> <OPGGlink item={item} />
          </Text>
          <Text>
            <StyledLabel>Rank:</StyledLabel> {item.rank}
          </Text>
          <Text>
            <StyledLabel>Roles: </StyledLabel> {item.primaryRole} /{" "}
            {item.secondaryRole}
          </Text>
          <Text>
            <StyledLabel>Discord ID:</StyledLabel>{" "}
            <ClickToCopy>{item.discordId}</ClickToCopy>
          </Text>
          <Text>
            <StyledLabel>Applied at:</StyledLabel>{" "}
            {dayjs(item.createdAt).format("DD/MMM/YYYY")}
          </Text>

          {item.appStatus == "trial" && (
            <>
              <Text>
                <StyledLabel>Trial started at: </StyledLabel>
                {item.dateTrialStarted
                  ? dayjs(item.dateTrialStarted).format("DD/MMM/YYYY")
                  : ""}
              </Text>
              <StyledLabel>
                <Link href={`/admin/mentors/${item.discordId}`}>
                  Requests taken: {item.requestCount}
                </Link>
              </StyledLabel>
            </>
          )}
        </Grid.Col>
        <Grid.Col span={4}>
          <Chip.Group label={"Vote"} value={vote} onChange={handleVote}>
            <Flex justify="flex-end" align="center">
              <Chip value={"yay"} label={"Yay"} disabled={voteLoading}>
                Yay: {yay.length - (value == "yay") + (vote == "yay")}
              </Chip>
              <Chip ml="xs" value={"nay"} label={"Nay"} disabled={voteLoading}>
                Nay : {nay.length - (value == "nay") + (vote == "nay")}
              </Chip>
              <Chip ml="xs" value={"meh"} label={"Meh"} disabled={voteLoading}>
                Meh: {meh.length - (value == "meh") + (vote == "meh")}
              </Chip>
              <ReviewedList item={item} />
            </Flex>
          </Chip.Group>
        </Grid.Col>
        <Grid.Col span={2}>
          <Flex justify="flex-end">
            <ConfirmationModal item={item} />
            {/* <Button onClick={handleDelete}>Delete request</Button> */}
          </Flex>
        </Grid.Col>
        <Grid.Col span={12}>
          <StyledLabel>Reason for applying</StyledLabel>
          <Text>{item.appReason}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <StyledLabel>Experience</StyledLabel>
          <Text>{item.experience}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <StyledLabel>Champ win con</StyledLabel>
          <Text>{item.winConEx}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <StyledLabel>Losing matchup</StyledLabel>
          <Text>{item.loseMatchupEx}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <StyledLabel>Bad take in chat</StyledLabel>
          <Text>{item.rebuttalEx}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <StyledLabel>Reviewer comments</StyledLabel>
          <Comments comments={item.comments} />
          <AddCommentSection item={item} />
          <Space h="md" />
        </Grid.Col>
      </Grid>
    </Container>
  );
};

const ConfirmationModal = ({ item }) => {
  const { discordId, discordName, region, appStatus } = item;
  const [open, setOpen] = useState(false);
  const [denyOpen, setDenyOpen] = useState(false);
  const [denyReason, setDenyReason] = useState("");
  const messages =
    appStatus == "pending"
      ? { details: "trial", status: "ending", button: "Start Trial" }
      : { details: "mentor", status: "starting", button: "Finish Trial" };

  const handleConfirmClicked = (actionRequested) => {
    // NOTE: This route is used for both starting a trial and accepting a mentor. See processApp() for more details.
    axios
      .post("/api/admin/application", {
        discordId,
        denyReason,
        command: actionRequested,
      })
      .then(({ data }) => alert(data))
      .catch(() => alert("An error has occurred. Notify Z"));
    setOpen(false);
  };

  const ModalDetails = () => {
    return (
      <>
        <Button
          color="teal"
          ml="xs"
          onClick={() => handleConfirmClicked("ACCEPT")}
        >
          <Text tt="capitalize">Accept as {messages.details}</Text>
        </Button>
        <Button color="red" ml="xs" onClick={() => setDenyOpen(true)}>
          <Text tt="capitalize">Deny as {messages.details}</Text>
        </Button>
      </>
    );
  };

  return (
    <>
      <Modal
        centered
        title={`Confirm Mentor Status`}
        size="xl"
        opened={open}
        onClose={() => setOpen(false)}
        overlayProps={{
          opacity: 0.55,
          blur: 3,
        }}
      >
        <Box>
          You are now {messages.status} the trial mentor period for{" "}
          <Text span fw={700}>
            {discordName}
          </Text>
          .
          <Space mb="lg" mt="lg" />
        </Box>
        <Flex justify="flex-end">
          <Box>
            <ModalDetails />
            <Button color="gray" ml="xs" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Flex>
        {denyOpen && (
          <Flex justify="flex-end">
            <Box>
              <Textarea
                placeholder="Denial reason"
                onChange={({ currentTarget: { value } }) =>
                  setDenyReason(value)
                }
              />
              <Button
                color="red"
                ml="xs"
                onClick={() => handleConfirmClicked("DENY")}
              >
                Deny
              </Button>
            </Box>
          </Flex>
        )}
      </Modal>
      <Flex justify="flex-end">
        <Button
          ml="xs"
          onClick={() => setOpen(true)}
          disabled={
            process.env.NEXT_PUBLIC_ENV == "dev"
              ? false
              : appStatus == "processed"
          }
        >
          {messages.button}
        </Button>
      </Flex>
    </>
  );
};

const AddCommentSection = ({ item }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const addComment = () => {
    axios
      .patch("/api/admin/application", { user: item.discordId, content })
      .then(() => setIsEditing(false))
      .catch(() => setError("Error occurred"));
  };

  return isEditing ? (
    <>
      <SimpleGrid cols={2}>
        <Textarea
          autosize
          minRows={3}
          onChange={(e) => setContent(e.currentTarget.value)}
          error={error}
          mb="0.5rem"
          mt="1rem"
        />
      </SimpleGrid>
      <Button variant="outline" size="xs" onClick={addComment}>
        Submit
      </Button>
      <Button
        variant="outline"
        size="xs"
        color="gray"
        ml="0.3rem"
        onClick={() => setIsEditing(false)}
      >
        Cancel
      </Button>
    </>
  ) : (
    <Button
      variant="outline"
      size="xs"
      color="gray"
      mt="1rem"
      onClick={() => setIsEditing(true)}
    >
      Add Comment
    </Button>
  );
};

const ReviewedList = ({ item }) => (
  <Tooltip
    withArrow
    arrowSize={8}
    color="dark"
    label={
      <Box>
        <StyledLabel>Reviewed by:</StyledLabel>
        {item.voted.map((reviewer, i) => (
          <Text key={`AppVotedCount${i}`}>{reviewer.discordName}</Text>
        ))}
      </Box>
    }
  >
    <Flex ml="xs" size="xs" variant="default">
      <Icon type="eyeglass" strokeWidth={1} />
    </Flex>
  </Tooltip>
);
