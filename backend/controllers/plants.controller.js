import {
  getAllPlantsFromDb,
  getPlantByIdFromDb,
  createPlantInDb,
  updatePlantInDb,
  deletePlantInDb,
  searchPlantsFromDb,
} from "../data/plants.handler.js";

/**
 * Retrieves all plants or filtered plants by search and/or category.
 *
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 */
export async function getAllPlants(req, res) {
  try {
    const { search, category } = req.query;

    if (search || category) {
      const filtered = await searchPlantsFromDb({ search, category });
      return res.json(filtered);
    }

    const plants = await getAllPlantsFromDb();
    res.json(plants);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch plants" });
  }
}

/**
 * Retrieves a plant by its ID.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function getPlantById(req, res) {
  try {
    const plant = await getPlantByIdFromDb(req.params.id);
    if (!plant) return res.status(404).json({ error: "Plant not found" });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch plant" });
  }
}

/**
 * Creates a new plant in the database.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createPlant(req, res) {
  try {
    const { name, description, category } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    const plant = await createPlantInDb({ name, description, category });
    res.status(201).json(plant);
  } catch (err) {
    res.status(500).json({ error: "Failed to create plant" });
  }
}

/**
 * Updates an existing plant by ID.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updatePlant(req, res) {
  try {
    const updated = await updatePlantInDb(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: "Plant not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update plant" });
  }
}

/**
 * Deletes a plant by its ID.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function deletePlant(req, res) {
  try {
    await deletePlantInDb(req.params.id);
    res.json({ message: `Plant ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete plant" });
  }
}
