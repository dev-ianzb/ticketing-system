import { supabase } from "../lib/supabase";

export default function TicketCard({ ticket, refresh }) {
  const handleDelete = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session.access_token;

    await fetch(`http://localhost:8000/api/tickets/${ticket.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    refresh();
  };

  return (
    <div style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
      <h3>{ticket.title}</h3>
      <p>{ticket.description}</p>

      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>

      <button onClick={handleDelete}>Remove</button>
    </div>
  );
}
