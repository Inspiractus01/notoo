import { connectDb } from "./db.js";

const start = async () => {
  const db = await connectDb();
  console.log("✅ Database initialized");
};

start();
