import { connectDb } from "../db/db.js";

const start = async () => {
  const db = await connectDb();
  console.log("✅ Database initialized");
};

start();
