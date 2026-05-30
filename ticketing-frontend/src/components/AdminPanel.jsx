import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import logo from "../assets/lspu_logo.png";

import "./AdminPanel.css";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const fetchUsers = async () => {
    const { data } = await supabase.auth.getSession();

    const token = data.session.access_token;

    const res = await fetch("http://localhost:8000/api/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(await res.json());
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id, role) => {
    const { data } = await supabase.auth.getSession();

    const token = data.session.access_token;

    await fetch(`http://localhost:8000/api/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });

    fetchUsers();
  };

  const createItStaff = async () => {
    const { data } = await supabase.auth.getSession();

    const token = data.session.access_token;

    await fetch("http://localhost:8000/api/users/it-staff", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    setEmail("");
    setPassword("");

    fetchUsers();
  };

  return (
    <div className="admin-panel-container">
      {/* HEADER */}
      <div className="admin-header">
        <div className="admin-header-left">
          <img
            src={logo}
            alt="Logo"
            className="admin-logo"
          />

          <div>
            <h2>Admin User Management</h2>

            <p>Manage users and IT staff accounts</p>
          </div>
        </div>
      </div>

      {/* CREATE STAFF */}
      <div className="admin-card">
        <h3>Create IT Staff</h3>

        <div className="admin-form">
          <input
            type="email"
            placeholder="Staff Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={createItStaff}>
            Create Staff Account
          </button>
        </div>
      </div>

      {/* USER LIST */}
      <div className="admin-card">
        <h3>System Users</h3>

        <div className="users-list">
          {users.map((user) => (
            <div key={user.id} className="user-card">
              <div>
                <p className="user-email">
                  {user.email}
                </p>

                <span className="user-role">
                  {user.role}
                </span>
              </div>

              <select
                value={user.role}
                onChange={(e) =>
                  updateRole(user.id, e.target.value)
                }
              >
                <option value="user">user</option>

                <option value="it_staff">
                  it_staff
                </option>

                <option value="admin">admin</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}