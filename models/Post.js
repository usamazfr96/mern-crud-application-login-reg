const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body:  { type: String, required: true },
    // Reference to the user who created it
    user:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true } // adds createdAt & updatedAt
);

module.exports = mongoose.model("Post", postSchema);
