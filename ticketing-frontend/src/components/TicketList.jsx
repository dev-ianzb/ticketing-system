import TicketCard from "./TicketCard";

import logo from "../assets/lspu_logo.png";

import "./TicketList.css";

export default function TicketList({
  tickets,
  refresh,
}) {
  return (
    <div className="ticket-list-container">
      {/* HEADER */}
      <div className="ticket-list-header">
        <div className="ticket-list-header-left">
          <img
            src={logo}
            alt="Logo"
            className="ticket-list-logo"
          />

          <div>
            <h2>Ticket Management</h2>

            <p>
              Monitor and manage all support
              tickets
            </p>
          </div>
        </div>
      </div>

      {/* TICKET LIST */}
      <div className="ticket-list-content">
        {tickets.length === 0 ? (
          <div className="empty-ticket-card">
            <h3>No tickets yet</h3>

            <p>
              New support tickets will appear
              here.
            </p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              refresh={refresh}
            />
          ))
        )}
      </div>
    </div>
  );
}