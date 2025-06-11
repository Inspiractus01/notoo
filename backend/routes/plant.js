const express = require("express");
const db = require("../database/database");

const router = express.Router();

// Get all plants
router.get("/", (req, res) => {
  db.all("SELECT * FROM plants", (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch plants" });
    res.json(rows);
  });
});

// Get plant by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM plants WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: "Failed to fetch plant" });
    if (!row) return res.status(404).json({ error: "Plant not found" });
    res.json(row);
  });
});

// Create a new plant
router.post("/", (req, res) => {
  const { name, description, image } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "Name and description are required" });
  }
  db.run(
    "INSERT INTO plants (name, description, image) VALUES (?, ?, ?)",
    [name, description, image || null],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to add plant" });
      res.status(201).json({ id: this.lastID });
    }
  );
});

// Update a plant
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, description, image } = req.body;
  db.run(
    "UPDATE plants SET name = ?, description = ?, image = ? WHERE id = ?",
    [name, description, image || null, id],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to update plant" });
      if (this.changes === 0)
        return res.status(404).json({ error: "Plant not found" });
      res.json({ message: "Plant updated" });
    }
  );
});

// Delete a plant
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM plants WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: "Failed to delete plant" });
    if (this.changes === 0)
      return res.status(404).json({ error: "Plant not found" });
    res.json({ message: "Plant deleted" });
  });
});

module.exports = router;
