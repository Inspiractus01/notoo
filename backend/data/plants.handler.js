import { connectDb } from "../db/db.js";

export async function getAllPlantsFromDb() {
  const db = await connectDb();
  return await db.all("SELECT * FROM plants");
}

export async function getPlantByIdFromDb(id) {
  const db = await connectDb();
  return await db.get("SELECT * FROM plants WHERE id = ?", id);
}

export async function createPlantInDb({ name, description, category }) {
  const db = await connectDb();
  const result = await db.run(
    "INSERT INTO plants (name, description, category) VALUES (?, ?, ?)",
    name,
    description || "",
    category || ""
  );
  return await db.get("SELECT * FROM plants WHERE id = ?", result.lastID);
}

export async function updatePlantInDb(id, data) {
  const db = await connectDb();
  const existing = await db.get("SELECT * FROM plants WHERE id = ?", id);
  if (!existing) return null;

  await db.run(
    "UPDATE plants SET name = ?, description = ?, category = ? WHERE id = ?",
    data.name || existing.name,
    data.description || existing.description,
    data.category || existing.category,
    id
  );
  return await db.get("SELECT * FROM plants WHERE id = ?", id);
}

export async function deletePlantInDb(id) {
  const db = await connectDb();
  return await db.run("DELETE FROM plants WHERE id = ?", id);
}
