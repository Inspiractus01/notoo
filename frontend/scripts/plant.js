// scripts/plant.js

const API = "http://localhost:3000/plants";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  const detailBox = document.getElementById("plant-detail");

  if (!id) {
    detailBox.innerHTML = "<p>❌ Plant ID is missing in the URL.</p>";
    return;
  }

  try {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error("Plant not found");

    const plant = await res.json();

    detailBox.innerHTML = `
      <h1>${plant.name}</h1>
      ${
        plant.image
          ? `<img src="${plant.image}" alt="${plant.name}" class="plant-image" />`
          : "<p><em>No image provided.</em></p>"
      }
      <p><strong>Description:</strong> ${plant.description || "N/A"}</p>
      <p><strong>Category:</strong> ${plant.category || "N/A"}</p>
      <p><strong>Basic Needs:</strong> ${plant.basic_needs || "N/A"}</p>
      <a href="../explore/index.html" class="explore-button">← Back to Explore</a>
    `;
  } catch (err) {
    console.error("Fetch error:", err);
    detailBox.innerHTML = "<p>⚠️ Failed to load plant data.</p>";
  }
});
