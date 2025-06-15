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

    document.getElementById("plant-name").textContent = plant.name;
    document.getElementById("plant-description").textContent =
      plant.description || "N/A";
    document.getElementById("plant-category").textContent =
      plant.category || "N/A";
    document.getElementById("plant-basic-needs").textContent =
      plant.basic_needs || "N/A";

    const imageEl = document.getElementById("plant-image");
    if (plant.image) {
      imageEl.src = plant.image;
      imageEl.alt = plant.name;
    } else {
      imageEl.src = "../../assets/profile/profile-variant1.png";
      imageEl.alt = "Default plant image";
    }
  } catch (err) {
    console.error("Fetch error:", err);
    document.getElementById("plant-detail").innerHTML =
      "<p>⚠️ Failed to load plant data.</p>";
  }
});
