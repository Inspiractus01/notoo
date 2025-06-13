import express from "express";
import {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
} from "../controllers/plants.controller.js";

const router = express.Router();

router.get("/", getAllPlants); // GET /plants
router.get("/:id", getPlantById); // GET /plants/:id
router.post("/", createPlant); // POST /plants
router.put("/:id", updatePlant); // PUT /plants/:id
router.delete("/:id", deletePlant); // DELETE /plants/:id

export default router;
