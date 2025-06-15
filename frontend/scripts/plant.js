/**
 * Plant Detail Page Script
 *
 * Handles fetching and displaying plant details, editing via modal,
 * uploading and deleting images, deleting the plant,
 * as well as adding and loading comments.
 *
 * @module plant-detail
 */

const API = "http://localhost:3000/plants";
const COMMENT_API = "http://localhost:3000/comments";

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const detailBox = document.getElementById("plant-detail");

  if (!id) {
    detailBox.innerHTML = "<p>❌ Plant ID is missing in the URL.</p>";
    return;
  }

  try {
    // ─── LOAD PLANT DETAILS ─────────────────────────────

    /**
     * Fetches and displays plant details on the page.
     * Also handles loading the main image and fallbacks.
     */
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

    // ─── EDIT MODAL ─────────────────────────────────────

    /**
     * Opens edit modal and fills form with current plant data.
     */
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

    /**
     * Submits the updated plant info and optional image upload.
     */
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

      modal.classList.add("hidden");
      window.location.reload();
    });

    // ─── DELETE IMAGE ───────────────────────────────────

    /**
     * Deletes current plant image (handled by backend).
     */
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

    // ─── DELETE PLANT ───────────────────────────────────

    /**
     * Deletes the entire plant and redirects user.
     */
    const deletePlantBtn = document.getElementById("delete-plant-button");
    deletePlantBtn.addEventListener("click", async () => {
      const confirmed = confirm("Are you sure you want to delete this plant?");
      if (!confirmed) return;

      try {
        const deleteRes = await fetch(`${API}/${id}`, {
          method: "DELETE",
        });

        if (!deleteRes.ok) throw new Error("Delete failed");

        alert("Plant deleted successfully.");
        window.location.href = "../explore/index.html";
      } catch (error) {
        alert("Failed to delete plant.");
        console.error("Delete plant error:", error);
      }
    });

    // ─── COMMENTS ───────────────────────────────────────

    const commentList = document.getElementById("comment-list");
    const commentForm = document.getElementById("comment-form-container");
    const commentInput = document.getElementById("comment-input");
    const submitCommentBtn = document.getElementById("submit-comment");
    const loginMsg = document.getElementById("login-to-comment-msg");
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (loggedInUser) {
      commentForm.classList.remove("hidden");
      loginMsg.classList.add("hidden");
    } else {
      commentForm.classList.add("hidden");
      loginMsg.classList.remove("hidden");
    }

    /**
     * Returns avatar file name based on avatar ID.
     * @param {number} avatarId - Avatar ID number.
     * @returns {string} Filename of the avatar image.
     */
    function getAvatarFileName(avatarId) {
      switch (avatarId) {
        case 1:
          return "profile-variant1.png";
        case 2:
          return "profile-male.png";
        case 3:
          return "profile-female.png";
        default:
          return "profile-variant1.png";
      }
    }

    /**
     * Loads comments for the current plant and renders them.
     */
    async function loadComments() {
      try {
        const res = await fetch(`${COMMENT_API}?plantId=${id}`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const comments = await res.json();

        commentList.innerHTML = comments
          .map(
            (c) => `
              <div class="comment">
                <img src="../../assets/profile/${getAvatarFileName(
                  c.avatarId
                )}" alt="Avatar" class="comment-avatar" />
                <div>
                  <strong>${c.name || "User"}</strong>
                  <p>${c.content}</p>
                </div>
              </div>`
          )
          .join("");
      } catch (err) {
        commentList.innerHTML = "<p>⚠️ Failed to load comments.</p>";
        console.error("Load comments error:", err);
      }
    }

    /**
     * Handles submitting a new comment for the current plant.
     */
    submitCommentBtn.addEventListener("click", async () => {
      const content = commentInput.value.trim();
      if (!content) return;

      try {
        const res = await fetch(COMMENT_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plantId: id,
            userId: loggedInUser.userId,
            content,
          }),
        });

        if (!res.ok) {
          alert("Failed to add comment.");
          return;
        }

        commentInput.value = "";
        loadComments();
      } catch (err) {
        alert("Failed to add comment.");
      }
    });

    loadComments();

    // ─── END ─────────────────────────────────────────────
  } catch (err) {
    console.error("Fetch error:", err);
    detailBox.innerHTML = "<p>⚠️ Failed to load plant data.</p>";
  }
});
