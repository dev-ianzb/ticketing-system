import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import TicketCard from "../components/TicketCard";
import TicketForm from "../components/TicketForm";
import AdminPanel from "../components/AdminPanel";

import logo from "../assets/lspu_logo.png";

import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error(error);
        return;
      }

      const user = data.user;

      setRole(user?.user_metadata?.role || "user");

      setUserId(user?.id);
    };

    loadUser();
  }, []);

  // FETCH TICKETS
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

  useEffect(() => {
    fetchTickets();
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate("/");
  };

  const userTickets = tickets.filter(
    (ticket) => ticket.created_by === userId,
  );

  const assignedTickets = tickets.filter(
    (ticket) => ticket.assigned_to === userId,
  );

  const openPoolTickets = tickets.filter(
    (ticket) => ticket.status === "open" && !ticket.assigned_to,
  );

  return (
    <div className="dashboard-layout">
    {/* SIDEBAR */}
<div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
  {/* TOP SECTION */}
  <div>
    <button
      className="collapse-btn"
      onClick={() => setCollapsed(!collapsed)}
    >
      {collapsed ? "☰" : "←"}
    </button>

    {/* LOGO */}
    <div className="sidebar-logo-container">
      <img
        src={logo}
        alt="Logo"
        className="sidebar-logo"
      />

      {!collapsed && (
        <>
          <h2 className="sidebar-title">
            IT Support
          </h2>

          <p className="sidebar-role">
            Role: <strong>{role || "Loading..."}</strong>
          </p>
        </>
      )}
    </div>
  </div>

  {/* BOTTOM SECTION */}
  <button
    className="logout-btn"
    onClick={handleLogout}
  >
    {collapsed ? "⎋" : "Logout"}
  </button>
</div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
        </div>

        {/* ADMIN PANEL */}
        {role === "admin" && <AdminPanel />}

        {/* CREATE TICKET */}
        <div className="section-card">
          <TicketForm onCreated={fetchTickets} />
        </div>

        {/* NORMAL USER */}
        {role === "user" && (
          <div className="section-card">
            <h3>My Tickets</h3>

            {userTickets.length === 0 ? (
              <p>No tickets found.</p>
            ) : (
              userTickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  refresh={fetchTickets}
                  role={role}
                />
              ))
            )}
          </div>
        )}

        {/* IT STAFF / ADMIN */}
        {(role === "it_staff" || role === "admin") && (
          <>
            <div className="section-card">
              <h3>Assigned To Me</h3>

              {assignedTickets.length === 0 ? (
                <p>No assigned tickets.</p>
              ) : (
                assignedTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    refresh={fetchTickets}
                    role={role}
                  />
                ))
              )}
            </div>

            <div className="section-card">
              <h3>Open Ticket Pool</h3>

              {openPoolTickets.length === 0 ? (
                <p>No open tickets.</p>
              ) : (
                openPoolTickets.map((ticket) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    refresh={fetchTickets}
                    role={role}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}