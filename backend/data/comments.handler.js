import { connectDb } from "../db/db.js";

export async function getCommentsByPlantIdFromDb(plantId) {
  const db = await connectDb();
  return await db.all("SELECT * FROM comments WHERE plantId = ?", plantId);
}

export async function getCommentByIdFromDb(id) {
  const db = await connectDb();
  return await db.get("SELECT * FROM comments WHERE id = ?", id);
}

export async function createCommentInDb({ plantId, userId, content }) {
  const db = await connectDb();
  const result = await db.run(
    "INSERT INTO comments (plantId, userId, content) VALUES (?, ?, ?)",
    plantId,
    userId,
    content
  );
  return await db.get("SELECT * FROM comments WHERE id = ?", result.lastID);
}

export async function updateCommentInDb(id, content) {
  const db = await connectDb();
  await db.run("UPDATE comments SET content = ? WHERE id = ?", content, id);
  return await db.get("SELECT * FROM comments WHERE id = ?", id);
}

export async function deleteCommentInDb(id) {
  const db = await connectDb();
  return await db.run("DELETE FROM comments WHERE id = ?", id);
}
