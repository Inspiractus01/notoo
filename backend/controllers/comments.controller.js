import {
  getCommentsByPlantIdFromDb,
  getCommentByIdFromDb,
  createCommentInDb,
  updateCommentInDb,
  deleteCommentInDb,
} from "../data/comments.handler.js";

export async function getCommentsByPlantId(req, res) {
  try {
    const { plantId } = req.query;
    const comments = await getCommentsByPlantIdFromDb(plantId);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
}

export async function getCommentById(req, res) {
  try {
    const comment = await getCommentByIdFromDb(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comment" });
  }
}

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

export async function updateComment(req, res) {
  try {
    const updated = await updateCommentInDb(req.params.id, req.body.content);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update comment" });
  }
}

export async function deleteComment(req, res) {
  try {
    await deleteCommentInDb(req.params.id);
    res.json({ message: `Comment ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
}
