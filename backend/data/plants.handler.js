import { connectDb } from "../db/db.js";

/**
 * Retrieves plants with optional pagination support.
 *
 * @param {Object} options
 * @param {number} [options.limit] - Number of items to return.
 * @param {number} [options.offset] - Number of items to skip.
 * @returns {Promise<Object[]>} Array of plant objects.
 */
export async function getAllPlantsFromDb({ limit, offset } = {}) {
  const db = await connectDb();

  let query = "SELECT * FROM plants";
  const params = [];

  if (typeof limit === "number") {
    query += " LIMIT ?";
    params.push(limit);

    if (typeof offset === "number") {
      query += " OFFSET ?";
      params.push(offset);
    }
  }

  return await db.all(query, ...params);
}
export async function getPlantCountFromDb() {
  const db = await connectDb();
  const result = await db.get("SELECT COUNT(*) as count FROM plants");
  return result.count;
}
/**
 * Retrieves a plant by its ID.
 *
 * @param {number|string} id - The ID of the plant to retrieve.
 * @returns {Promise<Object|null>} The plant object or null if not found.
 */
export async function getPlantByIdFromDb(id) {
  const db = await connectDb();
  return await db.get("SELECT * FROM plants WHERE id = ?", id);
}

/**
 * Creates a new plant entry in the database.
 *
 * @param {Object} data - The plant data.
 * @param {string} data.name - The name of the plant.
 * @param {string} [data.description] - Optional description of the plant.
 * @param {string} [data.category] - Optional category of the plant.
 * @returns {Promise<Object>} The newly created plant.
 */
export async function createPlantInDb({ name, description, category }) {
  const db = await connectDb();
  const result = await db.run(
    "INSERT INTO plants (name, description, category) VALUES (?, ?, ?)",
    name,
    description || "",
    category || ""
  );
  return await db.get("SELECT * FROM plants WHERE id = ?", result.lastID);
}

/**
 * Updates an existing plant in the database.
 *
 * @param {number|string} id - The ID of the plant to update.
 * @param {Object} data - The updated plant data.
 * @param {string} [data.name] - New name (optional).
 * @param {string} [data.description] - New description (optional).
 * @param {string} [data.category] - New category (optional).
 * @returns {Promise<Object|null>} The updated plant object or null if not found.
 */
export async function updatePlantInDb(id, data) {
  const db = await connectDb();
  const existing = await db.get("SELECT * FROM plants WHERE id = ?", id);
  if (!existing) return null;

  await db.run(
    "UPDATE plants SET name = ?, description = ?, category = ? WHERE id = ?",
    data.name || existing.name,
    data.description || existing.description,
    data.category || existing.category,
    id
  );
  return await db.get("SELECT * FROM plants WHERE id = ?", id);
}

/**
 * Deletes a plant from the database by ID.
 *
 * @param {number|string} id - The ID of the plant to delete.
 * @returns {Promise<Object>} The result of the deletion operation.
 */
export async function deletePlantInDb(id) {
  const db = await connectDb();
  return await db.run("DELETE FROM plants WHERE id = ?", id);
}

/**
 * Searches for plants based on optional name and/or category.
 *
 * @param {Object} filters - Search filters.
 * @param {string} [filters.search] - Text to search in plant names.
 * @param {string} [filters.category] - Category to filter by.
 * @returns {Promise<Object[]>} Array of matched plant objects.
 */
export async function searchPlantsFromDb({ search, category }) {
  const db = await connectDb();
  let query = "SELECT * FROM plants";
  const params = [];

  if (search || category) {
    query += " WHERE";
    if (search) {
      query += " name LIKE ?";
      params.push(`%${search}%`);
    }
    if (search && category) {
      query += " AND";
    }
    if (category) {
      query += " category = ?";
      params.push(category);
    }
  }

  return await db.all(query, ...params);
}
