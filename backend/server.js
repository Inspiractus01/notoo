const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Test endpoint
app.get("/", (req, res) => {
  res.send("Notoo backend is running ✅");
});

// Spustenie servera
app.listen(PORT, () => {
  console.log(` Notoo backend running at http://localhost:${PORT}`);
});
