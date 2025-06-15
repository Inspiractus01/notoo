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
    imageEl.style.width = "200px";
    imageEl.style.height = "200px";
    imageEl.style.borderRadius = "12px";
    imageEl.style.objectFit = "cover";

    const editBtn = document.getElementById("edit-plant-button");
    const modal = document.getElementById("edit-plant-modal");
    const closeModal = document.getElementById("close-edit-modal");
    const form = document.getElementById("edit-plant-form");

    editBtn.addEventListener("click", () => {
      document.getElementById("edit-description").value =
        plant.description || "";
      document.getElementById("edit-category").value = plant.category || "";
      document.getElementById("edit-basic-needs").value =
        plant.basic_needs || "";
      document.getElementById("edit-image-url").value = plant.image || "";
      modal.classList.remove("hidden");
    });

    closeModal.addEventListener("click", () => {
      modal.classList.add("hidden");
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const updated = {
        description: document.getElementById("edit-description").value,
        category: document.getElementById("edit-category").value,
        basic_needs: document.getElementById("edit-basic-needs").value,
        image: document.getElementById("edit-image-url").value,
      };
      try {
        const res = await fetch(`${API}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        });
        if (res.ok) {
          window.location.reload();
        } else {
          alert("Failed to update plant.");
        }
      } catch (err) {
        console.error("Update error:", err);
        alert("Update failed.");
      }
    });

    const deleteImageBtn = document.getElementById("delete-image-button");
    deleteImageBtn.addEventListener("click", () => {
      document.getElementById("edit-image-url").value = "";
    });
  } catch (err) {
    console.error("Fetch error:", err);
    document.getElementById("plant-detail").innerHTML =
      "<p>⚠️ Failed to load plant data.</p>";
  }
});
