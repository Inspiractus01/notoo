import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000";

const users = [
  { name: "Alice", password: "pass1", avatarId: 1 },
  { name: "Bob", password: "pass2", avatarId: 2 },
  { name: "Charlie", password: "pass3", avatarId: 3 },
];

const plants = [
  {
    name: "Rose",
    description: "A beautiful red rose.",
    category: "Flower",
    image: "",
    basic_needs: "Water daily",
  },
  {
    name: "Cactus",
    description: "Needs little water.",
    category: "Succulent",
    image: "",
    basic_needs: "Water weekly",
  },
  {
    name: "Bamboo",
    description: "Fast growing plant.",
    category: "Grass",
    image: "",
    basic_needs: "Indirect sunlight",
  },
];

const comments = [
  {
    plantName: "Rose",
    userName: "Alice",
    content: "I love this flower!",
  },
  {
    plantName: "Cactus",
    userName: "Bob",
    content: "Easy to take care of.",
  },
  {
    plantName: "Bamboo",
    userName: "Charlie",
    content: "Grows really fast.",
  },
];

async function seed() {
  try {
    // 1. Vytvor userov a ulož mapping meno -> id
    const userIdMap = {};
    for (const user of users) {
      const res = await fetch(`${BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          `Failed to create user ${user.name}: ${
            data.error || JSON.stringify(data)
          }`
        );
      userIdMap[user.name] = data.id || data.userId || data.id;
    }

    // 2. Vytvor rastliny a ulož mapping meno -> id
    const plantIdMap = {};
    for (const plant of plants) {
      const res = await fetch(`${BASE_URL}/plants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(plant),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          `Failed to create plant ${plant.name}: ${
            data.error || JSON.stringify(data)
          }`
        );
      plantIdMap[plant.name] = data.id || data.plantId || data.id;
    }

    // 3. Vytvor komentáre podľa ID používateľov a rastlín
    for (const comment of comments) {
      const userId = userIdMap[comment.userName];
      const plantId = plantIdMap[comment.plantName];
      if (!userId || !plantId) {
        console.warn(
          `Skipping comment: userId or plantId missing for ${comment.userName} / ${comment.plantName}`
        );
        continue;
      }
      const res = await fetch(`${BASE_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plantId,
          userId,
          content: comment.content,
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(
          `Failed to create comment: ${data.error || JSON.stringify(data)}`
        );
    }

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

seed();
