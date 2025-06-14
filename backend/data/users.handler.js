import { connectDb } from "../db/db.js";

/**
 * Retrieves all users from the database.
 *
 * @returns {Promise<Object[]>} Array of user objects.
 */
export async function getAllUsersFromDb() {
  const db = await connectDb();
  return await db.all("SELECT * FROM users");
}

/**
 * Retrieves a user by their ID from the database.
 *
 * @param {number|string} id - The ID of the user.
 * @returns {Promise<Object|null>} The user object or null if not found.
 */
export async function getUserByIdFromDb(id) {
  const db = await connectDb();
  return await db.get("SELECT * FROM users WHERE id = ?", id);
}

/**
 * Retrieves a user by their name from the database (used for login).
 *
 * @param {string} name - The user's name.
 * @returns {Promise<Object|null>} The user object or null if not found.
 */
export async function getUserByNameFromDb(name) {
  const db = await connectDb();
  return await db.get("SELECT * FROM users WHERE name = ?", name);
}

/**
 * Creates a new user in the database.
 *
 * @param {Object} data - User data.
 * @param {string} data.name - The user's name.
 * @param {string} data.password - The user's password.
 * @returns {Promise<Object>} The newly created user.
 */
export async function createUserInDb({ name, password }) {
  const db = await connectDb();
  const result = await db.run(
    "INSERT INTO users (name, password) VALUES (?, ?)",
    name,
    password
  );
  return await db.get("SELECT * FROM users WHERE id = ?", result.lastID);
}

/**
 * Updates an existing user's information in the database.
 *
 * @param {number|string} id - The ID of the user to update.
 * @param {Object} data - New user data.
 * @param {string} [data.name] - New name (optional).
 * @param {string} [data.password] - New password (optional).
 * @returns {Promise<Object|null>} The updated user or null if not found.
 */
export async function updateUserInDb(id, { name, password }) {
  const db = await connectDb();
  const existing = await db.get("SELECT * FROM users WHERE id = ?", id);
  if (!existing) return null;

  await db.run(
    "UPDATE users SET name = ?, password = ? WHERE id = ?",
    name || existing.name,
    password || existing.password,
    id
  );
  return await db.get("SELECT * FROM users WHERE id = ?", id);
}

/**
 * Deletes a user from the database.
 *
 * @param {number|string} id - The ID of the user to delete.
 * @returns {Promise<Object>} Result of the deletion operation.
 */
export async function deleteUserInDb(id) {
  const db = await connectDb();
  return await db.run("DELETE FROM users WHERE id = ?", id);
}
