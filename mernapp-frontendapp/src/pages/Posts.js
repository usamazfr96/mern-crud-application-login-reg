import { useEffect, useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Posts() {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    api
      .get("/posts")
      .then(res => {
        setUsername(res.data.username);
        setPosts(res.data.posts);
      })
      .catch(err =>
        alert(err.response?.data?.message || "Failed to load posts")
      );
  };

  // === DELETE ===
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await api.delete(`/posts/${id}`);        // <-- matches your DELETE route
      setPosts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  // === EDIT === (simple prompt version)
  const handleEdit = async (post) => {
    const newTitle = prompt("New title:", post.title);
    const newBody  = prompt("New body:", post.body);
    if (!newTitle || !newBody) return;

    try {
      const res = await api.put(`/posts/${post._id}`, {  // <-- matches your PUT route
        title: newTitle,
        body: newBody
      });
      // Update the list with the returned, updated post
      setPosts(prev =>
        prev.map(p => (p._id === post._id ? res.data : p))
      );
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="posts-wrapper">
      <h1>Latest Posts</h1>
      {username && (
        <h1><p style={{ textAlign: "center", marginBottom: "1rem" }}>
          Welcome, <strong>{username}</strong>!
        </p></h1>
      )}

      <div className="posts-grid">
        {posts.map(post => (
          <article key={post._id} className="post-card">
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p className="meta">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <div className="actions">
              <button className="btn btn-edit" onClick={() => handleEdit(post)}>
                Edit
              </button>
              <button className="btn btn-delete" onClick={() => handleDelete(post._id)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      <p style={{ marginTop: "2rem", textAlign: "center" }}>
        Want to create a new post?{" "}
        <Link to="/create-post">Click here</Link>
      </p>
    </div>
  );
}
