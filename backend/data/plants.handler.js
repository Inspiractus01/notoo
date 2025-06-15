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
 * @param {string} data.name - The name of the plant (required).
 * @param {string} [data.description] - Optional description of the plant.
 * @param {string} [data.category] - Optional category of the plant.
 * @param {string} [data.image] - Optional image URL or path.
 * @param {string} [data.basic_needs] - Optional basic care instructions or requirements.
 * @returns {Promise<Object>} The newly created plant object from the database.
 */
export async function createPlantInDb({
  name,
  description,
  category,
  image,
  basic_needs,
}) {
  const db = await connectDb();
  const result = await db.run(
    `INSERT INTO plants (name, description, category, image, basic_needs) 
     VALUES (?, ?, ?, ?, ?)`,
    name,
    description || "",
    category || "",
    image || "",
    basic_needs || ""
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
 * @param {string} [data.image] - New image URL (optional).
 * @param {string} [data.basic_needs] - New care instructions (optional).
 * @returns {Promise<Object|null>} The updated plant object or null if not found.
 */
export async function updatePlantInDb(id, data) {
  const db = await connectDb();
  const existing = await db.get("SELECT * FROM plants WHERE id = ?", id);
  if (!existing) return null;

  const updated = {
    name: data.name ?? existing.name,
    description: data.description ?? existing.description,
    category: data.category ?? existing.category,
    image: data.image ?? existing.image,
    basic_needs: data.basic_needs ?? existing.basic_needs,
  };

  await db.run(
    `UPDATE plants
     SET name = ?, description = ?, category = ?, image = ?, basic_needs = ?
     WHERE id = ?`,
    updated.name,
    updated.description,
    updated.category,
    updated.image,
    updated.basic_needs,
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

/**
 * Retrieves all unique plant categories from the database.
 *
 * @returns {Promise<string[]>} Array of unique category names.
 */
export async function getAllCategoriesFromDb() {
  const db = await connectDb();
  const rows = await db.all(
    "SELECT DISTINCT category FROM plants WHERE category IS NOT NULL AND category != ''"
  );
  return rows.map((row) => row.category);
}

export async function getUniqueCategoriesFromDb() {
  const db = await connectDb();
  const rows = await db.all(
    "SELECT DISTINCT category FROM plants WHERE category IS NOT NULL AND category != ''"
  );
  return rows.map((row) => row.category);
}
