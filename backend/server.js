// server.js
import express from "express";
import cors from "cors";

import plantsRoutes from "./routes/plants.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import usersRoutes from "./routes/users.routes.js";

import { errorHandler } from "./utils/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

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
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
