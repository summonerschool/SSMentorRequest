import Link from "next/link";
import React, { useState } from "react";
import dayjs from "dayjs";
import { Container, Select, Switch, Table, Text } from "@mantine/core";
import { fullRanks, userSelectCommand } from "../util/datalist";
import axios from "axios";
import { ClickToCopy, StyledClickableContainer } from "./Styles";
import Icon from "./Icon";

export const AdminComponent = ({ users }) => {
  return (
    <Table striped highlightOnHover>
      <thead>
        <tr>
          <th />
          <th>Mentor Name</th>
          <th>Mentor ID</th>
          <th>Last completed</th>
          <th>Last taken</th>
          <th>Completed lately</th>
          <th>Taken lately</th>
        </tr>
      </thead>
      <tbody>
        {users.map((mentor, i) => (
          <TableRow mentor={mentor} key={`Row${i}`} />
        ))}
      </tbody>
    </Table>
  );
};

const TableRow = ({ mentor }) => {
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
          <Link href={`/admin/mentors/${mentor.discordId}`}>
            {mentor.discordName}
          </Link>
        </td>
        <td>
          <ClickToCopy>{mentor.discordId}</ClickToCopy>
        </td>
        <td>
          {mentor.lastCompleted && (
            <Text
              color={
                dayjs(mentor.lastCompleted)
                  .add(5, "months")
                  .isBefore(dayjs()) && "red"
              }
            >
              {dayjs(mentor.lastCompleted).format("DD / MMM / YYYY")}
            </Text>
          )}
        </td>
        <td>
          {mentor.lastTaken && (
            <Text
              color={
                dayjs(mentor.lastTaken).add(2, "months").isBefore(dayjs()) &&
                "red"
              }
            >
              {dayjs(mentor.lastTaken).format("DD / MMM / YYYY")}
            </Text>
          )}
        </td>
        <td>{mentor.lastCompleted && mentor.completedPeriod}</td>
        <td>{mentor.lastTaken && mentor.takenPeriod}</td>
      </tr>
      {rowOpen && (
        <tr>
          <td colSpan={12}>
            <Container fluid>
              <Text>
                Toggle Trial
                <UserTypeUpdate
                  user={mentor}
                  type={"trial"}
                  defChecked={mentor.isTrial}
                />
                Toggle Mentor
                <UserTypeUpdate
                  user={mentor}
                  type={"mentor"}
                  defChecked={mentor.isMentor}
                />
                Toggle Admin
                <UserTypeUpdate
                  user={mentor}
                  type={"admin"}
                  defChecked={mentor.isAdmin}
                />
                Toggle Reviewer
                <UserTypeUpdate
                  user={mentor}
                  type={"reviewer"}
                  defChecked={mentor.isReviewer}
                />
                <UserRankSelect user={mentor} />
                {/* <Button disabled={true} onClick={() => DeleteUser(mentor)}>
                  Delete
                </Button> */}
              </Text>
            </Container>
          </td>
        </tr>
      )}
    </>
  );
};

// Just not use it for now, it's only really useful for Z

// const DeleteUser = async (user) => {
//   if (confirm("Are you ABSOLUTELY sure you want to delete this user?")) {
//     axios.post("api/admin", { user: user._id }).then(({ data }) => alert(data));
//   } else console.log("not");
// };

const UserRankSelect = ({ user }) => {
  const handleOnChange = async (value) => {
    axios.put("api/admin", {
      userId: user._id,
      command: userSelectCommand("PEAKRANK"),
      rank: value,
    });
  };
  return (
    <Select
      defaultValue={user.peakRank}
      data={fullRanks()}
      onChange={handleOnChange}
    />
  );
};

const UserTypeUpdate = ({ user, type, defChecked }) => {
  const handleSwitchUpdate = async ({ currentTarget: { checked } }) => {
    axios
      .put("api/admin", {
        userId: user._id,
        command: userSelectCommand(type),
        bool: checked,
      })
      .then(({ data }) => console.log(data));
  };
  return (
    <Switch
      aria-label={type}
      defaultChecked={defChecked}
      onChange={handleSwitchUpdate}
    />
  );
};
