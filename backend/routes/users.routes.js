import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = express.Router();

router.get("/", getAllUsers); // GET /users
router.get("/:id", getUserById); // GET /users/:id
router.post("/", createUser); // POST /users
router.put("/:id", updateUser); // PUT /users/:id
router.delete("/:id", deleteUser); // DELETE /users/:id

export default router;
