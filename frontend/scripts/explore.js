/**
 * Handles plant listing logic on the Explore page.
 *
 * - Always shows the "Load more" button
 * - Displays 20 plants per page (5x4 grid)
 * - Supports search by name
 * - Loads next page on button click
 * - Fetches paginated data from backend API
 *
 * Backend endpoint: http://localhost:3000/plants?_page=1&_limit=20
 */

document.addEventListener("DOMContentLoaded", () => {
  const plantListEl = document.getElementById("plant-list");
  const searchInput = document.getElementById("search");
  const loadMoreBtn = document.getElementById("load-more");

  /** @constant {number} Number of items per page */
  const ITEMS_PER_PAGE = 15;

  /** @type {number} Current page number (starts at 1) */
  let currentPage = 1;

  /** @type {string} Current search query */
  let currentQuery = "";

  // Initial load
  fetchPlants();

  // Handle input in search bar
  searchInput.addEventListener("input", () => {
    currentQuery = searchInput.value.toLowerCase().trim();
    currentPage = 1;
    plantListEl.innerHTML = "";
    fetchPlants();
  });

  // Load more handler
  loadMoreBtn.addEventListener("click", () => {
    currentPage++;
    fetchPlants();
  });

  /**
   * Fetches plant data from backend API and renders them
   */
  function fetchPlants() {
    let url = `http://localhost:3000/plants?_page=${currentPage}&_limit=${ITEMS_PER_PAGE}`;
    if (currentQuery) {
      url += `&search=${encodeURIComponent(currentQuery)}`;
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
   * Renders given list of plants into the UI
   * @param {Object[]} plants
   */
  function renderPlants(plants) {
    plants.forEach((plant) => {
      const card = document.createElement("div");
      card.className = "plant-card fade-in";
      card.innerHTML = `
        <h3>${plant.name}</h3>
        <p><strong>Category:</strong> ${plant.category || "N/A"}</p>
        <p>${plant.description || ""}</p>
      `;
      plantListEl.appendChild(card);
    });
  }
});
