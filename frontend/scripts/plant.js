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

    // --- KOMENTÁRE ---
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

    async function loadComments() {
      try {
        const res = await fetch(`${COMMENT_API}?plantId=${id}`);
        if (!res.ok) throw new Error("Failed to fetch comments");
        const comments = await res.json();

        // Debug: log to check data structure
        console.log("Loaded comments:", comments);

        commentList.innerHTML = comments
          .map(
            (c) => `
              <div class="comment">
                <img src="../../assets/profile/${
                  c.avatarId
                    ? `profile-variant${c.avatarId}.png`
                    : "profile-variant1.png"
                }" alt="Avatar" class="comment-avatar" />
                <div>
                  <strong>${c.name || "User"}</strong>
                  <p>${c.content}</p>
                </div>
              </div>
            `
          )
          .join("");
      } catch (err) {
        commentList.innerHTML = "<p>⚠️ Failed to load comments.</p>";
        console.error("Load comments error:", err);
      }
    }

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
    // --- END KOMENTÁRE ---
  } catch (err) {
    console.error("Fetch error:", err);
    detailBox.innerHTML = "<p>⚠️ Failed to load plant data.</p>";
  }
});
