import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function TicketDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);

  const [comments, setComments] = useState([]);

  const [body, setBody] = useState("");

  const fetchData = async () => {
    const session = await supabase.auth.getSession();

    const token = session.data.session.access_token;

    // FETCH TICKET
    const ticketRes = await fetch(`http://localhost:8000/api/tickets/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const ticketData = await ticketRes.json();

    setTicket(ticketData);

    // FETCH COMMENTS
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
    fetchData();
  }, []);

  const handleComment = async () => {
    if (!body.trim()) return;

    const session = await supabase.auth.getSession();

    const token = session.data.session.access_token;

    await fetch(`http://localhost:8000/api/tickets/${id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        body,
      }),
    });

    setBody("");

    fetchData();
  };

  if (!ticket) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      {/* BACK BUTTON */}
      <button onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <hr />

      {/* TICKET DETAILS */}
      <h1>{ticket.title}</h1>

      <p>
        <strong>Description:</strong>
      </p>

      <p>{ticket.description}</p>

      <p>
        <strong>Status:</strong> {ticket.status}
      </p>

      <p>
        <strong>Priority:</strong> {ticket.priority}
      </p>

      <p>
        <strong>Category:</strong> {ticket.category}
      </p>

      <hr />

      {/* COMMENTS */}
      <h2>Comments</h2>

      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>{comment.author_name || "Unknown User"}</strong>
            </p>

            <p>{comment.body}</p>

            <small>{new Date(comment.created_at).toLocaleString()}</small>
          </div>
        ))
      )}

      {/* ADD COMMENT */}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a comment..."
        style={{
          width: "100%",
          height: "100px",
          marginTop: "1rem",
        }}
      />

      <br />

      <button onClick={handleComment}>Add Comment</button>
    </div>
  );
}
