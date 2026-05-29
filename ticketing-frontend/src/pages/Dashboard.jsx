import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import TicketCard from "../components/TicketCard";
import TicketForm from "../components/TicketForm";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");

  // FETCH TICKETS
  const fetchTickets = async () => {
    const session = await supabase.auth.getSession();

    const token = session.data.session.access_token;

    const params = new URLSearchParams();

    if (status) params.append("status", status);

    if (priority) params.append("priority", priority);

    if (category) params.append("category", category);

    const res = await fetch(
      `http://localhost:8000/api/tickets?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await res.json();

    setTickets(data);
  };

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate("/");
  };

  // AUTO REFRESH WHEN FILTERS CHANGE
  useEffect(() => {
    fetchTickets();
  }, [status, priority, category]);

  return (
    <div style={{ padding: "20px" }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Dashboard</h2>

        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* FILTERS */}
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        {/* STATUS */}
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>

          <option value="open">Open</option>

          <option value="resolved">Resolved</option>

          <option value="removed">Removed</option>
        </select>

        {/* PRIORITY */}
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="">All Priority</option>

          <option value="low">Low</option>

          <option value="medium">Medium</option>

          <option value="high">High</option>
        </select>

        {/* CATEGORY */}
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Category</option>

          <option value="bug">Bug</option>

          <option value="hardware">Hardware</option>

          <option value="software">Software</option>

          <option value="network">Network</option>

          <option value="account">Account Access</option>

          <option value="email">Email Issue</option>

          <option value="other">Other</option>
        </select>

        {/* RESET */}
        <button
          onClick={() => {
            setStatus("");
            setPriority("");
            setCategory("");
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* CREATE TICKET */}
      <TicketForm onCreated={fetchTickets} />

      <hr />

      {/* TICKET LIST */}
      <div>
        {tickets.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              refresh={fetchTickets}
            />
          ))
        )}
      </div>
    </div>
  );
}
