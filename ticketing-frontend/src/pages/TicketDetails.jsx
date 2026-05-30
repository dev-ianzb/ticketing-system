import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");

  const [role, setRole] = useState(null);

  // EDIT STATES
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // IT STAFF LIST
  const [staff, setStaff] = useState([]);

  // -------------------------
  // LOAD ROLE
  // -------------------------
  useEffect(() => {
    const loadRole = async () => {
      const { data } = await supabase.auth.getUser();
      const userRole = data.user?.user_metadata?.role || "user";

      setRole(userRole);
    };

    loadRole();
  }, []);

  // -------------------------
  // LOAD IT STAFF (ADMIN ONLY)
  // -------------------------
  useEffect(() => {
    if (role !== "admin") return;

    const fetchStaff = async () => {
      const session = await supabase.auth.getSession();
      const token = session.data.session.access_token;

      const res = await fetch("http://localhost:8000/api/users/it-staff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setStaff(data);
    };

    fetchStaff();
  }, [role]);
  console.log("STAFF LIST:", staff);
  // -------------------------
  // FETCH TICKET + COMMENTS
  // -------------------------
  const fetchTicket = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session.access_token;

    const ticketRes = await fetch(`http://localhost:8000/api/tickets/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const ticketData = await ticketRes.json();

    setTicket(ticketData);

    setStatus(ticketData.status || "");
    setPriority(ticketData.priority || "");
    setAssignedTo(ticketData.assigned_to || "");

    const commentsRes = await fetch(
      `http://localhost:8000/api/tickets/${id}/comments`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const commentsData = await commentsRes.json();
    setComments(commentsData);
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  // -------------------------
  // ADD COMMENT
  // -------------------------
  const handleAddComment = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session.access_token;

    await fetch(`http://localhost:8000/api/tickets/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ body: commentBody }),
    });

    setCommentBody("");
    fetchTicket();
  };

  // -------------------------
  // UPDATE TICKET
  // -------------------------
  const handleUpdateTicket = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session.access_token;

    await fetch(`http://localhost:8000/api/tickets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
        priority,
        assigned_to: assignedTo,
      }),
    });

    alert("Ticket updated");
    fetchTicket();
  };

  // -------------------------
  // IT STAFF SELF-ASSIGN
  // -------------------------
  const assignToMe = async () => {
    const session = await supabase.auth.getSession();
    const token = session.data.session.access_token;

    const user = await supabase.auth.getUser();
    const myId = user.data.user.id;

    await fetch(`http://localhost:8000/api/tickets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        assigned_to: myId,
        status: "in_progress",
      }),
    });

    fetchTicket();
  };

  if (!ticket) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* BACK */}
      <button onClick={() => navigate("/dashboard")}>← Back</button>

      <hr />

      {/* TICKET INFO */}
      <h2>{ticket.title}</h2>
      <p>{ticket.description}</p>

      <p>Status: {ticket.status}</p>
      <p>Priority: {ticket.priority}</p>
      <p>Category: {ticket.category}</p>
      <p>Assigned To: {ticket.assigned_to || "Unassigned"}</p>

      <hr />

      {/* ADMIN PANEL ONLY */}
      {role === "admin" && (
        <div style={{ border: "1px solid #ccc", padding: 15 }}>
          <h3>Admin Controls</h3>

          {/* STATUS */}
          <div>
            <p>Status</p>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <br />

          {/* PRIORITY */}
          <div>
            <p>Priority</p>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <br />

          {/* ASSIGN DROPDOWN */}
          <div>
            <p>Assign To</p>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">Unassigned</option>

              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </select>
          </div>

          <br />

          <button onClick={handleUpdateTicket}>Save Changes</button>
        </div>
      )}

      {/* IT STAFF SELF ASSIGN */}
      {role === "it_staff" && (
        <div style={{ marginTop: 10 }}>
          <button onClick={assignToMe}>Assign to Me</button>
        </div>
      )}

      <hr />

      {/* COMMENTS */}
      <h3>Comments</h3>

      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <p>{c.body}</p>
          <small>{c.created_at}</small>
        </div>
      ))}

      <hr />

      {/* ADD COMMENT */}
      <h3>Add Comment</h3>

      <textarea
        value={commentBody}
        onChange={(e) => setCommentBody(e.target.value)}
        style={{ width: "100%" }}
      />

      <br />
      <button onClick={handleAddComment}>Add Comment</button>
    </div>
  );
}
