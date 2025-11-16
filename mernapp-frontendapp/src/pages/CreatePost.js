import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

export default function CreatePost() {
  const [form, setForm] = useState({ title: "", body: "" });
  const [message, setMessage] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/posts", form);
      setMessage("Post created successfully!");
      setForm({ title: "", body: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Body"
          value={form.body}
          onChange={e => setForm({ ...form, body: e.target.value })}
          rows="5"
          required
        />
        <button type="submit">Save Post</button>
      </form>

      {message && <p style={{ marginTop: "1rem" }}>{message}</p>}

      <p style={{ marginTop: "2rem" }}>
        Want to see all posts?{" "}
        <Link to="/posts">View Posts</Link>
      </p>
    </div>
  );
}
