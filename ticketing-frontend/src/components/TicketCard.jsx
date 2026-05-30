import { useNavigate } from "react-router-dom";

import logo from "../assets/lspu_logo.png";

import "./TicketCard.css";

export default function TicketCard({
  ticket,
  refresh,
  role,
}) {
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
      className="ticket-card"
      onClick={() =>
        navigate(`/tickets/${ticket.id}`)
      }
    >
      {/* HEADER */}
      <div className="ticket-card-header">
        <div className="ticket-card-header-left">
          <img
            src={logo}
            alt="Logo"
            className="ticket-card-logo"
          />

          <div>
            <h3>{ticket.title}</h3>

            <span className="ticket-id">
              Ticket #{ticket.id}
            </span>
          </div>
        </div>

        <div
          className={`status-badge ${ticket.status}`}
        >
          {ticket.status}
        </div>
      </div>

      {/* DESCRIPTION */}
      <p className="ticket-description">
        {ticket.description}
      </p>

      {/* FOOTER */}
      <div className="ticket-card-footer">
        <div className="ticket-info">
          <span>Priority</span>

          <p
            className={`priority ${ticket.priority}`}
          >
            {ticket.priority}
          </p>
        </div>

        <div className="ticket-info">
          <span>Category</span>

          <p>{ticket.category || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}
