import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

import "./TicketDetails.css";

export default function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentBody, setCommentBody] = useState("");

  const [role, setRole] = useState(null);

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [staff, setStaff] = useState([]);

  useEffect(() => {
    const loadRole = async () => {
      const { data } = await supabase.auth.getUser();

      const userRole = data.user?.user_metadata?.role || "user";

      setRole(userRole);
    };

    loadRole();
  }, []);

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

  const fetchTicket = async () => {
    const session = await supabase.auth.getSession();

    const token = session.data.session.access_token;

    const ticketRes = await fetch(
      `http://localhost:8000/api/tickets/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

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

  const handleAddComment = async () => {
    const session = await supabase.auth.getSession();

    const token = session.data.session.access_token;

    await fetch(`http://localhost:8000/api/tickets/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        body: commentBody,
      }),
    });

    setCommentBody("");

    fetchTicket();
  };

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

  if (!ticket) return <p className="loading">Loading...</p>;

  return (
    <div className="ticket-details-container">
      <button
        className="back-btn"
        onClick={() => navigate("/dashboard")}
      >
        ← Back to Dashboard
      </button>

      {/* TICKET CARD */}
      <div className="ticket-card-details">
        <h1>{ticket.title}</h1>

        <p className="ticket-description">
          {ticket.description}
        </p>

        <div className="ticket-info-grid">
          <div>
            <span>Status</span>
            <p>{ticket.status}</p>
          </div>

          <div>
            <span>Priority</span>
            <p>{ticket.priority}</p>
          </div>

          <div>
            <span>Category</span>
            <p>{ticket.category}</p>
          </div>

          <div>
            <span>Assigned To</span>
            <p>{ticket.assigned_to || "Unassigned"}</p>
          </div>
        </div>
      </div>

      {/* ADMIN CONTROLS */}
      {role === "admin" && (
        <div className="admin-panel">
          <h2>Admin Controls</h2>

          <div className="form-group">
            <label>Status</label>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="open">Open</option>

              <option value="in_progress">In Progress</option>

              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="form-group">
            <label>Priority</label>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>

              <option value="medium">Medium</option>

              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assign To</label>

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

          <button
            className="primary-btn"
            onClick={handleUpdateTicket}
          >
            Save Changes
          </button>
        </div>
      )}

      {/* IT STAFF */}
      {role === "it_staff" && (
        <div className="assign-box">
          <button className="primary-btn" onClick={assignToMe}>
            Assign To Me
          </button>
        </div>
      )}

      {/* COMMENTS */}
      <div className="comments-section">
        <h2>Comments</h2>

        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="comment-card">
              <p>{c.body}</p>

              <small>{c.created_at}</small>
            </div>
          ))
        )}
      </div>

      {/* ADD COMMENT */}
      <div className="add-comment-box">
        <h2>Add Comment</h2>

        <textarea
          value={commentBody}
          onChange={(e) => setCommentBody(e.target.value)}
          placeholder="Write your comment..."
        />

        <button
          className="primary-btn"
          onClick={handleAddComment}
        >
          Add Comment
        </button>
      </div>
    </div>
  );
}