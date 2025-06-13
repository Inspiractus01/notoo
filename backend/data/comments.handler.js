import { connectDb } from "../db/db.js";

/**
 * Retrieves all comments or comments for a specific plant from the database.
 *
 * @param {number|string} [plantId] - Optional ID of the plant to filter comments.
 * @returns {Promise<Object[]>} Array of comment objects.
 */
export async function getCommentsByPlantIdFromDb(plantId) {
  const db = await connectDb();
  if (plantId) {
    return await db.all("SELECT * FROM comments WHERE plantId = ?", plantId);
  }
  return await db.all("SELECT * FROM comments");
}

/**
 * Retrieves a specific comment by its ID from the database.
 *
 * @param {number|string} id - The ID of the comment.
 * @returns {Promise<Object|null>} The comment object or null if not found.
 */
export async function getCommentByIdFromDb(id) {
  const db = await connectDb();
  return await db.get("SELECT * FROM comments WHERE id = ?", id);
}

/**
 * Inserts a new comment into the database.
 *
 * @param {Object} data - Comment data.
 * @param {number|string} data.plantId - ID of the related plant.
 * @param {number|string} data.userId - ID of the user who posted the comment.
 * @param {string} data.content - The content of the comment.
 * @returns {Promise<Object>} The newly created comment.
 */
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

/**
 * Updates an existing comment in the database.
 *
 * @param {number|string} id - ID of the comment to update.
 * @param {string} content - New content for the comment.
 * @returns {Promise<Object>} The updated comment.
 */
export async function updateCommentInDb(id, content) {
  const db = await connectDb();
  await db.run("UPDATE comments SET content = ? WHERE id = ?", content, id);
  return await db.get("SELECT * FROM comments WHERE id = ?", id);
}

/**
 * Deletes a comment from the database.
 *
 * @param {number|string} id - ID of the comment to delete.
 * @returns {Promise<Object>} The result of the deletion operation.
 */
export async function deleteCommentInDb(id) {
  const db = await connectDb();
  return await db.run("DELETE FROM comments WHERE id = ?", id);
}
