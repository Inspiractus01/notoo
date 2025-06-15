import fs from "fs";
import path from "path";
import {
  getAllPlantsFromDb,
  getPlantByIdFromDb,
  createPlantInDb,
  updatePlantInDb,
  deletePlantInDb,
  searchPlantsFromDb,
  getPlantCountFromDb,
  getAllCategoriesFromDb,
  getUniqueCategoriesFromDb,
} from "../data/plants.handler.js";

export async function getAllPlants(req, res) {
  try {
    const { search, category, _limit, _page } = req.query;

    const limit = parseInt(_limit) || 25;
    const page = parseInt(_page) || 1;
    const offset = (page - 1) * limit;

    let plants = [];
    let total = 0;

    if (search || category) {
      const filtered = await searchPlantsFromDb({ search, category });
      total = filtered.length;
      plants = filtered.slice(offset, offset + limit);
    } else {
      total = await getPlantCountFromDb();
      plants = await getAllPlantsFromDb({ limit, offset });
    }

    res.setHeader("X-Total-Count", total);
    res.json(plants);
  } catch (err) {
    console.error("getAllPlants error:", err);
    res.status(500).json({ error: "Failed to fetch plants" });
  }
}

export async function getPlantById(req, res) {
  try {
    const plant = await getPlantByIdFromDb(req.params.id);
    if (!plant) return res.status(404).json({ error: "Plant not found" });
    res.json(plant);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch plant" });
  }
}

export async function createPlant(req, res) {
  try {
    const { name, description, category, image, basic_needs } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    const plant = await createPlantInDb({
      name,
      description,
      category,
      image,
      basic_needs,
    });

    res.status(201).json(plant);
  } catch (err) {
    console.error("createPlant error:", err);
    res.status(500).json({ error: "Failed to create plant" });
  }
}

export async function updatePlant(req, res) {
  try {
    const { name, description, category, image, basic_needs } = req.body;

    const updated = await updatePlantInDb(req.params.id, {
      name,
      description,
      category,
      image,
      basic_needs,
    });

    if (!updated) return res.status(404).json({ error: "Plant not found" });
    res.json(updated);
  } catch (err) {
    console.error("updatePlant error:", err);
    res.status(500).json({ error: "Failed to update plant" });
  }
}

export async function deletePlant(req, res) {
  try {
    await deletePlantInDb(req.params.id);
    res.json({ message: `Plant ${req.params.id} deleted` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete plant" });
  }
}

export async function getAllCategories(req, res) {
  try {
    const categories = await getAllCategoriesFromDb();
    res.json(categories);
  } catch (err) {
    console.error("getAllCategories error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}

export async function getPlantCategories(req, res) {
  try {
    const categories = await getUniqueCategoriesFromDb();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
}

// ✅ New: Upload plant image
export async function uploadPlantImage(req, res) {
  try {
    const id = req.params.id;
    const plant = await getPlantByIdFromDb(id);
    if (!plant) return res.status(404).json({ error: "Plant not found" });

    // Delete old image file if it exists
    if (plant.image) {
      const oldPath = path.join("db/media", path.basename(plant.image));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const imagePath = `/db/media/${req.file.filename}`;
    const updated = await updatePlantInDb(id, { image: imagePath });

    res.json(updated);
  } catch (err) {
    console.error("uploadPlantImage error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
}

export async function deletePlantImage(req, res) {
  try {
    const id = req.params.id;
    const plant = await getPlantByIdFromDb(id);
    if (!plant) return res.status(404).json({ error: "Plant not found" });

    if (plant.image) {
      const imagePath = path.join("db/media", path.basename(plant.image));
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    const updated = await updatePlantInDb(id, { image: "" });
    res.json(updated);
  } catch (err) {
    console.error("deletePlantImage error:", err);
    res.status(500).json({ error: "Failed to delete image" });
  }
}
