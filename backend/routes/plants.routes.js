import express from "express";
import {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getPlantCategories,
} from "../controllers/plants.controller.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  uploadPlantImage,
  deletePlantImage,
} from "../controllers/plants.controller.js";

const router = express.Router();
router.patch("/:id", updatePlant); // PATCH /plants/:id - Partial update
router.get("/categories", getPlantCategories); // GET /plants/categories - Retrieve all unique plant categories
router.get("/", getAllPlants); // GET /plants
router.get("/:id", getPlantById); // GET /plants/:id
router.post("/", createPlant); // POST /plants
router.put("/:id", updatePlant); // PUT /plants/:id
router.delete("/:id", deletePlant); // DELETE /plants/:id

// Image upload routes
router.post("/:id/images", upload.single("image"), uploadPlantImage); // POST /plants/:id/images - Upload plant image
router.delete("/:id/images", deletePlantImage); // DELETE /plants/:id/images - Delete plant image

export default router;
