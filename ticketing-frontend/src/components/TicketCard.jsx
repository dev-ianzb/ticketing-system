import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function TicketCard({ ticket, refresh, role }) {
  const navigate = useNavigate();

  // const handleDelete = async (e) => {
  //   e.stopPropagation();

  //   const session = await supabase.auth.getSession();
  //   const token = session.data.session.access_token;

  //   await fetch(`http://localhost:8000/api/tickets/${ticket.id}`, {
  //     method: "DELETE",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   refresh();
  // };

  return (
    <div
      onClick={() => navigate(`/tickets/${ticket.id}`)}
      style={{
        border: "1px solid #ccc",
        margin: "10px",
        padding: "10px",
        cursor: "pointer",
      }}
    >
      <h3>{ticket.title}</h3>

      <p>{ticket.description}</p>

      <p>Status: {ticket.status}</p>

      <p>Priority: {ticket.priority}</p>
    </div>
  );
}
