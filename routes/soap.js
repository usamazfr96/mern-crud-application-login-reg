const express = require("express");
const soap = require("soap");
const router = express.Router();

// POST /api/calc/add
// Expects JSON body: { "a": 5, "b": 7 }
router.post("/add", async (req, res) => {
  const { a, b } = req.body;
  if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({ error: "a and b must be numbers" });
  }

  const wsdlUrl = "http://www.dneonline.com/calculator.asmx?wsdl";

  try {
    // Create SOAP client from the WSDL
    const client = await soap.createClientAsync(wsdlUrl);

    // Call the "Add" operation defined in the WSDL
    // The service expects { intA: <number>, intB: <number> }
    const [result] = await client.AddAsync({ intA: a, intB: b });

    // result will look like: { AddResult: 12 }
    res.json({ sum: result.AddResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "SOAP call failed" });
  }
});

module.exports = router;
