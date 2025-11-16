const express = require("express");
const axios = require("axios");
const router = express.Router();

// POST /api/echo
// Takes { message: "..." } from client and forwards to external POST endpoint
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "message is required" });

    // Make a POST request to the external API with JSON body
    const response = await axios.post(
      "https://postman-echo.com/post",
      { message },                  // JSON body
      { headers: { "Content-Type": "application/json" } }
    );

    // The external API echoes the JSON you sent
    res.json({
      fromClient: message,
      fromExternalAPI: response.data
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error calling external POST API" });
  }
});

module.exports = router;
