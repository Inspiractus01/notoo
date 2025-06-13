import express from "express";
import {
  getCommentsByPlantId,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller.js";

const router = express.Router();

router.get("/", getCommentsByPlantId); // GET /comments?plantId=1
router.get("/:id", getCommentById); // GET /comments/:id
router.post("/", createComment); // POST /comments
router.put("/:id", updateComment); // PUT /comments/:id
router.delete("/:id", deleteComment); // DELETE /comments/:id

export default router;
