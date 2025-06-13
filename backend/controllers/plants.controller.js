import { connectDb } from "../db/db.js";

export async function getAllPlants(req, res) {
  try {
    const db = await connectDb();
    const plants = await db.all("SELECT * FROM plants");
    res.json(plants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch plants" });
  }
}

export async function getPlantById(req, res) {
  try {
    const db = await connectDb();
    const { id } = req.params;
    const plant = await db.get("SELECT * FROM plants WHERE id = ?", id);
    if (!plant) {
      return res.status(404).json({ error: "Plant not found" });
    }
    res.json(plant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch plant" });
  }
}

export async function createPlant(req, res) {
  try {
    const db = await connectDb();
    const { name, description, category } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const result = await db.run(
      "INSERT INTO plants (name, description, category) VALUES (?, ?, ?)",
      name,
      description || "",
      category || ""
    );

    const newPlant = await db.get(
      "SELECT * FROM plants WHERE id = ?",
      result.lastID
    );
    res.status(201).json(newPlant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create plant" });
  }
}

export async function updatePlant(req, res) {
  try {
    const db = await connectDb();
    const { id } = req.params;
    const { name, description, category } = req.body;

    const existing = await db.get("SELECT * FROM plants WHERE id = ?", id);
    if (!existing) {
      return res.status(404).json({ error: "Plant not found" });
    }

    await db.run(
      "UPDATE plants SET name = ?, description = ?, category = ? WHERE id = ?",
      name || existing.name,
      description || existing.description,
      category || existing.category,
      id
    );

    const updated = await db.get("SELECT * FROM plants WHERE id = ?", id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update plant" });
  }
}

export async function deletePlant(req, res) {
  try {
    const db = await connectDb();
    const { id } = req.params;

    const existing = await db.get("SELECT * FROM plants WHERE id = ?", id);
    if (!existing) {
      return res.status(404).json({ error: "Plant not found" });
    }

    await db.run("DELETE FROM plants WHERE id = ?", id);
    res.json({ message: `Plant ${id} deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete plant" });
  }
}
