const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

let busLocations = {}; // store latest locations

// Driver sends location
app.post("/bus/location", (req, res) => {
  const { busId, lat, lng, timestamp } = req.body;
  busLocations[busId] = { lat, lng, timestamp };
  console.log("Bus Update:", busId, lat, lng);
  res.send({ status: "ok" });
});

// Passengers fetch all buses
app.get("/buses", (req, res) => {
  res.json(
    Object.entries(busLocations).map(([busId, loc]) => ({
      busId,
      ...loc,
    }))
  );
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

app.listen(4000, "0.0.0.0", () => console.log("Backend running on port 4000"));

