import express from "express";
import cors from "cors";
import path from "path";

import plantsRoutes from "./routes/plants.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import usersRoutes from "./routes/users.routes.js";

import { errorHandler } from "./utils/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images (important!)
app.use("/db/media", express.static(path.join(process.cwd(), "db/media")));

// Routes
app.use("/plants", plantsRoutes);
app.use("/comments", commentsRoutes);
app.use("/users", usersRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("🌱 Welcome to the Plant Wiki API!");
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
