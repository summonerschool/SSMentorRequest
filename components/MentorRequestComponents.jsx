// MentorRequestComponents.jsx
import React, { useEffect, useState, useTransition } from "react";
import {
  Badge,
  Table,
  Text,
  Button,
  Container,
  Select,
  SimpleGrid,
  Space,
  Box,
  Loader,
  Tabs,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import axios from "axios";
import dayjs from "dayjs";
import { statuses, rtHeader } from "../util/datalist";
import Link from "next/link";
import Icon from "./Icon";
import { ClickToCopy } from "./Styles";
import { Comments } from "./DetailsComponents";

// --- STATUS BADGE ---
export function getStatusBadge(status, date) {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === "dark";

  const colorMap = {
    "Not Accepted": isDark ? "gray" : "gray",
    "In-Progress": isDark ? "blue.5" : "blue",
    Completed: isDark ? "green.5" : "green",
    Problem: isDark ? "red.5" : "red",
  };

  return (
    <Tooltip label={date ? `Date: ${dayjs(date).format("DD/MMM/YYYY")}` : ""}>
      <Badge color={colorMap[status]} variant="filled">
        {status}
      </Badge>
    </Tooltip>
  );
}

// --- REQUEST ROW ---
export const RequestRow = ({ row, isAdmin }) => {
  const [rowOpen, setRowOpen] = useState(false);

  return (
    <>
      <tr>
        <td onClick={() => setRowOpen((o) => !o)}>
          <Box sx={{ cursor: "pointer" }}>
            <Icon type={rowOpen ? "chevron-up" : "chevron-down"} width={16} />
          </Box>
        </td>

        {/* Created 날짜 - 볼드체 */}
        <td style={{ fontWeight: "bold" }}>
          {dayjs(row.createdAt).format("DD/MMM/YYYY")}
        </td>

        {/* Discord Username - 볼드체 */}
        <td style={{ fontWeight: "bold" }}>
          <Badge color="teal" variant="outline" mr={4}>
            Discord
          </Badge>
          <ClickToCopy>{row.discordName}</ClickToCopy>
        </td>

        {/* OP.GG SummonerName - 볼드체 */}
        <td style={{ fontWeight: "bold" }}>
          <Badge color="blue" variant="outline" mr={4}>
            Summoner
          </Badge>
          <a
            href={`https://op.gg/summoners/${row.region}/${row.summonerName.replace(
              "#",
              "-"
            )}`}
            target="_blank"
            rel="noreferrer"
          >
            {row.summonerName}
          </a>
        </td>

        {/* 나머지 컬럼은 그대로 */}
        <td>{row.rank}</td>
        <td>{row.region}</td>
        <td>{row.role}</td>
        <td>
          {Array.isArray(row.champions)
            ? row.champions.join(", ")
            : row.champions}
        </td>
        <td>{row.timezone}</td>

        {/* Status Badge */}
        <td>{getStatusBadge(row.status, row.completed || row.accepted)}</td>
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


// --- DETAILS ---
const Details = ({ id, isAdmin }) => {
  const [item, setItem] = useState(null);
  const theme = useMantineTheme();

  useEffect(() => {
    axios.get(`/api/request/${id}`).then(({ data }) => {
      setItem(data);
    });
  }, [id]);

  const handleArchive = () => {
    if (confirm("Are you sure you want to archive this request?")) {
      axios.put(`/api/request/${id}`, { type: "archive" });
    }
  };
  const handleDelete = () => {
    if (confirm("Are you ABSOLUTELY sure you want to delete this request?")) {
      axios
        .delete(`/api/request/${id}`)
        .then(({ data }) => alert(data))
        .catch(() =>
          alert("Something didn't work. Notify Z if the request is not deleted")
        );
    }
  };

  if (!item) return <Loader />;

  return (
    <Container fluid>
      {item.accepted && (
        <Text>
          <Badge color="yellow" variant="filled">
            Accepted
          </Badge>{" "}
          {dayjs(item.accepted).format("DD/MMM/YYYY")}
        </Text>
      )}
      {item.completed && (
        <Text>
          <Badge color="green" variant="filled">
            Completed
          </Badge>{" "}
          {dayjs(item.completed).format("DD/MMM/YYYY")}
        </Text>
      )}
      {item.problem && (
        <Text>
          <Badge color="red" variant="filled">
            Problem
          </Badge>{" "}
          {dayjs(item.problem).format("DD/MMM/YYYY")}
        </Text>
      )}

      <Space h="sm" />

      <Text>
        <Badge color="teal" variant="outline" mr={4}>
          Discord ID
        </Badge>
        <ClickToCopy>{item.discordId}</ClickToCopy>
      </Text>

      <Space h="sm" />

      <Text>
        <Badge color="gray" variant="outline" mr={4}>
          Student Notes
        </Badge>
        <SimpleGrid cols={1}>{item.info || "N/A"}</SimpleGrid>
      </Text>

      {item.interactedMentors && (
        <Text>
          <Badge color="orange" variant="outline" mr={4}>
            Interacted Mentors
          </Badge>
          {item.interactedMentors.map((inst, i) => (
            <ClickToCopy
              key={`interactedMentor${i}${item._id}`}
              data={inst.mentor.discordId}
            >
              {" "}
              {inst.mentor.discordName},{" "}
            </ClickToCopy>
          ))}
        </Text>
      )}

      <Space h="sm" />

      <Text>
        <Badge color="pink" variant="outline" mr={4}>
          Mentor Comments
        </Badge>
        <Comments comments={item.comments} />
      </Text>

      <Remarks item={item} />

      <Space h="lg" />

      <Text>
        <Badge color="gray" variant="outline" mr={4}>
          Other Actions
        </Badge>
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
          </Button>
        </>
      )}
    </Container>
  );
};

// --- REMARKS ---
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
      <SimpleGrid cols={1}>
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

// --- TABLE SELECT ---
const TableSelect = ({ request }) => {
  const handleStatusChange = (value) => {
    axios
      .put(`/api/request/${request._id}`, { value, type: "status" })
      .then(({ data }) => {
        alert(data);
      })
      .catch(() => {
        alert("Error, notify admin");
      });
  };
  return (
    <Select
      data={statuses}
      icon={getStatusBadge(request.status, request.completed || request.accepted)}
      defaultValue={request.status}
      onChange={handleStatusChange}
    />
  );
};

// --- MENTOR REQUEST TABLE ---
export const MentorRequestTable = ({ requests, isAdmin, setRequests, isLoading }) => {
  const theme = useMantineTheme();
  const isDark = theme.colorScheme === "dark";

  return (
  <Table
  highlightOnHover
  sx={(theme) => ({
    fontFamily: "'Inter', sans-serif !important", // 전체 테이블 기본 폰트
    fontSize: 14,
    tableLayout: 'auto',
    color: theme.colorScheme === "dark" ? "#e0e0e0" : "#192833",
    backgroundColor: theme.colorScheme === "dark" ? "#1a1b1e" : "#fff",
    td: {
      padding: "12px 16px",
      fontWeight: 'normal', // 기본 td는 일반 글씨
    },
    th: {
      fontFamily: "'PP Agrandir', sans-serif !important", // 헤더 폰트 변경
      fontSize: 14,
      fontWeight: 600,
      backgroundColor: theme.colorScheme === "dark" ? "#2a2b2e" : "#f5f5f5",
      borderBottom: `1px solid ${theme.colorScheme === "dark" ? "#444" : "#ddd"}`,
    },
    tr: {
      backgroundColor: theme.colorScheme === "dark" ? "#1a1b1e" : "#fff",
    },
  })}
>



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
        <Text>loading requests...</Text>
      ) : (
        <tbody>
          {requests.map((row, i) => (
            <RequestRow row={row} key={`row${row._id}${i}`} isAdmin={isAdmin} />
          ))}
        </tbody>
      )}
    </Table>
  );
};

// --- TABLE HEADER ---
const TableHeader = ({ header, setRequests, requests }) => {
  const { title, sorter } = header;
  const [asc, setAsc] = useState(false);

  if (!sorter) return <th>{title}</th>;

  const handleClick = () => {
    setRequests([...requests.sort((a, b) => sorter(asc ? b : a, asc ? a : b))]);
    setAsc(!asc);
  };

  return (
    <th>
      <Box sx={{ cursor: "pointer", display: "flex", alignItems: "center" }} onClick={handleClick}>
        <span>{title}</span>
        <Icon type="selector" width={12} />
      </Box>
    </th>
  );
};

// --- MAIN COMPONENT ---
export const MentorRequestComponent = ({ allRequests, isAdmin }) => {
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
          const newPile = { ...requestsPile, [value]: data };
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
          {["All", "Not Accepted", "In-Progress", "Completed", "Problem"].map((tab) => (
            <Tabs.Tab
              value={tab}
              key={tab}
              rightSection={isLoading && activeTab === tab && <Loader size="xs" variant="dots" />}
            >
              {tab}
            </Tabs.Tab>
          ))}
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
