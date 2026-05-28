import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function TicketForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [category, setCategory] = useState("bug");

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

    onCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Ticket</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <br />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <br />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <br />

      <button type="submit">Create</button>
    </form>
  );
}
