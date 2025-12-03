import React, { useEffect, useState, useTransition } from "react";
import {
  // getStatusColor,
  getStatusIcon,
  ClickToCopy,
  StyledClickableContainer,
  StyledLabel,
} from "./Styles";
import dayjs from "dayjs";
import {
  Table,
  Button,
  Container,
  Select,
  Text,
  Textarea,
  SimpleGrid,
  Space,
  Box,
  Loader,
  Tabs,
} from "@mantine/core";
import axios from "axios";
import { statuses, rtHeader } from "../util/datalist";
import Link from "next/link";
import Icon from "./Icon";
import { Comments } from "./DetailsComponents";
import { OPGGlink } from "./SummonerComponents";

export const MentorRequestTable = ({
  requests,
  isAdmin,
  setRequests,
  isLoading,
}) => {
  return (
    <Table highlightOnHover striped>
      <thead>
        <tr>
          {rtHeader.map((header, i) => (
            <TableHeader
              header={header}
              requests={requests}
              setRequests={setRequests}
              key={`tableHeader${i}`}
            />
          ))}
        </tr>
      </thead>
      {isLoading ? (
        <Text> loading requests </Text>
      ) : (
        <tbody>
          {requests.map((row, i) => (
            <RequestRow
              row={row}
              key={`TableRow${row._id}${i}`}
              isAdmin={isAdmin}
            />
          ))}
        </tbody>
      )}
    </Table>
  );
};

export const RequestRow = ({ row, isAdmin }) => {
  const [rowOpen, setRowOpen] = useState(false);

  return (
    <>
      <tr>
        <td onClick={() => setRowOpen((o) => !o)}>
          <StyledClickableContainer>
            <Icon type={rowOpen ? "chevron-up" : "chevron-down"} width={16} />
          </StyledClickableContainer>
        </td>
        <td>
          <Text
            color={
              row.accepted &&
              row.status != "Completed" &&
              row.status != "Problem" &&
              dayjs(row.accepted).add(2, "months").isBefore(dayjs()) &&
              "red"
            }
          >
            {dayjs(row.createdAt).format("DD/MMM/YYYY")}
          </Text>
        </td>
        <td>
          <ClickToCopy>{row.discordName}</ClickToCopy>
        </td>
        <td>
          <OPGGlink item={row} />
        </td>
        <td>{row.rank}</td>
        <td>{row.region}</td>
        <td>{row.role}</td>
        <td>
          {typeof row.champions == "string"
            ? row.champions
            : row.champions?.join(", ")}
        </td>
        <td>{row.timezone}</td>
        <td>
          <TableSelect request={row} />
        </td>
      </tr>
      {rowOpen && (
        <tr>
          <td colSpan={12}>
            <Box p="xs">
              <Details id={row._id} isAdmin={isAdmin} />
            </Box>
          </td>
        </tr>
      )}
    </>
  );
};

const Details = ({ id, isAdmin }) => {
  const [item, setItem] = useState(null);
  useEffect(() => {
    axios.get(`/api/request/${id}`).then(({ data }) => {
      setItem(data);
    });
  }, [id]);

  const handleArchive = () => {
    if (confirm("Are you sure you want to archive this request?")) {
      axios.put(`/api/request/${id}`, { type: "archive" });
    } else console.log("not");
  };
  const handleDelete = () => {
    if (confirm("Are you ABSOLUTELY sure you want to delete this request?")) {
      axios
        .delete(`/api/request/${id}`)
        .then(({ data }) => alert(data))
        .catch(() =>
          alert("Something didn't work. Notify Z if the request is not deleted")
        );
    } else console.log("not");
  };
  return item ? (
    <Container fluid>
      {item.accepted && (
        <>
          <Text>
            <StyledLabel>Mentor:</StyledLabel> {item.mentor?.discordName} -{" "}
            <ClickToCopy>{item.mentor?.discordId}</ClickToCopy>
          </Text>
          <Text>
            <StyledLabel>Accepted:</StyledLabel>{" "}
            {dayjs(item.accepted).format("DD / MMM / YYYY")}
          </Text>
        </>
      )}
      {item.completed && (
        <Text>
          <StyledLabel>Completed:</StyledLabel>{" "}
          {dayjs(item.completed).format("DD / MMM / YYYY")}
        </Text>
      )}
      <StyledLabel>Discord ID:</StyledLabel>{" "}
      <ClickToCopy>{item.discordId}</ClickToCopy>
      <Space h="sm" />
      <Text>
        <StyledLabel>Student notes:</StyledLabel>
        <SimpleGrid cols={2}>{item.info || "N/A"}</SimpleGrid>
      </Text>
      {item.interactedMentors && (
        <Text>
          <StyledLabel>Interacted Mentors:</StyledLabel>
          {item.interactedMentors.map((instance, id) => (
            <ClickToCopy
              data={instance.mentor.discordId}
              key={`interatedMentor${id}${item._id}`}
            >
              {" "}
              {instance.mentor.discordName},
            </ClickToCopy>
          ))}
        </Text>
      )}
      <Space h="sm" />
      <Text>
        <StyledLabel>Mentor comments:</StyledLabel>
        <Comments comments={item.comments} />
      </Text>
      <Remarks item={item} />
      <Space h="lg" />
      <Text>
        <StyledLabel>Other Actions:</StyledLabel>
      </Text>
      <Space h="xs" />
      <Link href={`/admin/student/${item.discordId}`}>
        <Button size="xs" variant="outline" color="teal">
          All requests by this student
        </Button>
      </Link>
      {isAdmin && (
        <>
          <Button size="xs" ml="xs" variant="outline" onClick={handleArchive}>
            Archive Request
          </Button>
          <Button
            size="xs"
            ml="xs"
            variant="outline"
            color="red"
            onClick={handleDelete}
          >
            Delete Request
          </Button>{" "}
        </>
      )}
    </Container>
  ) : (
    <Loader />
  );
};

const TableSelect = ({ request }) => {
  const handleStatusChange = (value) => {
    axios
      .put(`/api/request/${request._id}`, { value, type: "status" })
      .then(({ data }) => {
        alert(data);
      })
      .catch(() => {
        alert("error, some shit gone wrong. nag Z about this");
      });
  };
  return (
    <Select
      data={statuses}
      icon={getStatusIcon(request.status)}
      defaultValue={request.status}
      onChange={handleStatusChange}
    />
  );
};

const TableHeader = ({ header, setRequests, requests }) => {
  const { title, sorter } = header;

  const [asc, setAsc] = useState(false);
  // const ascSort = useMemo(
  //   () => sortRequests({ requests, sorter, reverse: true }),
  //   [sorter, requests]
  // );
  // const descSort = useMemo(
  //   () => sortRequests({ requests, sorter, reverse: false }),
  //   [sorter, requests]
  // );

  if (!sorter) {
    return <th>{title}</th>;
  }

  const handleClick = () => {
    setRequests(sortRequests({ requests, sorter, reverse: asc }));
    setAsc(!asc);
  };

  return (
    <th>
      <StyledClickableContainer
        onClick={() => handleClick()}
        disabled={!setRequests}
      >
        <span>{header.title}</span>
        <Icon type="selector" width={12} />
      </StyledClickableContainer>
    </th>
  );
};

const Remarks = ({ item }) => {
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    await axios
      .patch(`/api/request/${item._id}`, { content })
      .then(() => setIsEditing(false))
      .catch(() => {
        setError("An error occurred");
      });
    setIsLoading(false);
  };

  return isEditing ? (
    <>
      <SimpleGrid cols={2}>
        <Textarea
          autosize
          minRows={3}
          error={error}
          onChange={(e) => setContent(e.currentTarget.value)}
          mb="0.5rem"
        />
      </SimpleGrid>
      <Button
        variant="outline"
        size="xs"
        onClick={handleSubmit}
        disabled={loading}
      >
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
    <>
      <Button
        variant="outline"
        size="xs"
        color="gray"
        mt="1rem"
        onClick={() => setIsEditing(true)}
      >
        Add Comment
      </Button>
    </>
  );
};

const sortRequests = ({ requests, reverse, sorter }) => {
  if (!sorter) return;
  return [...requests.sort((a, b) => sorter(reverse ? b : a, reverse ? a : b))];
};

export const MentorRequestComponent = ({ allRequests, isAdmin }) => {
  //TODO use useTransition for cleaner updates
  const [isPending, startTransition] = useTransition();
  const [requests, setRequests] = useState(allRequests);
  const [requestsPile, setRequestsPile] = useState({ All: allRequests });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const onTabChange = (value) => {
    startTransition(() => {
      setActiveTab(value);
      setIsLoading(true);
      if (requestsPile[value]) {
        setRequests(requestsPile[value]);
        setIsLoading(false);
      } else {
        axios.put("/api/admin/requests", { type: value }).then(({ data }) => {
          const newPile = requestsPile;
          newPile[value] = data;
          setRequestsPile(newPile);
          setRequests(data);
          setIsLoading(false);
        });
      }
    });
  };

  return (
    <>
      <Tabs defaultValue="All" onTabChange={onTabChange}>
        <Tabs.List>
          <Tabs.Tab
            value="All"
            rightSection={
              isLoading &&
              activeTab === "All" && <Loader size="xs" variant="dots" />
            }
          >
            All
          </Tabs.Tab>
          <Tabs.Tab
            value="Not Accepted"
            rightSection={
              isLoading &&
              activeTab === "Not Accepted" && (
                <Loader size="xs" variant="dots" />
              )
            }
          >
            Not Accepted
          </Tabs.Tab>
          <Tabs.Tab
            value="In-Progress"
            rightSection={
              isLoading &&
              activeTab === "In-Progress" && <Loader size="xs" variant="dots" />
            }
          >
            In-Progress
          </Tabs.Tab>
          <Tabs.Tab
            value="Completed"
            rightSection={
              isLoading &&
              activeTab === "Completed" && <Loader size="xs" variant="dots" />
            }
          >
            Completed
          </Tabs.Tab>
          <Tabs.Tab
            value="Problem"
            rightSection={
              isLoading &&
              activeTab === "Problem" && <Loader size="xs" variant="dots" />
            }
          >
            Problem
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      {isPending ? (
        <Loader />
      ) : (
        <MentorRequestTable
          isAdmin={isAdmin}
          requests={requests}
          setRequests={setRequests}
          isLoading={isLoading}
        />
      )}
    </>
  );
};
