import React, { useState, useEffect, useTransition } from "react";
import Layout from "../../components/layout";
import { Text, Tabs, Loader } from "@mantine/core";
import axios from "axios";
import { MentorRequestTable } from "../../components/MentorRequestComponents";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

//TODO use useTransition for cleaner updates

export default function Mentors() {
  const { status } = useSession();
  const [requests, setRequests] = useState([]);
  const [requestsPile, setRequestsPile] = useState({});
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All');


  useEffect(() => {
    switch (status) {
      case "unauthenticated":
        router.push("/");
        break;
      case "authenticated":
        axios
          .get("/api/admin/requests")
          .then(({ data }) => setRequests(data))
          .catch(() => router.push("/"));
        axios.get("/api/user/admin")
          .then(({ data }) => setIsAdmin(data));
        break;
    }
  }, [status, router]);

  const onTabChange = (value) => {
    setActiveTab(value);
    setIsLoading(true);
    if (requestsPile[value]) {
      setRequests(requestsPile[value]);
      setIsLoading(false);
    } else {
      axios.put("/api/admin/requests", { type: value })
        .then(({ data }) => {
          requestsPile[value] = data;
          setRequestsPile(requestsPile);
          setRequests(data);
          setIsLoading(false);
        });
    }
  };

  return (
    <Layout>
      <Tabs defaultValue="All" onTabChange={onTabChange}>
        <Tabs.List>
          <Tabs.Tab
            value="All"
            rightSection={
              isLoading && activeTab === "All" && <Loader size='xs' variant='dots' />
            }>
            All
          </Tabs.Tab>
          <Tabs.Tab
            value="Not Accepted"
            rightSection={
              isLoading && activeTab === "Not Accepted" && <Loader size='xs' variant='dots' />
            }>
            Not Accepted
          </Tabs.Tab>
          <Tabs.Tab
            value="In-Progress"
            rightSection={
              isLoading && activeTab === "In-Progress" && <Loader size='xs' variant='dots' />
            }>
            In-Progress
          </Tabs.Tab>
          <Tabs.Tab
            value="Completed"
            rightSection={
              isLoading && activeTab === "Completed" && <Loader size='xs' variant='dots' />
            }>
            Completed
          </Tabs.Tab>
          <Tabs.Tab
            value="Problem"
            rightSection={
              isLoading && activeTab === "Problem" && <Loader size='xs' variant='dots' />
            }>
            Problem
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
      {requests.length == 0 ? (
        <Text> loading requests </Text>
      ) : (
        <MentorRequestTable
          isAdmin={isAdmin}
          requests={requests}
          setRequests={setRequests}
        />
      )}
    </Layout>
  );
}
