/**
 * Executes after the DOM content is fully loaded.
 * Initializes plant data fetching, search, filtering, and pagination.
 */
document.addEventListener("DOMContentLoaded", () => {
  const plantListEl = document.getElementById("plant-list");
  const searchInput = document.getElementById("search");
  const loadMoreBtn = document.getElementById("load-more");
  const categoryWrapper = document.getElementById("category-chips");

  const ITEMS_PER_PAGE = 15;
  let currentPage = 1;
  let currentQuery = "";
  let currentCategory = "";

  // Initial load
  fetchPlants();
  fetchCategories();

  /**
   * Handles live search input changes.
   * Resets pagination and triggers new plant fetch.
   */
  searchInput.addEventListener("input", () => {
    currentQuery = searchInput.value.toLowerCase().trim();
    currentPage = 1;
    plantListEl.innerHTML = "";
    fetchPlants();
  });

  /**
   * Handles "Load More" button click.
   * Increments the page and loads more plants.
   */
  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    fetchPlants();
  });

  /**
   * Fetches plants from the API with optional filters and pagination.
   * Injects the resulting list into the UI.
   */
  function fetchPlants() {
    let url = `http://localhost:3000/plants?_page=${currentPage}&_limit=${ITEMS_PER_PAGE}`;
    if (currentQuery) {
      url += `&search=${encodeURIComponent(currentQuery)}`;
    }
    if (currentCategory) {
      url += `&category=${encodeURIComponent(currentCategory)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((plants) => {
        if (plants.length === 0 && currentPage === 1) {
          plantListEl.innerHTML = "<p>No plants found 🌱</p>";
        } else {
          renderPlants(plants);
        }
      })
      .catch((err) => {
        console.error("Error fetching plants:", err);
        plantListEl.innerHTML = "<p>Failed to load plants 🌱</p>";
      });
  }

  /**
   * Renders an array of plant objects into the UI as clickable cards.
   * @param {Object[]} plants - Array of plant objects.
   */
  function renderPlants(plants) {
    plants.forEach((plant) => {
      const card = document.createElement("div");
      card.className = "plant-card fade-in";

      card.innerHTML = `
      <a href="../plant/index.html?id=${plant.id}" class="plant-link">
        <h3>${plant.name}</h3>
      </a>
    `;
      plantListEl.appendChild(card);
    });
  }
  /**
   * Fetches all available plant categories from the API and renders filter chips.
   */
  function fetchCategories() {
    fetch("http://localhost:3000/plants/categories")
      .then((res) => res.json())
      .then((categories) => {
        renderCategoryChips(categories);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }

  /**
   * Renders clickable chips for filtering plants by category.
   * @param {string[]} categories - Array of category names.
   */
  function renderCategoryChips(categories) {
    // "All" category chip
    const allChip = document.createElement("div");
    allChip.className = "chip active";
    allChip.innerText = "All";
    allChip.addEventListener("click", () => {
      currentCategory = "";
      currentPage = 1;
      plantListEl.innerHTML = "";
      document
        .querySelectorAll(".chip")
        .forEach((c) => c.classList.remove("active"));
      allChip.classList.add("active");
      fetchPlants();
    });
    categoryWrapper.appendChild(allChip);

    // Individual category chips
    categories.forEach((cat) => {
      const chip = document.createElement("div");
      chip.className = "chip";
      chip.innerText = cat;

      chip.addEventListener("click", () => {
        currentCategory = cat;
        currentPage = 1;
        plantListEl.innerHTML = "";
        document
          .querySelectorAll(".chip")
          .forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        fetchPlants();
      });

      categoryWrapper.appendChild(chip);
    });
  }
});
