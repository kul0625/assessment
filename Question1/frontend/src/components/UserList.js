import React, { useEffect, useState } from "react";
import API from "../server/apiService";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    const res = await API.get("/auth/getAllUsers");
    setUsers(res.data);
  };

  const startChat = (userId) => {
    navigate(`/chat/${userId}`);
  };
  const logout = () => {
    localStorage.clear();
    navigate(`/`);
  };

  return (
    <div className="user-list">
      <h2>Users</h2>
      <div style={{ cursor: "pointer" }} onClick={logout}>
        Logout
      </div>
      <ul>
        {users?.length > 0 &&
          users.map((u) => (
            <li key={u._id}>
              {u.name} ({u.email})
              <button onClick={() => startChat(u._id)}>Chat</button>
            </li>
          ))}
      </ul>
    </div>
  );
}
