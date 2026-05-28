import TicketCard from "./TicketCard";

export default function TicketList({ tickets, refresh }) {
  return (
    <div>
      {tickets.length === 0 ? (
        <p>No tickets yet</p>
      ) : (
        tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} refresh={refresh} />
        ))
      )}
    </div>
  );
}
