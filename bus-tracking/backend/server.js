const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let busLocations = {}; // store latest locations

// Driver sends location
app.post("/bus", (req, res) => {
  const { busId, lat, lng, timestamp } = req.body || {};

  if (!busId || !lat || !lng) {
    console.log("Invalid payload:", req.body);
    return res.status(400).json({ status: "error", message: "Missing fields" });
  }

  busLocations[busId] = { lat, lng, timestamp };
  console.log("Bus Update:", busId, lat, lng);
  res.json({ status: "ok" });
});

// Passengers fetch all buses
app.get("/buses", (req, res) => {
  const buses = Object.entries(busLocations).map(([busId, loc]) => ({
    busId,
    ...loc,
  }));
  res.json(buses);
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Use Railway port or fallback
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
