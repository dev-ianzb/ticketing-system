import { useState } from "react";
import { supabase } from "../lib/supabase";

import "./TicketForm.css";

export default function TicketForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const session = await supabase.auth.getSession();

    const token = session.data.session.access_token;

    await fetch("http://localhost:8000/api/tickets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title,
        description,
        priority,
        category,
      }),
    });

    setTitle("");
    setDescription("");
    setPriority("low");
    setCategory("");

    onCreated();
  };

  return (
    <div className="ticket-form-container">
      <form onSubmit={handleSubmit} className="ticket-form">
        <h3>Create Ticket</h3>

        <input
          type="text"
          placeholder="Ticket Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="ticket-form-row">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low Priority</option>

            <option value="medium">Medium Priority</option>

            <option value="high">High Priority</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>

            <option value="bug">Bug</option>

            <option value="hardware">Hardware</option>

            <option value="software">Software</option>

            <option value="network">Network</option>

            <option value="account">Account Access</option>

            <option value="email">Email Issue</option>

            <option value="other">Other</option>
          </select>
        </div>

        <button type="submit" disabled={!category}>
          Create Ticket
        </button>
      </form>
    </div>
  );
}