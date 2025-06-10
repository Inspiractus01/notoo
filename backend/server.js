const express = require("express");
const db = require("./database/database"); // napojenie na tvoju SQLite DB
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

app.get("/", (req, res) => {
  res.send("Notoo backend is running ✅");
});

app.listen(PORT, () => {
  console.log(`✅ Notoo backend running at http://localhost:${PORT}`);
});
