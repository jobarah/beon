import React, { FC, useState, useEffect, useCallback } from "react";

import { RouteComponentProps } from "@reach/router";
import { IUserProps } from "../dtos/user.dto";
import { UserCard } from "../components/users/user-card";
import { CircularProgress } from "@mui/material";

import { BackendClient } from "../clients/backend.client";

const backendClient = new BackendClient();

const PAGE_SIZE = 10;

export const DashboardPage: FC<RouteComponentProps> = () => {
  const [users, setUsers] = useState<IUserProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPageNumber,setCurrentPageNumber] = useState(1);

  const getPage = useCallback((pageNumber: number) => {
    const start = (pageNumber - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return users.slice(start, end);
  }, [users]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await backendClient.getAllUsers();
      setUsers(result.data);
      setLoading(false);
      setCurrentPageNumber(1);
    };

    try {

      fetchData();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }

  }, []);



  return (
    <div style={{ paddingTop: "30px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress size="60px" />
          </div>
        ) : (
          <div>
            {users.length
              ? getPage(currentPageNumber).map((user) => {
                  return <UserCard key={user.id} {...user} />;
                })
              : null}
          </div>
        )}
        <button onClick={() => setCurrentPageNumber(currentPageNumber - 1)} disabled={currentPageNumber === 1}>Previous</button>
        <button onClick={() => setCurrentPageNumber(currentPageNumber + 1)} disabled={currentPageNumber === Math.ceil(users.length / PAGE_SIZE)}>Next</button>
        <div>{currentPageNumber}/{users.length/PAGE_SIZE}</div>
      </div>
    </div>
  );
};
