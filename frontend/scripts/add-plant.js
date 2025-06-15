document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-plant-form");
  const message = document.getElementById("add-message");
  const categoryInput = document.getElementById("plant-category");
  const chipContainer = document.createElement("div");

  chipContainer.classList.add("chip-wrapper");
  categoryInput.insertAdjacentElement("afterend", chipContainer);

  // STEP 0: Fetch available categories
  async function loadCategories() {
    try {
      const res = await fetch("http://localhost:3000/categories");
      const categories = await res.json();

      chipContainer.innerHTML = "";

      categories.forEach((cat) => {
        const chip = document.createElement("button");
        chip.classList.add("chips");
        chip.textContent = cat;
        chip.addEventListener("click", () => {
          categoryInput.value = cat;
        });
        chipContainer.appendChild(chip);
      });
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  }
  function fetchCategories() {
    fetch("http://localhost:3000/plants/categories")
      .then((res) => res.json())
      .then((categories) => {
        renderCategoryChips(categories);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }

  function renderCategoryChips(categories) {
    const categoryInput = document.getElementById("plant-category");
    const chipWrapper = document.getElementById("category-chips");

    chipWrapper.innerHTML = "";

    categories.forEach((cat) => {
      const chip = document.createElement("button");
      chip.className = "chips";
      chip.textContent = cat;
      chip.addEventListener("click", () => {
        categoryInput.value = cat;
      });
      chipWrapper.appendChild(chip);
    });
  }

  // Call after DOM is ready
  fetchCategories();

  loadCategories();

  // FORM SUBMIT
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    message.textContent = "";

    const name = document.getElementById("plant-name").value.trim();
    const description = document
      .getElementById("plant-description")
      .value.trim();
    const category = categoryInput.value.trim();
    const basic_needs = document
      .getElementById("plant-basic-needs")
      .value.trim();
    const imageInput = document.getElementById("plant-image");

    if (!name || !description || !basic_needs) {
      message.textContent = "Please fill out all required fields.";
      message.style.color = "red";
      return;
    }

    try {
      let imageUrl = "";

      if (imageInput.files.length > 0) {
        const formData = new FormData();
        formData.append("file", imageInput.files[0]);

        const uploadRes = await fetch("http://localhost:3000/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed");

        const uploadData = await uploadRes.json();
        imageUrl = uploadData.path || "";
      }

      const res = await fetch("http://localhost:3000/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          category,
          basic_needs,
          image: imageUrl,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add plant");
      }

      form.reset();
      message.textContent = "Plant successfully added!";
      message.style.color = "green";
    } catch (err) {
      console.error(err);
      message.textContent = err.message || "Something went wrong.";
      message.style.color = "red";
    }
  });
});
