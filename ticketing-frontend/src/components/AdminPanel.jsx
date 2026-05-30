import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

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
      body: JSON.stringify({ email, password }),
    });

    setEmail("");
    setPassword("");
    fetchUsers();
  };

  return (
    <div
      style={{ marginTop: "20px", padding: "10px", border: "1px solid red" }}
    >
      <h3>Admin User Management</h3>

      <div>
        <h4>Create IT Staff</h4>

        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={createItStaff}>Create</button>
      </div>

      <hr />

      <h4>Users</h4>

      {users.map((user) => (
        <div key={user.id} style={{ marginBottom: "10px" }}>
          <p>
            {user.email} — <b>{user.role}</b>
          </p>

          <select
            value={user.role}
            onChange={(e) => updateRole(user.id, e.target.value)}
          >
            <option value="user">user</option>
            <option value="it_staff">it_staff</option>
            <option value="admin">admin</option>
          </select>
        </div>
      ))}
    </div>
  );
}
