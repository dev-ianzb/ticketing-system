import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import TicketList from "../components/TicketList";
import TicketForm from "../components/TicketForm";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session.access_token;

    const res = await fetch("http://localhost:8000/api/tickets", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setTickets(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>My Tickets</h1>

        <button onClick={handleLogout}>Logout</button>
      </div>

      <TicketForm onCreated={fetchTickets} />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <TicketList tickets={tickets} refresh={fetchTickets} />
      )}
    </div>
  );
}
