import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import TicketCard from "../components/TicketCard";
import TicketForm from "../components/TicketForm";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const { data } = await supabase.auth.getSession();

    const token = data?.session?.access_token;

    if (!token) return;

    const res = await fetch("http://localhost:8000/api/tickets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();
    const dataJson = text ? JSON.parse(text) : [];

    setTickets(dataJson);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* CREATE TICKET */}
      <TicketForm onCreated={fetchTickets} />

      <hr />

      {/* TICKETS */}
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
