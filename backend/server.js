const express = require("express");
const db = require("./database/database");
const plantRoutes = require("./routes/plants");

const app = express();
const PORT = 3000;

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("Notoo backend is running ✅");
});

// Mount /plants routes
app.use("/plants", plantRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Notoo backend running at http://localhost:${PORT}`);
});
