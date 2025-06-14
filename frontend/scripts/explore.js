document.addEventListener("DOMContentLoaded", () => {
  const plantListEl = document.getElementById("plant-list");
  const searchInput = document.getElementById("search");

  let allPlants = [];

  // Fetch plants from API
  fetch("http://localhost:3000/plants")
    .then((res) => res.json())
    .then((plants) => {
      allPlants = plants;
      renderPlants(allPlants);

      searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase().trim();
        const filtered = allPlants.filter((plant) =>
          plant.name.toLowerCase().includes(query)
        );
        renderPlants(filtered);
      });
    })
    .catch((err) => {
      plantListEl.innerHTML = "<p>Failed to load plants 🌱</p>";
      console.error(err);
    });

  function renderPlants(plants) {
    // Fade out existing cards first
    const currentCards = document.querySelectorAll(".plant-card");
    currentCards.forEach((card) => {
      card.classList.remove("fade-in");
      card.classList.add("fade-out");
      setTimeout(() => card.remove(), 300);
    });

    if (plants.length === 0) {
      const noResult = document.createElement("div");
      noResult.className = "plant-card fade-in";
      noResult.textContent = "No plants found.";
      plantListEl.appendChild(noResult);
      return;
    }

    plants.forEach((plant) => {
      const card = document.createElement("div");
      card.className = "plant-card";
      card.innerHTML = `
        <h3>${plant.name}</h3>
        <p><strong>Category:</strong> ${plant.category}</p>
        <p>${plant.description}</p>
      `;
      plantListEl.appendChild(card);

      // Trigger fade-in
      requestAnimationFrame(() => card.classList.add("fade-in"));
    });
  }
});
