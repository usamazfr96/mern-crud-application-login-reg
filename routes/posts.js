const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const auth = require("../middleware/auth");

// CREATE a new post
router.post("/", auth, async (req, res) => {
  try {
    const { title, body } = req.body;
    const post = new Post({
      title,
      body,
      user: req.user.id  // req.user was set in auth middleware
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// READ all posts of the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    // Find posts for the logged-in user
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    // Find the user to get their username
    const user = await User.findById(req.user.id).select("username");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      username: user.username,
      posts: posts
    });
    //res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// UPDATE a post
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, body } = req.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { title, body },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE a post
router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
