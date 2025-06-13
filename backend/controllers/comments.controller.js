import {
  getCommentsByPlantIdFromDb,
  getCommentByIdFromDb,
  createCommentInDb,
  updateCommentInDb,
  deleteCommentInDb,
} from "../data/comments.handler.js";

/**
 * Retrieves comments from the database.
 * If a plantId is provided as a query param, only comments for that plant are returned.
 *
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 */
export async function getCommentsByPlantId(req, res) {
  try {
    const { plantId } = req.query;
    const comments = await getCommentsByPlantIdFromDb(plantId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
}

/**
 * Retrieves a single comment by its ID.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getCommentById(req, res) {
  try {
    const comment = await getCommentByIdFromDb(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comment" });
  }
}

/**
 * Creates a new comment.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createComment(req, res) {
  try {
    const { plantId, userId, content } = req.body;
    if (!plantId || !userId || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const comment = await createCommentInDb({ plantId, userId, content });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to create comment" });
  }
}

/**
 * Updates an existing comment.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateComment(req, res) {
  try {
    const updated = await updateCommentInDb(req.params.id, req.body.content);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update comment" });
  }
}

/**
 * Deletes a comment by its ID.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteComment(req, res) {
  try {
    await deleteCommentInDb(req.params.id);
    res.json({ message: `Comment ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
}
