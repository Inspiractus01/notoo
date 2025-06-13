import {
  getAllUsersFromDb,
  getUserByIdFromDb,
  createUserInDb,
  updateUserInDb,
  deleteUserInDb,
} from "../data/users.handler.js";

/**
 * Retrieves all users from the database.
 *
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 */
export async function getAllUsers(req, res) {
  try {
    const users = await getAllUsersFromDb();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

/**
 * Retrieves a user by ID.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getUserById(req, res) {
  try {
    const user = await getUserByIdFromDb(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
}

/**
 * Creates a new user in the database.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createUser(req, res) {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and email required" });
    }
    const user = await createUserInDb({ name, email });
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to create user" });
  }
}

/**
 * Updates an existing user by ID.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateUser(req, res) {
  try {
    const updated = await updateUserInDb(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update user" });
  }
}

/**
 * Deletes a user from the database by ID.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deleteUser(req, res) {
  try {
    await deleteUserInDb(req.params.id);
    res.json({ message: `User ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
}
