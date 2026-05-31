import { useEffect, useMemo, useState } from "react";
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

  // FILTERED DATA
  const userTickets = tickets.filter(
    (ticket) => ticket.created_by === userId,
  );

  const assignedTickets = tickets.filter(
    (ticket) => ticket.assigned_to === userId,
  );

  const openPoolTickets = tickets.filter(
    (ticket) => ticket.status === "open" && !ticket.assigned_to,
  );

  // ANALYTICS
  const analytics = useMemo(() => {
    const totalTickets = tickets.length;

    const openTickets = tickets.filter(
      (ticket) => ticket.status === "open",
    ).length;

    const inProgressTickets = tickets.filter(
      (ticket) => ticket.status === "in_progress",
    ).length;

    const resolvedTickets = tickets.filter(
      (ticket) => ticket.status === "resolved",
    ).length;

    const highPriority = tickets.filter(
      (ticket) => ticket.priority === "high",
    ).length;

    const mediumPriority = tickets.filter(
      (ticket) => ticket.priority === "medium",
    ).length;

    const lowPriority = tickets.filter(
      (ticket) => ticket.priority === "low",
    ).length;

    return {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      highPriority,
      mediumPriority,
      lowPriority,
    };
  }, [tickets]);

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

        {/* ANALYTICS - ONLY ADMIN & IT STAFF */}
        {(role === "it_staff" || role === "admin") && (
          <>
            {/* ANALYTICS SECTION */}
            <div className="analytics-grid">
              <div className="analytics-card total-card">
                <h4>Total Tickets</h4>
                <h2>{analytics.totalTickets}</h2>
              </div>

              <div className="analytics-card open-card">
                <h4>Open</h4>
                <h2>{analytics.openTickets}</h2>
              </div>

              <div className="analytics-card progress-card">
                <h4>In Progress</h4>
                <h2>{analytics.inProgressTickets}</h2>
              </div>

              <div className="analytics-card resolved-card">
                <h4>Resolved</h4>
                <h2>{analytics.resolvedTickets}</h2>
              </div>
            </div>

            {/* PRIORITY ANALYTICS */}
            <div className="section-card">
              <h3>Priority Analytics</h3>

              <div className="priority-wrapper">
                <div className="priority-item">
                  <span>High Priority</span>

                  <div className="progress-bar">
                    <div
                      className="progress-fill high"
                      style={{
                        width: `${
                          analytics.totalTickets
                            ? (analytics.highPriority /
                                analytics.totalTickets) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <strong>{analytics.highPriority}</strong>
                </div>

                <div className="priority-item">
                  <span>Medium Priority</span>

                  <div className="progress-bar">
                    <div
                      className="progress-fill medium"
                      style={{
                        width: `${
                          analytics.totalTickets
                            ? (analytics.mediumPriority /
                                analytics.totalTickets) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <strong>{analytics.mediumPriority}</strong>
                </div>

                <div className="priority-item">
                  <span>Low Priority</span>

                  <div className="progress-bar">
                    <div
                      className="progress-fill low"
                      style={{
                        width: `${
                          analytics.totalTickets
                            ? (analytics.lowPriority /
                                analytics.totalTickets) *
                              100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>

                  <strong>{analytics.lowPriority}</strong>
                </div>
              </div>
            </div>
          </>
        )}

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