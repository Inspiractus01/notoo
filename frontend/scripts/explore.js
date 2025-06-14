document.addEventListener("DOMContentLoaded", () => {
  const plantListEl = document.getElementById("plant-list");
  const searchInput = document.getElementById("search");
  const loadMoreBtn = document.getElementById("load-more");
  const categoryWrapper = document.getElementById("category-chips");

  const ITEMS_PER_PAGE = 15;

  let currentPage = 1;
  let currentQuery = "";
  let currentCategory = "";

  // Inicializácia
  fetchPlants();
  fetchCategories();

  // Vyhľadávanie podľa názvu
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

  // Načítanie rastlín
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

  // Vykresli rastliny do UI
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

  // Načítanie kategórií
  function fetchCategories() {
    fetch("http://localhost:3000/plants/categories")
      .then((res) => res.json())
      .then((categories) => {
        renderCategoryChips(categories);
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }

  // Vykreslenie chipov
  function renderCategoryChips(categories) {
    // Chip "All"
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

    // Ostatné kategórie
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
