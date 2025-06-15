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

    // Fill detail view
    document.getElementById("plant-name").textContent = plant.name;
    document.getElementById("plant-description").textContent =
      plant.description || "N/A";
    document.getElementById("plant-category").textContent =
      plant.category || "N/A";
    document.getElementById("plant-basic-needs").textContent =
      plant.basic_needs || "N/A";

    const imageEl = document.getElementById("plant-image");

    if (plant.image && plant.image.startsWith("/db/media")) {
      imageEl.src = `http://localhost:3000${plant.image}`;
    } else if (plant.image) {
      imageEl.src = plant.image;
    } else {
      imageEl.src = "../../assets/profile/profile-variant1.png";
    }

    imageEl.onerror = () => {
      imageEl.src = "../../assets/profile/profile-variant1.png";
    };

    // Edit modal logic
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

      const fileInput = document.getElementById("edit-image-file");
      const file = fileInput.files[0];

      const updateRes = await fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!updateRes.ok) {
        alert("Failed to update plant.");
        return;
      }

      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const uploadRes = await fetch(`${API}/${id}/images`, {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) {
          alert("Image upload failed.");
          return;
        }
      }

      window.location.reload();
    });

    const deleteImageBtn = document.getElementById("delete-image-button");
    deleteImageBtn.addEventListener("click", async () => {
      const confirmed = confirm("Are you sure you want to delete the image?");
      if (!confirmed) return;

      const delRes = await fetch(`${API}/${id}/images`, {
        method: "DELETE",
      });

      if (delRes.ok) {
        document.getElementById("edit-image-url").value = "";
        alert("Image deleted. Don't forget to save.");
      } else {
        alert("Failed to delete image.");
      }
    });

    // ✅ DELETE PLANT HANDLER – musí byť TU, lebo tu máme `id`
    const deletePlantBtn = document.getElementById("delete-plant-button");
    deletePlantBtn.addEventListener("click", async () => {
      const confirmed = confirm("Are you sure you want to delete this plant?");
      if (!confirmed) return;

      try {
        const res = await fetch(`${API}/${id}`, {
          method: "DELETE",
        });

        if (!res.ok) throw new Error("Delete failed");

        alert("Plant deleted successfully.");
        window.location.href = "../explore/index.html";
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete plant.");
      }
    });
  } catch (err) {
    console.error("Fetch error:", err);
    detailBox.innerHTML = "<p>⚠️ Failed to load plant data.</p>";
  }
});
