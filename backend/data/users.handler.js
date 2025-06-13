import { connectDb } from "../db/db.js";

export async function getAllUsersFromDb() {
  const db = await connectDb();
  return await db.all("SELECT * FROM users");
}

export async function getUserByIdFromDb(id) {
  const db = await connectDb();
  return await db.get("SELECT * FROM users WHERE id = ?", id);
}

export async function createUserInDb({ name, email }) {
  const db = await connectDb();
  const result = await db.run(
    "INSERT INTO users (name, email) VALUES (?, ?)",
    name,
    email
  );
  return await db.get("SELECT * FROM users WHERE id = ?", result.lastID);
}

export async function updateUserInDb(id, { name, email }) {
  const db = await connectDb();
  const existing = await db.get("SELECT * FROM users WHERE id = ?", id);
  if (!existing) return null;

  await db.run(
    "UPDATE users SET name = ?, email = ? WHERE id = ?",
    name || existing.name,
    email || existing.email,
    id
  );
  return await db.get("SELECT * FROM users WHERE id = ?", id);
}

export async function deleteUserInDb(id) {
  const db = await connectDb();
  return await db.run("DELETE FROM users WHERE id = ?", id);
}
